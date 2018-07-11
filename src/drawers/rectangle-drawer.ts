import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Rectangle} from "../providers/annotations/annotations";

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';
const POINT_RADIUS = 5;

export class RectangleDrawer extends Drawer{
    private rectangles: Rectangle[];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider) {
        super(context, annotationsProvider);
        this.rectangles = super.getAnnotationsProvider().getRectangles() // reference!
    }

    drawLine(start, end, color = DEFAULT_COLOR): void {
        super.getContext().beginPath();
        super.getContext().strokeStyle = color;
        super.getContext().moveTo(start.x, start.y);
        super.getContext().lineTo(end.x, end.y);
        super.getContext().stroke();

    }

    drawAllRectangles(): void {
        for (let rectangle of this.rectangles) {
            this.drawRectangle(rectangle, rectangle === Drawer.getSelectedElement() ? SELECTED_COLOR : DEFAULT_COLOR);
        }
    }

    drawRectangle(rectangle: Rectangle, color = DEFAULT_COLOR): void {
        color = Drawer.getSelectedElement() === rectangle ? SELECTED_COLOR : DEFAULT_COLOR;
        this.drawLine({x: rectangle.start.x, y: rectangle.start.y}, {x: rectangle.start.x, y: rectangle.end.y}, color);
        this.drawLine({x: rectangle.start.x, y: rectangle.start.y}, {x: rectangle.end.x, y: rectangle.start.y}, color);
        this.drawLine({x: rectangle.end.x, y: rectangle.start.y}, {x: rectangle.end.x, y: rectangle.end.y}, color);
        this.drawLine({x: rectangle.start.x, y: rectangle.end.y}, {x: rectangle.end.x, y: rectangle.end.y}, color);

        this.drawCircle({x: rectangle.start.x, y: rectangle.start.y}, color);
        this.drawCircle({x: rectangle.end.x, y: rectangle.end.y}, color);
        this.drawCircle({x: rectangle.end.x, y: rectangle.start.y}, color);
        this.drawCircle({x: rectangle.start.x, y: rectangle.end.y}, color);
    }


    drawCircle(coordinates: CoordinatesObject, color = DEFAULT_COLOR){
        super.getContext().beginPath();
        super.getContext().fillStyle = color;
        super.getContext().arc(coordinates.x, coordinates.y, POINT_RADIUS, 0, 2 * Math.PI);
        super.getContext().fill();
        super.getContext().stroke();
    }

    drawFromCoordinates(...coordinates: CoordinatesObject[]) {
        if (coordinates.length < 2) {
            throw new RangeError(`RectangleDrawer.drawFromCoordinates expected 2 coordinates, but only received ${coordinates.length}`);
        }
        this.drawRectangle(new Rectangle(
            coordinates[0],
            coordinates[1]
        ));
    }

    render() {
        this.drawAllRectangles();
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        let newRectangle = new Rectangle(
            coordinates[0],
            coordinates[1]
        );

        if (RectangleDrawer.computeDistance(coordinates[0], coordinates[1]) > POINT_RADIUS * 2){
            this.getAnnotationsProvider().addRectangle(newRectangle);
            this.drawRectangle(newRectangle);
        }

    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    isHovering(coordinates: CoordinatesObject){

        let hovering = false;
        for(let rectangle of this.rectangles){
            if(RectangleDrawer.isNearCoordinates(rectangle, coordinates)) {
                hovering = true;
            }
        }

        return hovering;

    }

    static isNearCoordinates(rectangle: Rectangle, location: CoordinatesObject) : boolean {
        let pointCoordinates = [
            {
                x: rectangle.start.x,
                y: rectangle.start.y
            },
            {
                x: rectangle.end.x,
                y: rectangle.end.y
            },
            {
                x: rectangle.end.x,
                y: rectangle.start.y
            },
            {
                x: rectangle.start.x,
                y: rectangle.end.y
            }];
        for(let point of pointCoordinates){
            if (RectangleDrawer.computeDistance(location, point) < POINT_RADIUS){
                return true;
            }
        }
        return false;
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        for (let rectangle of this.rectangles) {
            if (RectangleDrawer.isNearCoordinates(rectangle, coordinates)) {
                Drawer.setSelectedElement(rectangle);
                return true;
            }
        }
        return false;
    }



}
