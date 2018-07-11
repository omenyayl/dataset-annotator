import {CoordinatesObject} from "../../objects/CoordinatesObject";
import {Injectable} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"
import {ActionObject} from "../../objects/action-object";

/**
    Provider that deals with getting and setting annotations
 */
@Injectable()
export class AnnotationsProvider {
  	private annotations: AnnotationObject[] = [];
  	private actions: ActionObject[] = [];
    public static selectedElement: any;
    public static selectedAction;

    constructor(private imageProvider: ImageProvider) {
    }

    public initAnnotations(imageSrc: string) {
        if (! this.annotations[imageSrc]) {
            this.annotations[imageSrc] = new AnnotationObject(imageSrc);
        }
    }


    // BEGIN - RECTANGLE METHODS
    getRectangles() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].rectangles
        } else {
            return [];
        }
    }

    addRectangle(rectangle: Rectangle) {
        if(!(rectangle instanceof Rectangle)) throw new TypeError("Trying to add a rectangle that was not constructed as a new Rectangle!");

        let currentImage = this.imageProvider.currentImage;
        if (currentImage ) {
            this.annotations[currentImage.src].rectangles.push(rectangle);
        }
    }

    removeRectangle(rectangle: Rectangle): boolean {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.rectangles.indexOf(rectangle);

        if (i != -1) {
            annotation.rectangles.splice(i, 1);
            return true;
        }

        return false;
    }

    // END - RECTANGLE METHODS


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

	
	
	// BEGIN - ACTION METHODS

  	getActions(){
		return this.actions;
	}

  	//Very stupid method - But very safe
  	getActionId(){
	  	let nextId = -1;
	  	for(let action of this.actions){
	  		nextId = Math.max(action.object_id, nextId);
		}
	  	nextId += 1;
	  	//console.log(`New ID assigned: ${nextId}`);
	  	return nextId;
	}

  	addAction(action : ActionObject){
		action.object_id = this.getActionId();
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
  	
  	selectAction(action : ActionObject){
		AnnotationsProvider.selectedAction = action;
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
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}

export class Rectangle {
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}

export class Polygon {
    constructor(public coordinates: CoordinatesObject[] = [],
                public label: string = 'unnamed'){}
}
