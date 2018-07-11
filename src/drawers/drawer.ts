import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Rectangle, Line, Polygon} from "../providers/annotations/annotations";

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

    static getSelectedElement(): any {
        return AnnotationsProvider.selectedElement;
    }

    static setSelectedElement(element: any) {
        AnnotationsProvider.selectedElement = element;
    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    static moveSelectedElement(point: CoordinatesObject, mouse: CoordinatesObject) {
        let selectedElement = Drawer.getSelectedElement();
        if (selectedElement instanceof Line) {
            Drawer.moveLine(selectedElement, point, mouse);
        }
        else if (selectedElement instanceof Rectangle) {
            Drawer.moveRectangle(selectedElement, point, mouse);
        }
        else if (selectedElement instanceof Polygon) {
            Drawer.movePolygon(selectedElement, point, mouse);
        }

    }

    static moveLine(selectedElement: any, point: CoordinatesObject, mouse: CoordinatesObject) {
        if(!Drawer.oldElement) {
            Drawer.oldElement = new Line(
                new CoordinatesObject(selectedElement.start.x, selectedElement.start.y),
                new CoordinatesObject(selectedElement.end.x, selectedElement.end.y));
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
    }

    static moveRectangle(selectedElement: any, point: CoordinatesObject, mouse: CoordinatesObject){
        if(!Drawer.oldElement) {
            Drawer.oldElement = new Rectangle(
                new CoordinatesObject(selectedElement.start.x, selectedElement.start.y),
                new CoordinatesObject(selectedElement.end.x, selectedElement.end.y));
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
            selectedElement.start.y = mouse.y;
            selectedElement.end.x = mouse.x;
        }
        else if (Drawer.computeDistance(
            new CoordinatesObject(Drawer.oldElement.start.x, Drawer.oldElement.end.y),
            point
        ) <= POINT_RADIUS) {
            selectedElement.start.x = mouse.x;
            selectedElement.end.y = mouse.y;
        }
    }

    static movePolygon(selectedElement: any, point: CoordinatesObject, mouse: CoordinatesObject) {
        if(!Drawer.oldElement){
            Drawer.oldElement = new Polygon();
            for(let coordinate of selectedElement.coordinates){
                this.oldElement.coordinates.push(
                    new CoordinatesObject(coordinate.x, coordinate.y)
                );
            }
        }
        for(let i = 0; i < Drawer.oldElement.coordinates.length; i++) {
            if (Drawer.computeDistance(Drawer.oldElement.coordinates[i], point) <= POINT_RADIUS){
                selectedElement.coordinates[i] = mouse;
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
