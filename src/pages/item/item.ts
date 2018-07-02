import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { _DetailPage } from '../_DetailPage';
import { FileProvider } from "../../providers/file/file";
import * as path from 'path';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fileProvider: FileProvider) {
    super();
    this.item = navParams.data;
  }

  /**
   * Obtains the absolute local source of the selected image.
   * @returns {string}
   */
  getImageSrc() {
    return 'file://' + path.join(this.fileProvider.selectedFolder, this.item);
  }

}
