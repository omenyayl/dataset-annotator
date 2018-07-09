import {Injectable} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"

/**
    Provider that deals with getting and setting annotations
 */
@Injectable()
export class AnnotationsProvider {
    private annotations: AnnotationObject[] = [];

    constructor(private imageProvider: ImageProvider) {
    }

    public initAnnotations(imageSrc: string) {
        if (! this.annotations[imageSrc]) {
            this.annotations[imageSrc] = {
                src: imageSrc,
                lines: [],
                boxes: [],
                polygons: []
            } as AnnotationObject;
        }
    }

    getBoxes() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].boxes
        } else {
            return [];
        }
    }

    addBox(box) {
        console.log("addBox():");
        let currentImage = this.imageProvider.currentImage;
        if (currentImage ) {
            this.annotations[currentImage.src].boxes.push(box);
        }
    }

    getLines() {

        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].lines
        } else {
            return [];
        }
    }

    addLine(line: Line) {

        let currentImage = this.imageProvider.currentImage;
        if( currentImage ) {
            this.annotations[currentImage.src].lines.push(line);
        }

    }

    getCurrentAnnotation() {
        let currentSrc = this.imageProvider.currentImage.src;
        return this.annotations[currentSrc];
    }

    removeBox(box: Box): boolean {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.boxes.indexOf(box);

        if (i != -1) {
            annotation.boxes.splice(i, 1);
            return true;
        }

        return false;
    }

    removeLine(line: Line) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.lines.indexOf(line);

        if (i != -1) {
            annotation.lines.splice(i, 1);
            return true;
        }

        return false;
    }

    public getAnnotations() {
        return this.annotations;
    }

}

export class Line {
    label: string = 'unnamed';
    x1: number;
    y1: number;
    x2: number;
    y2: number
}

export class Box {
    label: string = 'unnamed';
    x1: number;
    y1: number;
    x2: number;
    y2: number
}