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
    public static lastLabel: string;

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
	  		nextId = Math.max(action.action_id, nextId);
		}
	  	nextId += 1;
	  	//console.log(`New ID assigned: ${nextId}`);
	  	return nextId;
	}

  	addAction(action : ActionObject){
		action.action_id = this.getActionId();
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

  	generateSaveData(): any {
        let annotations = [];
        for (let image in this.annotations) {
            let scale = this.imageProvider.images[image].scale;
            let copyOfAnnotations = JSON.parse(JSON.stringify(this.annotations[image]));
            this.unscaleAnnotations(copyOfAnnotations, scale);
            annotations.push(copyOfAnnotations);
        }
        return {
            'frames': annotations,
            'actions': this.actions
        };
	}

	unscaleAnnotations(annotations: AnnotationObject, scale: number) {
        for(let i = 0; i < annotations.lines.length; i++) {
            AnnotationsProvider.unscaleLine(annotations.lines[i], scale);
        }
        for(let i = 0; i < annotations.rectangles.length; i++) {
            console.log(annotations.rectangles[i]);
            AnnotationsProvider.unscaleRectangle(annotations.rectangles[i], scale);
            console.log(annotations.rectangles[i]);
        }
        for(let i = 0; i < annotations.polygons.length; i++) {
            AnnotationsProvider.unscalePolygon(annotations.polygons[i], scale);
        }
    }

    public static unscaleLine(line: Line, scale: number){
        line.start.x = Math.round(line.start.x / scale);
        line.start.y = Math.round(line.start.y / scale);
        line.end.x = Math.round(line.end.x / scale);
        line.end.y = Math.round(line.end.y / scale);
    }
    public static unscaleRectangle(rectangle: Rectangle, scale: number){
        rectangle.start.x = Math.round(rectangle.start.x / scale);
        rectangle.start.y = Math.round(rectangle.start.y / scale);
        rectangle.end.x = Math.round(rectangle.end.x / scale);
        rectangle.end.y = Math.round(rectangle.end.y / scale);
    }

    public static unscalePolygon(polygon: Polygon, scale: number) {
        for (let point of polygon.coordinates) {
            point.x = Math.round(point.x / scale);
            point.y = Math.round(point.y / scale);
        }
    }
}

/**
 * Defines line shape
 */
export class Line {

    /**
     * @param {CoordinatesObject} start The start point
     * @param {CoordinatesObject} end The end point
     * @param {string} label Name of the object
     */
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}



export class Rectangle {

    /**
     * @param {CoordinatesObject} start The top left point
     * @param {CoordinatesObject} end The bottom right point
     * @param {string} label
     */
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}

/**
 * Defines the polygon shape
 */
export class Polygon {
    constructor(public coordinates: CoordinatesObject[] = [],
                public label: string = 'unnamed'){}

}
