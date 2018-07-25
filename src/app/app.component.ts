import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NavProxyService} from '../providers/nav-proxy/nav-proxy';
import {ItemsPage} from '../pages/items/items';
import {PlaceholderPage} from '../pages/placeholder/placeholder';
import {FileProvider} from "../providers/file/file";
import {AnnotationsProvider} from "../providers/annotations/annotations";
import FileFilter = Electron.FileFilter;
import {ImageProvider} from "../providers/image/image";
import {ItemPage} from "../pages/item/item";
import {ipcRenderer} from 'electron';
import {SettingsPage} from "../pages/settings/settings";
import {AutoLabelPage} from "../pages/auto-label/auto-label";


const SUPPORTED_EXTENSIONS = [
    '.jpg',
    '.png'
];

@Component({
    templateUrl: 'app.html'
})

/**
 * Root component that displays both the details page and the master page.
 */
export class MyApp {

    // Grab References to our 2 NavControllers...
    @ViewChild('detailNav') detailNav: Nav;
    @ViewChild('masterNav') masterNav: Nav;

    // Empty placeholders for the 'master/detail' pages...
    masterPage: any = null;
    detailPage: any = null;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private navProxy: NavProxyService,
        private fileProvider: FileProvider,
        private annotationProvider: AnnotationsProvider,
        private menuCtrl: MenuController,
        private toastCtrl: ToastController,
        private imageProvider: ImageProvider) {

        platform.ready().then(() => {

            statusBar.styleDefault();
            splashScreen.hide();

            // Add our nav controllers to
            // the nav proxy service...
            navProxy.masterNav = this.masterNav;
            navProxy.detailNav = this.detailNav;

            // set initial pages for
            // our nav controllers...
            this.masterNav.setRoot(ItemsPage, {detailNavCtrl: this.detailNav});
            this.detailNav.setRoot(PlaceholderPage);

            ipcRenderer.on('saveAnnotations', () => {
                this.saveFileDialog()
                    .then(()=>{
                        ipcRenderer.send('close');
                    });
            })
        });
    }

    /**
     * Opens a given directory and lists all images in the selected directory.
     */
    openDir() {
        console.log(`Opening directory`);
        this.fileProvider.showOpenDialog()
            .subscribe((value) => {
                this.fileProvider.listFiles(value, SUPPORTED_EXTENSIONS)
                    .subscribe((files) => {
                        this.fileProvider.filesLoading.next(false);
                        if (! files ) return;
                        else if (files.length === 0) {
                            let toast = this.toastCtrl.create({
                                message: 'ERROR: Did not find any images (.jpg/.png) in the directory.',
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.present();
                        }
                        else if (this.fileProvider.selectedFolder === value) {
                            let toast = this.toastCtrl.create({
                                message: 'WARNING: Already opened this directory.',
                                duration: 1500,
                                position: 'bottom'
                            });
                            toast.present();
                        }
                        else {
                            this.fileProvider.filesChange.next(files);
                            this.fileProvider.selectedFolder = value;
                            this.annotationProvider.flushAnnotations();
                            this.imageProvider.flushImages();
                            this.navProxy.pushDetail(ItemPage, files[0]);
                        }
                    });
            })
    }

    saveFileDialog() {
        return new Promise((resolve) => {
            console.log('Saving file...');
            let filters: FileFilter[] = [];
            filters.push({
                name: 'JSON',
                extensions: ['json']
            });
            this.fileProvider.showSaveDialog(filters)
                .subscribe((file) => {
                    file ? this.saveFile(file) : console.error('File is undefined when attempting to save.');
                    FileProvider.setHasUnsavedChanges(false);
                    resolve();
                })
        });
    }

    saveFile(file: string) {
        console.log(`Saving to ${file}`);
        let saveJson = this.annotationProvider.generateSaveData();
        this.fileProvider.saveFile(saveJson, file).subscribe((success) => {
            if (success) {
                let toast = this.toastCtrl.create({
                    message: 'Successfully saved the annotations.',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();
            }
        })
    }

    openSettingsForm() {
        this.menuCtrl.close();
        this.navProxy.pushMaster(SettingsPage, null);
    }

    readAnnotations() {
        let filters: FileFilter[] = [];
        filters.push({
            name: 'JSON',
            extensions: ['json']
        });
        this.fileProvider.showOpenDialog('openFile', filters)
            .subscribe((path) => {
                this.fileProvider.loadJSON(path)
                    .subscribe((file_json) => {
                        this.annotationProvider.loadAnnotations(file_json);
                        this.menuCtrl.close();
                        let toast = this.toastCtrl.create({
                            message: 'Successfully loaded annotations.',
                            duration: 1500,
                            position: 'bottom'
                        });
                        toast.present();
                    });
            });
    }

    openAutoLabelPage() {
        this.menuCtrl.close();
        this.navProxy.pushMaster(AutoLabelPage, null);
    }
}
