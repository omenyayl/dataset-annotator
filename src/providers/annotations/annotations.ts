import {CoordinatesObject} from "../../objects/CoordinatesObject";
import {Injectable, NgZone} from '@angular/core';
import {AnnotationObject} from "../../objects/annotation-object";
import { ImageProvider } from "../image/image"
import {ActionObject} from "../../objects/action-object";
import {Events} from "ionic-angular";
import {FileProvider} from "../file/file";

/**
    Provider that deals with getting and setting annotations
 */
@Injectable()
export class AnnotationsProvider {
  	private annotations: AnnotationObject[] = [];
  	private loadedAnnotations: AnnotationObject[] = []; // these will load up when their corresponding images load

  	private actions: ActionObject[] = [];
    public static selectedElement: any;
    public static selectedAction;
    public static lastLabel: string;

    constructor(private imageProvider: ImageProvider,
                private events: Events,
                private ngZone: NgZone) {
    }

    public initAnnotations(imageSrc: string, scale: number) {
        if(this.loadedAnnotations[imageSrc]) {
            AnnotationsProvider.rescaleAnnotation(this.loadedAnnotations[imageSrc], scale);
            this.annotations[imageSrc] = AnnotationsProvider.deepAppendAnnotations(
                this.loadedAnnotations[imageSrc],
                this.annotations[imageSrc]);

            this.loadedAnnotations[imageSrc] = null;
        }
        else if (! this.annotations[imageSrc]) {
            this.annotations[imageSrc] = new AnnotationObject(imageSrc);
        }

    }

    flushAnnotations() {
        this.loadedAnnotations = [];
        this.annotations = [];
        this.loadedAnnotations = [];
        this.actions = [];
    }

    renderCanvas() {
        this.events.publish('render-canvas');
    }

    setLabelOnSelectedElement(label: string) {
        this.ngZone.run(() => {
            if(AnnotationsProvider.selectedElement && AnnotationsProvider.selectedElement.hasOwnProperty('label')) {
                AnnotationsProvider.selectedElement.label = label;
                AnnotationsProvider.lastLabel = label;
            }
        });
        this.renderCanvas();
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
        if(!(rectangle instanceof Rectangle)) throw new TypeError("Trying to add a rectangle that was not c onstructed as a new Rectangle!");

        let currentImage = this.imageProvider.currentImage;
        if (currentImage ) {
            this.ngZone.run(()=>{
                this.annotations[currentImage.src].rectangles.push(rectangle);
            });
            FileProvider.setHasUnsavedChanges(true);
        }
    }

    removeRectangle(rectangle: Rectangle): boolean {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.rectangles.indexOf(rectangle);

        if (i != -1) {
            annotation.rectangles.splice(i, 1);
            FileProvider.setHasUnsavedChanges(true);
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
            this.ngZone.run(() => {
                this.annotations[currentImage.src].lines.push(line);
            });
            FileProvider.setHasUnsavedChanges(true);
        }

    }

    removeLine(line: Line) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.lines.indexOf(line);

        if (i != -1) {
            annotation.lines.splice(i, 1);
            FileProvider.setHasUnsavedChanges(true);
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
            this.ngZone.run(() => {
                this.annotations[currentImage.src].polygons.push(polygon);
            });
            FileProvider.setHasUnsavedChanges(true);
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
            FileProvider.setHasUnsavedChanges(true);
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
            this.ngZone.run(() => {
                this.annotations[currentImage.src].polylines.push(polyline);
            });
            FileProvider.setHasUnsavedChanges(true);
        }
    }

    removePolyline(polyline: Polyline) {
        let annotation = this.getCurrentAnnotation();

        let i = annotation.polylines.indexOf(polyline);

        if (i != -1) {
            annotation.polylines.splice(i, 1);
            FileProvider.setHasUnsavedChanges(true);
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
	  	return nextId;
	}

  	addAction(action : ActionObject){
		action.action_id = this.getActionId();
        FileProvider.setHasUnsavedChanges(true);
        this.ngZone.run(() => {
            this.actions.push(action);
        });
	}

	removeAction(action : ActionObject){
        let i = this.actions.indexOf(action);

        if (i != -1) {
            this.actions.splice(i, 1);
            FileProvider.setHasUnsavedChanges(true);
            return true;
        }

        return false;
	}
  	
  	selectAction(action : ActionObject){
		AnnotationsProvider.selectedAction = action;
	}

	selectElement(element: any) {
        this.ngZone.run(() => {
            AnnotationsProvider.selectedElement = element;
        });
    }

  	// END - ACTION METHODS
  
  	getCurrentAnnotation() {
        let currentSrc = this.imageProvider.currentImage.src;
        return this.annotations[currentSrc];
    }

    public getAnnotations() {
        return this.annotations;
	}

	static concatArraysUnique(object1Keys: any, object2Keys: any) {
        return object1Keys.concat(
            object2Keys.filter((key) => {
                return object1Keys.indexOf(key) < 0;
            }));
    }


    /**
     * Goes through the hand annotations and the loaded annotations, combines them, and exports them
     * @returns {any} An object to be exported as a JSON containing all of the annotation data
     */
  	generateSaveData(): any {
        let annotations = [];

        let annotationsKeys = Object.keys(this.annotations);
        let loadedAnnotationsKeys = Object.keys(this.loadedAnnotations);

        for (let imageSrc of AnnotationsProvider.concatArraysUnique(annotationsKeys, loadedAnnotationsKeys)) {

            let annotation = this.annotations[imageSrc];
            let copyOfAnnotations: AnnotationObject = new AnnotationObject(imageSrc);
            let isAnnotationsEmpty = AnnotationsProvider.isAnnotationsEmpty(annotation);

            if (!isAnnotationsEmpty) {
                copyOfAnnotations = JSON.parse(JSON.stringify(annotation));
                let annotationImage = this.imageProvider.images[imageSrc];
                if (annotationImage) {
                    AnnotationsProvider.unscaleAnnotation(copyOfAnnotations, annotationImage.scale);
                }
            }

            let loadedAnnotation = this.loadedAnnotations[imageSrc];
            if (loadedAnnotation) {
                annotations.push(AnnotationsProvider.deepAppendAnnotations(
                    loadedAnnotation,
                    copyOfAnnotations
                ));
            } else if(!isAnnotationsEmpty) {
                annotations.push(copyOfAnnotations);
            }

        }

        return {
            'frames': annotations,
            'actions': this.actions
        };
	}

	loadAnnotations(json_from_annotations_file: any) {
        for (let annotation of json_from_annotations_file['frames']) {
            if (this.loadedAnnotations[annotation.src]) {
                this.loadedAnnotations[annotation.src] =
                    AnnotationsProvider.deepAppendAnnotations(this.loadedAnnotations[annotation.src], annotation);
            } else {
                this.loadedAnnotations[annotation.src] = annotation;
            }
        }
        this.initAnnotations(this.imageProvider.currentImage.src, this.imageProvider.currentImage.scale);
        this.renderCanvas();
    }

    static instantiateMissingAnnotationAttributes(annotation: AnnotationObject) {
        if (!annotation.lines) annotation.lines = [];
        if (!annotation.rectangles) annotation.rectangles = [];
        if (!annotation.polygons) annotation.polygons = [];
        if (!annotation.polylines) annotation.polylines = [];
    }

    static deepAppendAnnotations(annotation: AnnotationObject, existingAnnotation?: AnnotationObject) {

        // Initialize undefined objects
        if (!existingAnnotation) existingAnnotation = new AnnotationObject(annotation.src);
        if (!annotation) annotation = new AnnotationObject(annotation.src);
        this.instantiateMissingAnnotationAttributes(annotation);
        this.instantiateMissingAnnotationAttributes(existingAnnotation);

        let newAnnotations = new AnnotationObject(annotation.src);
        for (let line of annotation.lines.concat(existingAnnotation.lines)) {
            newAnnotations.lines.push(new Line(
                new CoordinatesObject(line.start.x, line.start.y),
                new CoordinatesObject(line.end.x, line.end.y),
                line.label));
        }

        for (let rectangle of annotation.rectangles.concat(existingAnnotation.rectangles)) {
            newAnnotations.rectangles.push(new Rectangle(
                new CoordinatesObject(rectangle.topLeft.x, rectangle.topLeft.y),
                new CoordinatesObject(rectangle.bottomRight.x, rectangle.bottomRight.y),
                rectangle.label));
        }

        for (let polygon of annotation.polygons.concat(existingAnnotation.polygons)) {
            let coordinates = [];
            for (let coordinate of polygon.coordinates) {
                coordinates.push(new CoordinatesObject(coordinate.x, coordinate.y));
            }
            newAnnotations.polygons.push(new Polygon(coordinates, polygon.label));
        }

        for (let polyline of annotation.polylines.concat(existingAnnotation.polylines)) {
            let coordinates = [];
            for (let coordinate of polyline.coordinates) {
                coordinates.push(new CoordinatesObject(coordinate.x, coordinate.y));
            }
            newAnnotations.polylines.push(new Polyline(coordinates, polyline.label));
        }

        return newAnnotations;
    }

	static isAnnotationsEmpty(annotations: AnnotationObject) {
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
        this.instantiateMissingAnnotationAttributes(annotation);
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