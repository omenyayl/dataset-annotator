import {ImageProvider} from "../providers/image/image";
import {CoordinatesObject} from "../objects/CoordinatesObject";

export abstract class Drawer {

    private static selectedElement: any;

    constructor(private context: CanvasRenderingContext2D,
                private imageProvider: ImageProvider){
    }

    public getContext() {
        return this.context;
    }

    public getImageProvider() {
        return this.imageProvider;
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