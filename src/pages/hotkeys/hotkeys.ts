import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-hotkeys',
  templateUrl: 'hotkeys.html',
})
export class HotkeysPage {

  private hotkeys: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder) {
    this.hotkeys = this.formBuilder.group({
      nextImage: [''],
      prevImage: ['']
    })
  }

  logForm() {
    console.log(this.hotkeys.value);
  }
}
