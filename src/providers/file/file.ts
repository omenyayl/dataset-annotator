import {Injectable, NgZone} from '@angular/core';
import {remote} from 'electron';
import {Observable} from "rxjs/Observable";
import {catchError} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import * as fs from 'fs';
import * as path from 'path';
import {Subject} from "rxjs/Subject";
import FileFilter = Electron.FileFilter;
import Size = Electron.Size;

let {dialog, screen} = remote;
let actionOutputName = 'actions.json';

@Injectable()
export class FileProvider {

    selectedFolder: string; // The chosen directory
    selectedSaveFolder: string; // The chosen directory for saving annotations

    filesChange: Subject<string[]> = new Subject<string[]>(); // Subject containing a list of files found
    filesLoading: Subject<boolean> = new Subject<boolean>(); // Indicates whether the listFiles() operation is ongoing
    static systemResolution: Size;


    constructor(private ngZone: NgZone) {
        FileProvider.systemResolution = screen.getPrimaryDisplay().size;
    }

    /**
     * Opens a directory dialog box handled by the OS.
     * @param {"openFile" | "openDirectory"} properties
     * @param filters {FileFilter[]} Files to filter according to the following extensions
     * @returns {Observable<string>}
     */
    showOpenDialog(properties?: "openFile" | "openDirectory", filters?: FileFilter[]): Observable<string> {

        return new Observable<string>((observer) => {
            if (!properties) {
                properties = 'openDirectory';
            }
            dialog.showOpenDialog({
                properties: [properties],
                ...(filters && {
                    filters: filters
                })
            }, (path) => {
                if (!path) {
                    observer.error();
                } else {
                    observer.next(path[0]);
                }
                observer.complete();
            })
        }).pipe(
            catchError(this.handleError('showOpenDialog()', ''))
        )

    }

    showSaveDialog(filters?: FileFilter[]): Observable<string> {
        return new Observable<string>((observer) => {
            dialog.showSaveDialog(undefined, {
                title: 'Save annotations',
                ...(filters && {
                    filters: filters
                })
            }, filename => {
                if (!filename) {
                    observer.error();
                } else {
                    observer.next(filename);
                }
                observer.complete();
            })
        }).pipe(
            catchError(this.handleError('showSaveDialog()', ''))
        );
    }

    /**
     * Lists all of the file in a given directory. If an extensions argument is supplied, then this function
     * lists only the files with the extensions.
     * @param {string} directoryPath
     * @param {string[]} extensions
     * @returns {Observable<string[]>}
     */
    listFiles(directoryPath: string, extensions?: string[]): Observable<string[]> {
        return new Observable<string[]>((observer) => {
            this.ngZone.run(() => {
                this.filesLoading.next(true);
            });
            if (!fs.existsSync(directoryPath)) {
                observer.error('Directory does not exist!');
                observer.complete();
            } else {
                fs.readdir(directoryPath, (err, files: string[]) => {
                    if (err) {
                        console.error(`Cannot read path ${err}!`);
                    } else {
                        if (!extensions) {
                            observer.next(files);
                        } else {
                            let outFiles: string[] = files.filter((file) => {
                                return extensions.indexOf(path.extname(file)) != -1;
                            });
                            observer.next(outFiles);
                        }
                        observer.complete();
                    }
                });
            }

        }).pipe(
            catchError((error: any): Observable<any> => {
                this.ngZone.run(() => {
                    this.filesLoading.next(false);
                });
                console.log(`Caught error when listing files: ${error}`);
                return of(null);
            })
        );

    }

	/**
	 * Handle saving of data from annotator
	 * Data is to be taken from the data defining directive(s)
	 * @param data - The data to be saved
	 */
	saveFiles(data: Object): Observable<any> {
		return new Observable<any>((observer) => {
		    console.log('saving the following: ');
		  	console.log(data['frames']);
		  	for(let imageFile in data['frames']){
			  	if(data.hasOwnProperty(imageFile)){
				  	let _imageFile = path.basename(imageFile);
					let outputName = _imageFile.replace(path.extname(_imageFile), ".json");
				  	let _data = JSON.stringify(data[imageFile], null, 4);
				  	console.log('saveFiles is going to save ');
					console.log(_imageFile);

					// You can't simply concatenate two paths with +. Windows paths are nasty
		  			fs.writeFile(path.join(this.selectedSaveFolder, outputName), _data, 'utf8', (err) => {
						if(err){
							observer.error(err);
						} else {
						    observer.next();
                        }
					});
				}
			}
		  	console.log('saving the following: ');
			let _data = JSON.stringify(data['actions'], null, 4);
		  	console.log(_data);
			fs.writeFile(path.join(this.selectedSaveFolder, actionOutputName), _data, 'utf8', (err) => {
				if(err){
					observer.error(err);
				}else{
					observer.next();
				}
			});
		  	observer.complete();
		}).pipe(
		    catchError(this.handleError('File.saveFileDialog()', null))
        )
  	}

    /**
     * Handle saving of data from annotator - New version
     * Data is to be taken from the data defining directive(s)
     * ***This method saves all annotations into a single file***
     * @param data
     * @param {string} location
     * @returns {Observable<any>}
     */
	saveFile(data: any, location: string): Observable<boolean> {
		return new Observable<any>((observer) => {
			let _data = JSON.stringify(data, null, 4);
			fs.writeFile(location, _data, 'utf8', (err) => {
				if(err){
					observer.error(err);
				}else{
					observer.next(true);
				}
                observer.complete();
            });
		}).pipe(
		    catchError(this.handleError('File.saveFiles()', false))
        )
  	}

  	loadJSON(path: string): Observable<any> {
	    return new Observable<any>((observer) => {
	       fs.readFile(path, (err, data) => {
	           if (err) {
	               observer.error(err);
               } else {
	               observer.next(JSON.parse(data.toString()));
               }
               observer.complete();
           })
        }).pipe(
            catchError(this.handleError('loadJSON()', null))
        );
    }

  	/**
     * Handle an operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional labels to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(`Caught error at ${operation}: ${error}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    static setHasUnsavedChanges(hasUnsavedChanges: boolean) {
        remote.getGlobal('shared').hasUnsavedChanges = hasUnsavedChanges;
    }

}
