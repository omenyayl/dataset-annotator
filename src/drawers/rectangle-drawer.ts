import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Rectangle} from "../providers/annotations/annotations";

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';
const POINT_RADIUS = 5;

export class RectangleDrawer extends Drawer{
    private boxes: Rectangle[];

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
        this.drawLine({x: box.start.x, y: box.start.y}, {x: box.start.x, y: box.end.y}, color);
        this.drawLine({x: box.start.x, y: box.start.y}, {x: box.end.x, y: box.start.y}, color);
        this.drawLine({x: box.end.x, y: box.start.y}, {x: box.end.x, y: box.end.y}, color);
        this.drawLine({x: box.start.x, y: box.end.y}, {x: box.end.x, y: box.end.y}, color);

        this.drawCircle({x: box.start.x, y: box.start.y}, color);
        this.drawCircle({x: box.end.x, y: box.end.y}, color);
        this.drawCircle({x: box.end.x, y: box.start.y}, color);
        this.drawCircle({x: box.start.x, y: box.end.y}, color);
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
        this.drawBox(new Rectangle(
            coordinates[0],
            coordinates[1]
        ));
    }

    render() {
        this.drawAllBoxes();
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        let newBox = new Rectangle(
            coordinates[0],
            coordinates[1]
        );

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

    static isNearCoordinates(box: Rectangle, location: CoordinatesObject) : boolean {
        let pointCoordinates = [
            {
                x: box.start.x,
                y: box.start.y
            },
            {
                x: box.end.x,
                y: box.end.y
            },
            {
                x: box.end.x,
                y: box.start.y
            },
            {
                x: box.start.x,
                y: box.end.y
            }];
        for(let point of pointCoordinates){
            if (RectangleDrawer.computeDistance(location, point) < POINT_RADIUS){
                return true;
            }
        }
        return false;
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

    getHoveringPoint(mouse: CoordinatesObject): CoordinatesObject {
        for(let i = 0; i < this.boxes.length; i++){
            if (RectangleDrawer.computeDistance(this.boxes[i].start, mouse) < POINT_RADIUS) {
                return this.boxes[i].start;
            }
            else if (RectangleDrawer.computeDistance(this.boxes[i].end, mouse) < POINT_RADIUS) {
                return this.boxes[i].end;
            }
        }
        return null;
    }

}
