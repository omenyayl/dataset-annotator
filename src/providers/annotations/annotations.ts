import {Injectable} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"
import {CoordinatesObject} from "../../objects/CoordinatesObject";

/**
    Provider that deals with getting and setting annotations
 */
@Injectable()
export class AnnotationsProvider {
    private annotations: AnnotationObject[] = [];
    public static selectedElement;

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


    // BEGIN - BOX METHODS
    getBoxes() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].boxes
        } else {
            return [];
        }
    }

    addBox(box: Box) {
        console.log("addBox():");
        let currentImage = this.imageProvider.currentImage;
        if (currentImage ) {
            this.annotations[currentImage.src].boxes.push(box);
        }
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

    // END - BOX METHODS


    // BEGIN - LINE METHODS

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

    removeLine(line: Line) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.lines.indexOf(line);

        if (i != -1) {
            annotation.lines.splice(i, 1);
            return true;
        }

        return false;
    }

    // END - LINE METHODS



    // BEGIN - POLYGON METHODS


    getCurrentAnnotation() {
        let currentSrc = this.imageProvider.currentImage.src;
        return this.annotations[currentSrc];
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

export class Polygon {
    label: string = 'unnamed';
    coordinates: CoordinatesObject[];
}