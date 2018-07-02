import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { _DetailPage } from '../_DetailPage';
import { FileProvider } from "../../providers/file/file";
import * as path from 'path';
import { Image } from '../../image';
import * as imageSize from 'image-size';

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
    const sizeOfCurrentImage = imageSize(path.join(this.fileProvider.selectedFolder, this.item));
    this.currentImage = {
        src: this.getImageSrc(),
        width: sizeOfCurrentImage.width,
        height: sizeOfCurrentImage.height
    } as Image;
  }

  /**
   * Obtains the absolute local source of the selected image.
   * @returns {string}
   */
  getImageSrc() {
    return 'file://' + path.join(this.fileProvider.selectedFolder, this.item);
  }

}
