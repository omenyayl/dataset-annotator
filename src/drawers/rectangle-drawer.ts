import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Rectangle} from "../providers/annotations/annotations";

export class RectangleDrawer extends Drawer{
    private rectangles: Rectangle[];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider) {
        super(context, annotationsProvider);
        this.rectangles = super.getAnnotationsProvider().getRectangles() // reference!
    }

    drawAllRectangles(): void {
        for (let rectangle of this.rectangles) {
            let color = rectangle === Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
            super.drawText(rectangle.label, new CoordinatesObject(
                (rectangle.start.x + rectangle.end.x) / 2,
                Math.min(rectangle.end.y, rectangle.start.y) - 10
            ), color);
            this.drawRectangle(rectangle, color);
        }
    }

    drawRectangle(rectangle: Rectangle, color = Drawer.DEFAULT_COLOR): void {
        color = Drawer.getSelectedElement() === rectangle ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
        super.drawLine({x: rectangle.start.x, y: rectangle.start.y}, {x: rectangle.start.x, y: rectangle.end.y}, color);
        super.drawLine({x: rectangle.start.x, y: rectangle.start.y}, {x: rectangle.end.x, y: rectangle.start.y}, color);
        super.drawLine({x: rectangle.end.x, y: rectangle.start.y}, {x: rectangle.end.x, y: rectangle.end.y}, color);
        super.drawLine({x: rectangle.start.x, y: rectangle.end.y}, {x: rectangle.end.x, y: rectangle.end.y}, color);

        super.drawCircle({x: rectangle.start.x, y: rectangle.start.y}, color);
        super.drawCircle({x: rectangle.end.x, y: rectangle.end.y}, color);
        super.drawCircle({x: rectangle.end.x, y: rectangle.start.y}, color);
        super.drawCircle({x: rectangle.start.x, y: rectangle.end.y}, color);
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

        if (Drawer.computeDistance(coordinates[0], coordinates[1]) > Drawer.POINT_RADIUS * 2){
            this.getAnnotationsProvider().addRectangle(newRectangle);
            this.drawRectangle(newRectangle);
        }

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
            if (Drawer.computeDistance(location, point) < Drawer.POINT_RADIUS){
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
