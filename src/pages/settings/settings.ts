import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {HotkeysPage} from "../hotkeys/hotkeys";
import {NavProxyService} from "../../providers/nav-proxy/nav-proxy";
import {ImageSizePage} from "../image-size/image-size";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private menuCtrl: MenuController,
                private navProxy: NavProxyService) {
    }

    openHotkeysForm() {
        this.menuCtrl.close();
        this.navProxy.pushMaster(HotkeysPage, null);
    }

    openImageSizeForm() {
        this.menuCtrl.close();
        this.navProxy.pushMaster(ImageSizePage, null);
    }

}
