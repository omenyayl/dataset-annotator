import {Injectable} from '@angular/core';
import {ImageObject} from "../../objects/image-object";
import * as imageSize from 'image-size';
import {DrawerNamesEnum} from "../../enums/drawer-names-enum";
import {AnnotationsProvider} from "../annotations/annotations";

const MAX_IMAGE_WIDTH = 750;
const MAX_IMAGE_HEIGHT = 1000;

/**
 Provider that contains image information and methods
 */
@Injectable()
export class ImageProvider {

    public currentImage: ImageObject;
    public images: ImageObject[] = [];
    public selectedCanvasDirective: DrawerNamesEnum;
    private annotationsProvider: AnnotationsProvider;

    constructor() {
    }

    /**
     * Takes in the name of the image, scales it down if it has to, and returns a new ImageObject object with
     * width, height, src, and scaling factor
     * @param name The name of the image
     * @param annotationsProvider the AnnotationsProvider
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
        if (width > MAX_IMAGE_WIDTH) {
            ratio = MAX_IMAGE_WIDTH / width;
            width = MAX_IMAGE_WIDTH;
            height *= ratio;
        }
        else if (height > MAX_IMAGE_HEIGHT) {
            ratio = MAX_IMAGE_HEIGHT / height;
            width *= ratio;
            height = MAX_IMAGE_HEIGHT;
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

	/*generateSaveData(): Observable<any> {
	  	return new Observable<any>((observer) => {
		  	//observer.next({'testFile': 'testData', 'frame_05420': '[{type: \'box\'}]'});
		  	observer.next(this.annotationsProvider.getAnnotations());
			observer.complete();
		})
	}*/

}
