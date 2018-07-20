import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ImageSizeSettingProvider} from "../../providers/image-size-setting/image-size-setting";

/**
 * Generated class for the ImageSizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-image-size',
    templateUrl: 'image-size.html',
})
export class ImageSizePage {

    imageScale: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private imageSizeSetting: ImageSizeSettingProvider,
                private toastCtrl: ToastController) {
        this.imageScale = this.imageSizeSetting.getSize() * 100;
    }

    updateImageScaleSetting() {
        this.imageSizeSetting.setSize(this.imageScale);
        let toast = this.toastCtrl.create({
            message: 'Restart program to apply changes.',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }
i
}
