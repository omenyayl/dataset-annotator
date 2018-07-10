import {CoordinatesObject} from "../objects/CoordinatesObject";
import { AnnotationsProvider } from "../providers/annotations/annotations";

export abstract class Drawer {

    protected constructor(private context: CanvasRenderingContext2D,
                          private annotationsProvider: AnnotationsProvider){
    }

    public getContext() {
        return this.context;
    }

    public getAnnotationsProvider() {
        return this.annotationsProvider;
    }

    static getSelectedElement() {
        return AnnotationsProvider.selectedElement;
    }

    static setSelectedElement(element: any) {
        AnnotationsProvider.selectedElement = element;
    }

    static movePoint(point: CoordinatesObject, mouse: CoordinatesObject) {
        point.x = mouse.x;
        point.y = mouse.y;
    }

    abstract saveFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract drawFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract isHovering(coordinates: CoordinatesObject);
    abstract selectElement(coordinates: CoordinatesObject): boolean;
    abstract getHoveringPoint(mouse: CoordinatesObject): CoordinatesObject;
    abstract render();
}
