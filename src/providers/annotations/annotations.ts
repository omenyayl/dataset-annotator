import {CoordinatesObject} from "../../objects/CoordinatesObject";
import {Injectable} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"
import {ActionObject} from "../../objects/action-object";
import {Events} from "ionic-angular";

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

    constructor(private imageProvider: ImageProvider,
                private events: Events) {
    }

    public initAnnotations(imageSrc: string, scale: number) {
        if (! this.annotations[imageSrc]) {
            this.annotations[imageSrc] = new AnnotationObject(imageSrc);
        }
        else if (scale != 1) {
            AnnotationsProvider.rescaleAnnotation(this.annotations[imageSrc], scale);
        }

    }

    flushAnnotations() {
        this.annotations = [];
        this.actions = [];
    }

    renderCanvas() {
        this.events.publish('render-canvas');
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

        console.log('failed to remove rect');

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



	// BEGIN - POLYLINE METHODS

    addPolyline(polyline: Polyline) {
        if(!(polyline instanceof Polyline)) throw new TypeError("Trying to add a polygon that was not constructed as a new Polyline!");

        let currentImage = this.imageProvider.currentImage;
        if( currentImage ) {
            this.annotations[currentImage.src].polylines.push(polyline);
        }
    }

    removePolyline(polyline: Polyline) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.polylines.indexOf(polyline);

        if (i != -1) {
            annotation.polylines.splice(i, 1);
            return true;
        }

        return false;
    }


    getPolylines() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage) {
            return this.annotations[currentImage.src].polylines
        } else {
            return [];
        }
    }

    // END - POLYLINE METHODS



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

            if(this.isAnnotationsEmpty(this.annotations[image])) continue;
            let copyOfAnnotations = JSON.parse(JSON.stringify(this.annotations[image]));

            if (this.imageProvider.images[image]) {
                AnnotationsProvider.unscaleAnnotation(copyOfAnnotations, this.imageProvider.images[image].scale);
            }
            annotations.push(copyOfAnnotations);
        }
        return {
            'frames': annotations,
            'actions': this.actions
        };
	}

	loadAnnotations(json_from_annotations_file: any): boolean {
        for (let annotation of json_from_annotations_file['frames']) {
            this.annotations[annotation.src] = this.deepAppendAnnotations(annotation, this.annotations[annotation.src]);
        }
        return false;
    }

    deepAppendAnnotations(annotations: AnnotationObject, existingAnnotations?: AnnotationObject) {

        // Initialize undefined objects
        if (!existingAnnotations) existingAnnotations = new AnnotationObject(annotations.src);
        if (!annotations.lines) annotations.lines = [];
        if (!annotations.rectangles) annotations.rectangles = [];
        if (!annotations.polygons) annotations.polygons = [];
        if (!annotations.polylines) annotations.polylines = [];

        let newAnnotations = new AnnotationObject(annotations.src);
        for (let line of annotations.lines.concat(existingAnnotations.lines)) {
            newAnnotations.lines.push(new Line(
                new CoordinatesObject(line.start.x, line.start.y),
                new CoordinatesObject(line.end.x, line.end.y),
                line.label));
        }

        for (let rectangle of annotations.rectangles.concat(existingAnnotations.rectangles)) {
            newAnnotations.rectangles.push(new Rectangle(
                new CoordinatesObject(rectangle.topLeft.x, rectangle.topLeft.y),
                new CoordinatesObject(rectangle.bottomRight.x, rectangle.bottomRight.y),
                rectangle.label));
        }

        for (let polygon of annotations.polygons.concat(existingAnnotations.polygons)) {
            let coordinates = [];
            for (let coordinate of polygon.coordinates) {
                coordinates.push(new CoordinatesObject(coordinate.x, coordinate.y));
            }
            newAnnotations.polygons.push(new Polygon(coordinates, polygon.label));
        }

        for (let polyline of annotations.polylines.concat(existingAnnotations.polylines)) {
            let coordinates = [];
            for (let coordinate of polyline.coordinates) {
                coordinates.push(new CoordinatesObject(coordinate.x, coordinate.y));
            }
            newAnnotations.polylines.push(new Polyline(coordinates, polyline.label));
        }

        return newAnnotations;
    }

	isAnnotationsEmpty(annotations: AnnotationObject) {
        return  ! annotations ||
                annotations.lines.length === 0 &&
                annotations.rectangles.length === 0 &&
                annotations.polygons.length === 0 &&
                annotations.polylines.length === 0;
    }

	static unscaleAnnotation(annotation: AnnotationObject, scale: number) {
        for(let i = 0; i < annotation.lines.length; i++) {
            annotation.lines[i].start.x = Math.round(annotation.lines[i].start.x / scale);
            annotation.lines[i].start.y = Math.round(annotation.lines[i].start.y / scale);
            annotation.lines[i].end.x = Math.round(annotation.lines[i].end.x / scale);
            annotation.lines[i].end.y = Math.round(annotation.lines[i].end.y / scale);
        }
        for(let i = 0; i < annotation.rectangles.length; i++) {
            annotation.rectangles[i].topLeft.x = Math.round(annotation.rectangles[i].topLeft.x / scale);
            annotation.rectangles[i].topLeft.y = Math.round(annotation.rectangles[i].topLeft.y / scale);
            annotation.rectangles[i].bottomRight.x = Math.round(annotation.rectangles[i].bottomRight.x / scale);
            annotation.rectangles[i].bottomRight.y = Math.round(annotation.rectangles[i].bottomRight.y / scale);
        }
        for(let i = 0; i < annotation.polygons.length; i++) {
            for (let point of annotation.polygons[i].coordinates) {
                point.x = Math.round(point.x / scale);
                point.y = Math.round(point.y / scale);
            }
        }
        for(let i = 0; i < annotation.polylines.length; i++) {
            for (let point of annotation.polylines[i].coordinates) {
                point.x = Math.round(point.x / scale);
                point.y = Math.round(point.y / scale);
            }
        }
    }

    static rescaleAnnotation(annotation: AnnotationObject, scale: number) {
        for(let i = 0; i < annotation.lines.length; i++) {
            annotation.lines[i].start.x = Math.round(annotation.lines[i].start.x * scale);
            annotation.lines[i].start.y = Math.round(annotation.lines[i].start.y * scale);
            annotation.lines[i].end.x = Math.round(annotation.lines[i].end.x * scale);
            annotation.lines[i].end.y = Math.round(annotation.lines[i].end.y * scale);
        }
        for(let i = 0; i < annotation.rectangles.length; i++) {
            annotation.rectangles[i].topLeft.x = Math.round(annotation.rectangles[i].topLeft.x * scale);
            annotation.rectangles[i].topLeft.y = Math.round(annotation.rectangles[i].topLeft.y * scale);
            annotation.rectangles[i].bottomRight.x = Math.round(annotation.rectangles[i].bottomRight.x * scale);
            annotation.rectangles[i].bottomRight.y = Math.round(annotation.rectangles[i].bottomRight.y * scale);
        }
        for(let i = 0; i < annotation.polygons.length; i++) {
            for (let point of annotation.polygons[i].coordinates) {
                point.x = Math.round(point.x * scale);
                point.y = Math.round(point.y * scale);
            }
        }
        for(let i = 0; i < annotation.polylines.length; i++) {
            for (let point of annotation.polylines[i].coordinates) {
                point.x = Math.round(point.x * scale);
                point.y = Math.round(point.y * scale);
            }
        }
    }

}

/**
 * Defines line shape
 */
export class Line {

    /**
     * @param {CoordinatesObject} start The topLeft point
     * @param {CoordinatesObject} end The bottomRight point
     * @param {string} label Name of the object
     */
    constructor(public start: CoordinatesObject,
                public end: CoordinatesObject,
                public label: string = 'unnamed'){}
}



export class Rectangle {

    /**
     * @param {CoordinatesObject} topLeft The top left point
     * @param {CoordinatesObject} bottomRight The bottom right point
     * @param {string} label
     */
    constructor(public topLeft: CoordinatesObject,
                public bottomRight: CoordinatesObject,
                public label: string = 'unnamed'){}
}

/**
 * Defines the polygon shape
 */
export class Polygon {
    constructor(public coordinates: CoordinatesObject[] = [],
                public label: string = 'unnamed'){}

}


/**
 * Defines the polyline shape
 */
export class Polyline {
    constructor(public coordinates: CoordinatesObject[] = [],
                public label: string = 'unnamed'){}

}