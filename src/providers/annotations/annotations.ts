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
            this.annotations[imageSrc] = new AnnotationObject(imageSrc);
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
        if(!(box instanceof Box)) throw new TypeError("Trying to add a box that was not constructed as a new Box!");

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
        if(!(line instanceof Line)) throw new TypeError("Trying to add a line that was not constructed as a new Line!");

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

    addPolygon(polygon: Polygon) {
        if(!(polygon instanceof Polygon)) throw new TypeError("Trying to add a polygon that was not constructed as a new Polygon!");

        let currentImage = this.imageProvider.currentImage;
        if( currentImage ) {
            this.annotations[currentImage.src].polygons.push(polygon);
        }
    }

    getPolygons() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].polygons
        } else {
            return [];
        }
    }

    removePolygon(polygon: Polygon) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.polygons.indexOf(polygon);

        if (i != -1) {
            annotation.polygons.splice(i, 1);
            return true;
        }

        return false;
    }

    // END - POLYGON METHODS

    getCurrentAnnotation() {
        let currentSrc = this.imageProvider.currentImage.src;
        return this.annotations[currentSrc];
    }

    public getAnnotations() {
        return this.annotations;
    }

}

export class Line {
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}

export class Box {
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}

export class Polygon {
    constructor(public coordinates: CoordinatesObject[],
                public label: string = 'unnamed'){}
}
