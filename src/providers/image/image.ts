import {Injectable} from '@angular/core';
import {ImageObject} from "../../objects/image-object";
import * as imageSize from 'image-size';
import {Observable} from "rxjs/Observable";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 500;

/**
 Provider that contains image information and methods
 */
@Injectable()
export class ImageProvider {

    public currentImage: ImageObject;
    public annotations = {};
    public selectedCanvasDirective: CanvasDirectivesEnum;

    constructor() {
    }

    /**
     * Takes in the path of the image, scales it down if it has to, and returns a new ImageObject object with
     * width, height, src, and scaling factor
     * @param path The Path of the image
     * @returns {ImageObject} the ImageObject object with width, height, src, and scale
     */
    initImage(path: string) {
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
        this.currentImage = {
            src: path,
            scale: ratio,
            width: width,
            height: height
        } as ImageObject;
    }

  	getBoxes() : void {
	  let fileName = this.currentImage.src;
	  console.log(`Getting boxes from ${fileName}`);
	  if(this.annotations.hasOwnProperty(fileName)){
		if(typeof this.annotations[fileName] === AnnotationObject){
		  return this.annotations[fileName].boxes
		}
	  }else{
	  	this.annotations[fileName] = {
			boxes : []		  	
		} as AnnotationObject;
		return this.annotations[fileName].boxes
	  }
	}

	addBox(box) : void {
		if(this.annotations.hasOwnProperty(fileName)){
			if(this.annotations.hasOwnProperty(fileName)){
				this.annotations[fileName].boxes.push(box);
			}
		}
	}

	generateSaveData(): Observable<any> {
		return new Observable<any>((observer) => {
		  observer.next({'testFile': 'testData', 'frame_05420': '[{type: \'box\'}]'});
			observer.complete();
		})
	}

}
