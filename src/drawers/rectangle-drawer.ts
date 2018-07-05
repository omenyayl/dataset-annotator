import {ImageProvider} from "../providers/image/image";
import {Drawable} from "../interfaces/drawable";
import {CoordinatesObject} from "../objects/CoordinatesObject";

class Box {
    x1: number;
    y1: number;
    x2: number;
    y2: number
}

const DEFAULT_COLOR = 'red';

export class RectangleDrawer implements Drawable{
    private context: CanvasRenderingContext2D;
    private boxes: Box[];
    private imageProvider: ImageProvider;
    private selectedBox: Box;

    constructor(context: CanvasRenderingContext2D,
                imageProvider: ImageProvider) {
        this.context = context;
        this.imageProvider = imageProvider;
        this.boxes = this.getBoxes();
        this.imageProvider = imageProvider;
    }

    drawLine(start, end, color = DEFAULT_COLOR): void {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();

    }

    drawAllBoxes(): void {
        for (let box of this.boxes) {
            if (box === this.selectedBox) {
                this.drawBox(box, 'yellow');
            } else {
                this.drawBox(box, 'red');
            }
        }
    }

    drawBox(box, color = DEFAULT_COLOR): void {
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x1, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x2, y: box.y1}, color);
        this.drawLine({x: box.x2, y: box.y1}, {x: box.x2, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y2}, {x: box.x2, y: box.y2}, color);
    }

    getBoxes() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src)  &&
            this.imageProvider.annotations[currentImage.src].hasOwnProperty('boxes')) {
            return this.imageProvider.annotations[currentImage.src].boxes
        } else {
            return [];
        }
    }

    addBox(box) {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src) &&
            this.imageProvider.annotations[currentImage.src].hasOwnProperty('boxes')) {
            this.imageProvider.annotations[currentImage.src].boxes.push(box);
        }
        else if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src)) {
            this.imageProvider.annotations[currentImage.src].boxes = [box];
        }
        else if (currentImage) {
            this.imageProvider.annotations[currentImage.src] = {
                boxes: [box]
            }
        }
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
        };
        this.boxes.push(newBox);
        this.addBox(newBox);
        this.drawBox(newBox);
    }


}