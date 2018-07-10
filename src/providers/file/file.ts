import {Injectable, NgZone} from '@angular/core';
import {remote} from 'electron';
import {Observable} from "rxjs/Observable";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import * as fs from 'fs';
import * as path from 'path';
import {Subject} from "rxjs/Subject";

let {dialog} = remote;

@Injectable()
export class FileProvider {

    selectedFolder: string; // The chosen directory
    selectedSaveFolder: string; // The chosen directory for saving annotations

    filesChange: Subject<string[]> = new Subject<string[]>(); // Subject containing a list of files found
    filesLoading: Subject<boolean> = new Subject<boolean>(); // Indicates whether the listFiles() operation is ongoing


    constructor(private ngZone: NgZone) {
    }

    /**
     * Opens a directory dialog box handled by the OS.
     * @returns {Observable<string>}
     */
    showOpenDialog(): Observable<string> {

        return new Observable<string>((observer) => {
            dialog.showOpenDialog({
                properties: ['openDirectory']
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
            tap((files) => {
                this.ngZone.run(() => {
                    this.filesChange.next(files);
                    this.filesLoading.next(false);
                });
            }),
            catchError((error: any): Observable<string[]> => {
                this.ngZone.run(() => {
                    this.filesLoading.next(false);
                });
                console.log(`Caught error when listing files: ${error}`);
                return of([] as string[]);
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
		  	console.log(data);
		  	for(let imageFile in data){
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
                        observer.complete();
					});
				}
			}
		}).pipe(
		    catchError(this.handleError('File.saveFiles', null))
        )
  	}

    /**
     * Handle an operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.error(`Caught error at ${operation}: ${error}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
