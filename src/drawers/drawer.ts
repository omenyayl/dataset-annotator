import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Rectangle, Line, Polygon, Polyline} from "../providers/annotations/annotations";

export abstract class Drawer {
    public static readonly POINT_RADIUS: number = 5;
    public static readonly SELECTED_COLOR: string = '#7ef05e';
    public static readonly DEFAULT_COLOR: string = '#ed2421';
    public static readonly FONT_SIZE: number = 18;

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

    public drawCircle(point: CoordinatesObject, color = Drawer.DEFAULT_COLOR){
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(point.x, point.y, Drawer.POINT_RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    public drawLine(start, end, color = Drawer.DEFAULT_COLOR): void {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    }

    public drawText(text, location, color=Drawer.DEFAULT_COLOR) {
        this.context.font = `bold ${Drawer.FONT_SIZE}px Arial`;
        this.context.fillStyle = color;
        let oldLineWidth = this.context.lineWidth;
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'black';
        this.context.textAlign = 'center';
        this.context.strokeText(text, location.x, location.y);
        this.context.fillText(text, location.x, location.y);
        this.context.lineWidth = oldLineWidth;
    }

    static getSelectedElement(): any {
        return AnnotationsProvider.selectedElement;
    }

    setSelectedElement(element: any) {
        this.annotationsProvider.selectElement(element);
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
        else if (selectedElement instanceof Polyline) {
            Drawer.movePolyline(selectedElement, point, mouse);
        }

    }

    static moveLine(selectedElement: Line, point: CoordinatesObject, mouse: CoordinatesObject) {
        if(!Drawer.oldElement) {
            Drawer.oldElement = new Line(
                new CoordinatesObject(selectedElement.start.x, selectedElement.start.y),
                new CoordinatesObject(selectedElement.end.x, selectedElement.end.y));
        }
        if (Drawer.computeDistance(
            Drawer.oldElement.start,
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.start = mouse;
        }
        else if (Drawer.computeDistance(
            Drawer.oldElement.end,
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.end = mouse;
        }
    }

    static moveRectangle(selectedElement: Rectangle, point: CoordinatesObject, mouse: CoordinatesObject){
        if(!Drawer.oldElement) {
            Drawer.oldElement = new Rectangle(
                new CoordinatesObject(selectedElement.topLeft.x, selectedElement.topLeft.y),
                new CoordinatesObject(selectedElement.bottomRight.x, selectedElement.bottomRight.y));
        }
        if (Drawer.computeDistance(
            Drawer.oldElement.topLeft,
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.topLeft = mouse;
        }
        else if (Drawer.computeDistance(
            Drawer.oldElement.bottomRight,
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.bottomRight = mouse;
        }
        else if (Drawer.computeDistance(
            new CoordinatesObject(Drawer.oldElement.bottomRight.x, Drawer.oldElement.topLeft.y),
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.topLeft.y = mouse.y;
            selectedElement.bottomRight.x = mouse.x;
        }
        else if (Drawer.computeDistance(
            new CoordinatesObject(Drawer.oldElement.topLeft.x, Drawer.oldElement.bottomRight.y),
            point
        ) <= Drawer.POINT_RADIUS) {
            selectedElement.topLeft.x = mouse.x;
            selectedElement.bottomRight.y = mouse.y;
        }
    }

    static movePolygon(selectedElement: Polygon, point: CoordinatesObject, mouse: CoordinatesObject) {
        if(!Drawer.oldElement){
            Drawer.oldElement = new Polygon();
            for(let coordinate of selectedElement.coordinates){
                this.oldElement.coordinates.push(
                    new CoordinatesObject(coordinate.x, coordinate.y)
                );
            }
        }
        for(let i = 0; i < Drawer.oldElement.coordinates.length; i++) {
            if (Drawer.computeDistance(Drawer.oldElement.coordinates[i], point) <= Drawer.POINT_RADIUS){
                selectedElement.coordinates[i] = mouse;
            }
        }
    }

    static movePolyline(selectedElement: Polyline, point: CoordinatesObject, mouse: CoordinatesObject) {
        if(!Drawer.oldElement){
            Drawer.oldElement = new Polyline();
            for(let coordinate of selectedElement.coordinates){
                this.oldElement.coordinates.push(
                    new CoordinatesObject(coordinate.x, coordinate.y)
                );
            }
        }
        for(let i = 0; i < Drawer.oldElement.coordinates.length; i++) {
            if (Drawer.computeDistance(Drawer.oldElement.coordinates[i], point) <= Drawer.POINT_RADIUS){
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
