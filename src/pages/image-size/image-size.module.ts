import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageSizePage } from './image-size';

@NgModule({
  declarations: [
    ImageSizePage,
  ],
  imports: [
    IonicPageModule.forChild(ImageSizePage),
  ],
})
export class ImageSizePageModule {}
