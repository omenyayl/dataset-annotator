import {Injectable, NgZone} from '@angular/core';
import {ImageObject} from "../../objects/image-object";
import * as imageSize from 'image-size';
import {DrawerNamesEnum} from "../../enums/drawer-names-enum";
import {AnnotationsProvider} from "../annotations/annotations";
import {FileProvider} from "../file/file";
import {ImageSizeSettingProvider} from "../image-size-setting/image-size-setting";

/**
 Provider that contains image information and methods
 */
@Injectable()
export class ImageProvider {

    public currentImage: ImageObject;
    public images: ImageObject[] = [];
    public selectedCanvasDirective: DrawerNamesEnum;
    private annotationsProvider: AnnotationsProvider;

    systemResolutionMultiplier: number;
    minWidth: number;
    minHeight: number;

    maxWidth: number;
    maxHeight: number;

    constructor(imageSizeSetting: ImageSizeSettingProvider,
                private ngZone: NgZone) {
        this.systemResolutionMultiplier = imageSizeSetting.getSize();
        this.minWidth = this.systemResolutionMultiplier * FileProvider.systemResolution.width;
        this.minHeight = this.systemResolutionMultiplier * FileProvider.systemResolution.height;
        this.maxWidth = this.minWidth + 100;
        this.maxHeight = this.minHeight + 100;
    }

    /**
     * Takes in the name of the image, scales it down if it has to, and returns a new ImageObject object with
     * width, height, src, and scaling factor
     * @param name The name of the image
     * @param annotationsProvider the AnnotationsProvider
     * @param fullPath
     * @returns {ImageObject} the ImageObject object with width, height, src, and scale
     */
    initImage(name: string,
              annotationsProvider: AnnotationsProvider,
              fullPath: string) {

        this.annotationsProvider = annotationsProvider;

        const sizeOfCurrentImage = imageSize(fullPath);
        let width = sizeOfCurrentImage.width;
        let height = sizeOfCurrentImage.height;
        let ratio = 1;
        if (width > this.maxWidth) {
            ratio = this.maxWidth / width;
            width = this.maxWidth;
            height *= ratio;
        }
        else if (width < this.minWidth) {
            ratio = this.minWidth / width;
            width = this.minWidth;
            height *= ratio;
        }
        else if (height > this.maxHeight) {
            ratio = this.maxHeight / height;
            height = this.maxHeight;
            width *= ratio;
        }
        else if (height < this.minHeight) {
            ratio = this.minHeight / height;
            height = this.minHeight;
            width *= ratio;
        }
        let newImage = new ImageObject(
            name, width, height, ratio
        );
        this.currentImage = newImage;

        if (! this.images[name]) {
            this.annotationsProvider.initAnnotations(this.currentImage.src, ratio);
            this.images[name] = newImage;
        }

    }

    flushImages() {
        this.images = [];
    }

    selectDrawingTool(name: DrawerNamesEnum) {
        this.ngZone.run(() => {
            this.selectedCanvasDirective = name;
        })
    }
}
