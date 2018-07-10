import {Injectable} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"
import {CoordinatesObject} from "../../objects/CoordinatesObject";
import {ActionObject} from "../../objects/action-object";

/**
    Provider that deals with getting and setting annotations
 */
@Injectable()
export class AnnotationsProvider {
  	private annotations: AnnotationObject[] = [];
  	private actions: ActionObject[] = [];
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

        if (! box.hasOwnProperty('label')){
            box.label = 'unnamed';
        }

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

        if (! line.hasOwnProperty('label')){
            line.label = 'unnamed';
        }

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
        if (! polygon.hasOwnProperty('label')){
            polygon.label = 'unnamed';
        }

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

	
	
	// BEGIN - ACTION METHODS

  	getActions(){
		return this.actions;
	}

  	addAction(action : ActionObject){
		this.actions.push(action);
	}

	removeAction(action : ActionObject){
        let i = this.actions.indexOf(action);

        if (i != -1) {
            this.actions.splice(i, 1);
            return true;
        }

        return false;
	}

  	// END - ACTION METHODS
  
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
    start: CoordinatesObject;
    end: CoordinatesObject;
}

export class Box {
    label: string = 'unnamed';
    start: CoordinatesObject;
    end: CoordinatesObject;
}

export class Polygon {
    label: string = 'unnamed';
    coordinates: CoordinatesObject[];
}
