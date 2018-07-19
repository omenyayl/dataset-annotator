import {Component, NgZone, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {NavProxyService} from '../providers/nav-proxy/nav-proxy';
import {ItemsPage} from '../pages/items/items';
import {PlaceholderPage} from '../pages/placeholder/placeholder';
import {FileProvider} from "../providers/file/file";
import {AnnotationsProvider} from "../providers/annotations/annotations";
import {HotkeysPage} from '../pages/hotkeys/hotkeys';
import FileFilter = Electron.FileFilter;
import {ImageProvider} from "../providers/image/image";
import {ItemPage} from "../pages/item/item";

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
        private imageProvider: ImageProvider,
        private ngZone: NgZone) {

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
                        if (files.length === 0) {
                            let toast = this.toastCtrl.create({
                                message: 'ERROR: Did not find any images (.jpg/.png) in the directory.',
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.present();
                        } else {
                            this.ngZone.run(()=>{
                                this.fileProvider.filesChange.next(files);
                                this.fileProvider.filesLoading.next(false);
                                this.fileProvider.selectedFolder = value;
                                this.annotationProvider.flushAnnotations();
                                this.imageProvider.flushImages();
                                this.navProxy.pushDetail(ItemPage, files[0]);
                            });
                        }
                    })
            })
    }

    saveFile() {
        console.log('Saving file...');
        let filters: FileFilter[] = [];
        filters.push({
            name: 'JSON',
            extensions: ['json']
        });
        this.fileProvider.showSaveDialog(filters)
            .subscribe((file) => {
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
            })
    }

    openHotkeysForm() {
        console.log("open keybindings form");
        this.menuCtrl.close();
        this.navProxy.pushMaster(HotkeysPage, null);
    }

    readAnnotations() {
        this.fileProvider.showOpenDialog('openFile')
            .subscribe((path) => {
                this.fileProvider.loadJSON(path)
                    .subscribe((file_json) => {
                        this.annotationProvider.loadAnnotations(file_json);
                        this.menuCtrl.close();
                    });
            });
    }
}
