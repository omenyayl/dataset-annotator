import { ImageProvider } from "../providers/image/image";

class Box {
    x1: number;
    y1: number;
    x2: number;
    y2: number
}

const DEFAULT_COLOR = 'red';

export class RectangleDrawer {
    private context: CanvasRenderingContext2D;
    private element: HTMLCanvasElement;
    private isDrawing: boolean;
    private curBox: Box;
    private boxes: Box[];
    private imageProvider: ImageProvider;
    private selectedBox: Box;

    constructor(context: CanvasRenderingContext2D,
                element: HTMLCanvasElement,
                imageProvider: ImageProvider) {
        this.context = context;
        this.element = element;
        this.imageProvider = imageProvider;
        this.isDrawing = false;
        this.boxes = imageProvider.getBoxes();
        this.imageProvider = imageProvider;
    }

    onMouseDown(event) {
        this.curBox = {x1: event.offsetX, y1: event.offsetY, x2: -1, y2: -1} as Box;
        this.context.beginPath();
        this.isDrawing = true;
    }

    onMouseMove(event) {
        if(this.isDrawing){
            this.curBox.x2 = event.offsetX;
            this.curBox.y2 = event.offsetY;

            this.context.clearRect(0, 0, this.element.width, this.element.height);

            for (let box of this.boxes) {
                this.drawBox(box, 'red');
            }

            this.drawBox(this.curBox, 'white');
        }

    }

    onMouseUp() {
        //curBox.label = null;
        if (this.curBox.x2 != -1) {
            this.boxes.push(this.curBox);
            this.imageProvider.addBox(this.curBox);
        }
        this.isDrawing = false;
        this.drawAllBoxes();
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

}