import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavProxyService } from '../providers/nav-proxy/nav-proxy';
import { ItemsPage } from '../pages/items/items';
import { PlaceholderPage } from '../pages/placeholder/placeholder';
import { FileProvider } from "../providers/file/file";

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
    private fileProvider: FileProvider) {

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      // Add our nav controllers to
      // the nav proxy service...
      navProxy.masterNav = this.masterNav;
      navProxy.detailNav = this.detailNav;

      // set initial pages for
      // our nav controllers...
      this.masterNav.setRoot(ItemsPage, { detailNavCtrl: this.detailNav });
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
		  this.fileProvider.selectedFolder = value;
          this.fileProvider.listFiles(value, SUPPORTED_EXTENSIONS)
              .subscribe(()=>{
              })
        })
  }

  saveDir() {
    console.log(`Opening directory for saving`);
    this.fileProvider.showOpenDialog()
	   .subscribe((value) => {
		  this.fileProvider.selectedSaveFolder = value;
		  console.log(`Saving in ${this.fileProvider.selectedSaveFolder}`);
        })
  }

}
