import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-placeholder',
  templateUrl: 'placeholder.html',
})

/**
 * This page is shown when there are no items in the Master page
 */
export class PlaceholderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

}
