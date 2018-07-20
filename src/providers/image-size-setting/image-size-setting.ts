import {Injectable} from '@angular/core';

/*
  Generated class for the ImageSizeSettingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageSizeSettingProvider {
i
    constructor() {
    }

    getSize() {
        let savedImageSize = JSON.parse(localStorage.getItem('imageSizeSetting'));
        return savedImageSize ? savedImageSize.scale : 0.4;
    }

    setSize(scalePercent: number) {
        localStorage.setItem('imageSizeSetting', JSON.stringify({
            scale: scalePercent / 100
        }));
    }

}
