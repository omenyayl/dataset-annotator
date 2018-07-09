import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Box} from "../providers/annotations/annotations";



const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';
const POINT_RADIUS = 5;

export class RectangleDrawer extends Drawer{
    private boxes: Box[];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider) {
        super(context, annotationsProvider);
        this.boxes = super.getAnnotationsProvider().getBoxes() // reference!
    }

    drawLine(start, end, color = DEFAULT_COLOR): void {
        super.getContext().beginPath();
        super.getContext().strokeStyle = color;
        super.getContext().moveTo(start.x, start.y);
        super.getContext().lineTo(end.x, end.y);
        super.getContext().stroke();

    }

    drawAllBoxes(): void {
        for (let box of this.boxes) {
            this.drawBox(box, box === Drawer.getSelectedElement() ? SELECTED_COLOR : DEFAULT_COLOR);
        }
    }

    drawBox(box, color = DEFAULT_COLOR): void {
        color = Drawer.getSelectedElement() === box ? SELECTED_COLOR : DEFAULT_COLOR;
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x1, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x2, y: box.y1}, color);
        this.drawLine({x: box.x2, y: box.y1}, {x: box.x2, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y2}, {x: box.x2, y: box.y2}, color);

        this.drawCircle({x: box.x1, y: box.y1}, color);
        this.drawCircle({x: box.x2, y: box.y2}, color);
        this.drawCircle({x: box.x2, y: box.y1}, color);
        this.drawCircle({x: box.x1, y: box.y2}, color);
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
        this.drawBox({
            x1: coordinates[0].x,
            y1: coordinates[0].y,
            x2: coordinates[1].x,
            y2: coordinates[1].y
        });
    }

    render() {
        this.drawAllBoxes();
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        let newBox = {
            x1: coordinates[0].x,
            y1: coordinates[0].y,
            x2: coordinates[1].x,
            y2: coordinates[1].y
        } as Box;

        if (RectangleDrawer.computeDistance(coordinates[0], coordinates[1]) > POINT_RADIUS * 2){
            this.getAnnotationsProvider().addBox(newBox);
            this.drawBox(newBox);
        }

    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    isHovering(coordinates: CoordinatesObject){

        let hovering = false;
        for(let box of this.boxes){
            if(RectangleDrawer.isNearCoordinates(box, coordinates)) {
                hovering = true;
            }
        }

        return hovering;

    }

    static isNearCoordinates(box: Box, location: CoordinatesObject) {
        let pointCoordinates = [
            {
                x: box.x1,
                y: box.y1
            },
            {
                x: box.x2,
                y: box.y2
            },
            {
                x: box.x2,
                y: box.y1
            },
            {
                x: box.x1,
                y: box.y2
            }];
        for(let point of pointCoordinates){
            if (RectangleDrawer.computeDistance(location, point) < POINT_RADIUS){
                return true;
            }
        }
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        for (let box of this.boxes) {
            if (RectangleDrawer.isNearCoordinates(box, coordinates)) {
                Drawer.setSelectedElement(box);
                return true;
            }
        }
        return false;
    }

}
