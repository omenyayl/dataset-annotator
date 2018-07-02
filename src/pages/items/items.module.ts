import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsPage } from './items';

@NgModule({
  declarations: [
    ItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsPage),
  ],
  exports: [
    ItemsPage
  ]
})
export class ItemsPageModule { }
