import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {Image} from '../../image';
import * as imageSize from 'image-size';

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 500;


@IonicPage()
@Component({
    selector: 'page-item',
    templateUrl: 'item.html',
})

/**
 * Details page that shows the item clicked in the master page.
 */
export class ItemPage extends _DetailPage {

    item: string = null;
    currentImage: Image;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fileProvider: FileProvider) {
        super();
        this.item = navParams.data;

        const currentImagePath = this.getImageSrc();
        this.currentImage = this.initImage(currentImagePath as string);
    }

    /**
     * Obtains the absolute local source of the selected image.
     * @returns {string}
     */
    getImageSrc(): string {
        return path.join(this.fileProvider.selectedFolder, this.item);
    }

    /**
     * Takes in the path of the image, scales it down if it has to, and returns a new Image object with
     * width, height, src, and scaling factor
     * @param path The Path of the image
     * @returns {Image} the Image object with width, height, src, and scale
     */
    initImage(path: string): Image {
        const sizeOfCurrentImage = imageSize(path);
        let width = sizeOfCurrentImage.width;
        let height = sizeOfCurrentImage.height;
        let ratio;
        if (width > MAX_IMAGE_WIDTH) {
            ratio = MAX_IMAGE_WIDTH / width;
            width = MAX_IMAGE_WIDTH;
            height *= ratio;
        }
        else if (height > MAX_IMAGE_HEIGHT) {
            ratio = MAX_IMAGE_HEIGHT / height;
            width *= ratio;
            height = MAX_IMAGE_HEIGHT;
        }
        return {
            src: path,
            scale: ratio,
            width: width,
            height: height
        } as Image;
    }

}
