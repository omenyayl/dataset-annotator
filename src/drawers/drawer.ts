import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Box, Line, Polygon} from "../providers/annotations/annotations";

const POINT_RADIUS = 5;

export abstract class Drawer {

    private static oldElement: any;

    protected constructor(private context: CanvasRenderingContext2D,
                          private annotationsProvider: AnnotationsProvider){
    }

    public getContext() {
        return this.context;
    }

    public getAnnotationsProvider() {
        return this.annotationsProvider;
    }

    static getSelectedElement(): Line | Box | Polygon {
        return AnnotationsProvider.selectedElement;
    }

    static setSelectedElement(element: Line | Box | Polygon) {
        AnnotationsProvider.selectedElement = element;
    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    static moveSelectedElement(point: CoordinatesObject, mouse: CoordinatesObject) {
        let selectedElement = Drawer.getSelectedElement();
        if (selectedElement instanceof Line) {
            if(!Drawer.oldElement) {
                Drawer.oldElement = new Line(selectedElement.start, selectedElement.end);
            }
            if (Drawer.computeDistance(
                    Drawer.oldElement.start,
                    point
                ) <= POINT_RADIUS) {
                selectedElement.start = mouse;
            }
            else if (Drawer.computeDistance(
                    Drawer.oldElement.end,
                    point
                ) <= POINT_RADIUS) {
                selectedElement.end = mouse;
            }        }
        else if (selectedElement instanceof Box) {
            if(!Drawer.oldElement) {
                Drawer.oldElement = new Box(selectedElement.start, selectedElement.end);
            }
            if (Drawer.computeDistance(
                    Drawer.oldElement.start,
                    point
                ) <= POINT_RADIUS) {
                selectedElement.start = mouse;
            }
            else if (Drawer.computeDistance(
                    Drawer.oldElement.end,
                    point
                ) <= POINT_RADIUS) {
                selectedElement.end = mouse;
            }
            else if (Drawer.computeDistance(
                    new CoordinatesObject(Drawer.oldElement.end.x, Drawer.oldElement.start.y),
                    point
                ) <= POINT_RADIUS) {
                selectedElement.start = new CoordinatesObject(Drawer.oldElement.start.x, mouse.y);
                selectedElement.end = new CoordinatesObject(mouse.x, Drawer.oldElement.start.y);
            }
            else if (Drawer.computeDistance(
                    new CoordinatesObject(Drawer.oldElement.start.x, Drawer.oldElement.end.y),
                    point
                ) <= POINT_RADIUS) {
                selectedElement.start = new CoordinatesObject(mouse.x, Drawer.oldElement.start.y);
                selectedElement.end = new CoordinatesObject(Drawer.oldElement.start.x, mouse.y);
            }
        }

    }

    static finishMovingSelectedElement() {
        Drawer.oldElement = null;
    }

    abstract saveFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract drawFromCoordinates(...coordinates: CoordinatesObject[]);
    abstract isHovering(coordinates: CoordinatesObject);
    abstract selectElement(coordinates: CoordinatesObject): boolean;
    abstract render();
}
