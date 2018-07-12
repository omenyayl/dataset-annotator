import {Injectable} from '@angular/core';
import {ImageObject} from "../../objects/image-object";
import * as imageSize from 'image-size';
import {Observable} from "rxjs/Observable";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {AnnotationsProvider} from "../annotations/annotations";

const MAX_IMAGE_WIDTH = 1000;
const MAX_IMAGE_HEIGHT = 1000;

/**
 Provider that contains image information and methods
 */
@Injectable()
export class ImageProvider {

    public currentImage: ImageObject;
    public selectedCanvasDirective: CanvasDirectivesEnum;
    private annotationsProvider: AnnotationsProvider;

    constructor() {
    }

    /**
     * Takes in the path of the image, scales it down if it has to, and returns a new ImageObject object with
     * width, height, src, and scaling factor
     * @param path The Path of the image
     * @param annotationsProvider the AnnotationsProvider
     * @returns {ImageObject} the ImageObject object with width, height, src, and scale
     */
    initImage(path: string,
              annotationsProvider: AnnotationsProvider) {

        this.annotationsProvider = annotationsProvider;

        const sizeOfCurrentImage = imageSize(path);
        let width = sizeOfCurrentImage.width;
        let height = sizeOfCurrentImage.height;
        let ratio;
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
        this.currentImage = new ImageObject(
            path, width, height, ratio
        );
        this.annotationsProvider.initAnnotations(this.currentImage.src);
    }

	/*generateSaveData(): Observable<any> {
	  	return new Observable<any>((observer) => {
		  	//observer.next({'testFile': 'testData', 'frame_05420': '[{type: \'box\'}]'});
		  	observer.next(this.annotationsProvider.getAnnotations());
			observer.complete();
		})
	}*/

}
