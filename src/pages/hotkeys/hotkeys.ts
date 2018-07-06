import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HotkeyProvider } from '../../providers/hotkeys/hotkeys';
import { NavProxyService } from '../../providers/nav-proxy/nav-proxy';

@IonicPage()
@Component({
  selector: 'page-hotkeys',
  templateUrl: 'hotkeys.html',
})
export class HotkeysPage {

  private hotkeys: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private navProxy: NavProxyService,
              private hotkeyProvider: HotkeyProvider) {

    this.hotkeys = this.formBuilder.group({
      nextImage: [this.hotkeyProvider.hotkeys.nextImage],
      prevImage: [this.hotkeyProvider.hotkeys.prevImage],
      line: [this.hotkeyProvider.hotkeys.line],
      rectangle: [this.hotkeyProvider.hotkeys.rectangle],
      polygon: [this.hotkeyProvider.hotkeys.polygon]
    })
  }

  updateHotkeys() {
    this.hotkeyProvider.hotkeys = this.hotkeys.value;
    this.navProxy.popMaster(HotkeysPage);
  }
}
