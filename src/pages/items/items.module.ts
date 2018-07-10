import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsPage } from './items';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  declarations: [
    ItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsPage),
    HotkeyModule
  ],
  exports: [
    ItemsPage
  ]
})
export class ItemsPageModule { }
