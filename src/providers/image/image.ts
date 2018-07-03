import {Injectable} from '@angular/core';
import {ImageObject} from "../../objects/image-object";
import {Observable} from "rxjs/Observable";
import {AnnotationObject} from "../../objects/annotation-object"
import * as imageSize from 'image-size';

const MAX_IMAGE_WIDTH = 500;
const MAX_IMAGE_HEIGHT = 500;

/**
  Provider that contains image information and methods
*/
@Injectable()
export class ImageProvider {

    public currentImage: ImageObject;
  	public annotations: Object;

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

  	getBoxes(){
	  let fileName = this.currentImage.src;
	  if(annotations.hasOwnProperty(fileName)){
		if(typeof annotations[fileName] === AnnotationObject){
		  return annotations[fileName].boxes
		}
	  }else{
	  	annotations[fileName] = {
			boxes : []		  	
		} as AnnotationObject;
		return annotations[fileName].boxes
	  }
	}

	addBox(box){
		if(annotations.hasOwnProperty(fileName)){
			if(annotations.hasOwnProperty(fileName)){
				annotations[fileName].boxes.push(box);
			}
		}
	}

	generateSaveData(): Observable<string> {
		return new Observable<string>((observer) => {
				observer.next({data: 'testData'});
			observer.complete();
		})
	}

}
