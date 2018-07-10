import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotkeysPage } from './hotkeys';

@NgModule({
  declarations: [
    HotkeysPage,
  ],
  imports: [
    IonicPageModule.forChild(HotkeysPage)
  ],
})
export class HotkeysPageModule {}
