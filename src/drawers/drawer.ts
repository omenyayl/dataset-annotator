import {CoordinatesObject} from "../objects/CoordinatesObject";
import { AnnotationsProvider } from "../providers/annotations/annotations";

export abstract class Drawer {

    private static selectedElement: any;

    constructor(private context: CanvasRenderingContext2D,
                private annotationsProvider: AnnotationsProvider){
    }

    public getContext() {
        return this.context;
    }

    public getAnnotationsProvider() {
        return this.annotationsProvider;
    }

    public getSelectedElement() {
        return Drawer.selectedElement;
    }

    public setSelectedElement(element: any) {
        Drawer.selectedElement = element;
    }
    abstract saveFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract drawFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract isHovering(coordinates: CoordinatesObject);
    abstract selectElement(coordinates: CoordinatesObject): boolean;
    abstract render();
}