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
const POINT_RADIUS = 5;

export class RectangleDrawer implements Drawable{
    private context: CanvasRenderingContext2D;
    private readonly boxes: Box[];
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

        this.drawCircle({x: box.x1, y: box.y1});
        this.drawCircle({x: box.x2, y: box.y2});
        this.drawCircle({x: box.x2, y: box.y1});
        this.drawCircle({x: box.x1, y: box.y2});
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

    drawCircle(coordinates: CoordinatesObject, color = DEFAULT_COLOR){
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(coordinates.x, coordinates.y, POINT_RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
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

        if (RectangleDrawer.computeDistance(coordinates[0], coordinates[1]) > POINT_RADIUS * 2){
            this.boxes.push(newBox);
            this.addBox(newBox);
            this.drawBox(newBox);
        }

    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    isHovering(coordinates: CoordinatesObject){

        let hovering = false;
        for(let box of this.boxes){
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
                if (RectangleDrawer.computeDistance(coordinates, point) < POINT_RADIUS){
                    hovering = true;
                }
            }
        }

        return hovering;

    }

}