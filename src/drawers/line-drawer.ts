import {ImageProvider} from "../providers/image/image";
import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawable} from "../interfaces/drawable";

class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number
}

const MIN_LINE_LENGTH = 10;
const POINT_RADIUS = 7;

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';

export class LineDrawer implements Drawable{
    private context: CanvasRenderingContext2D;
    private lines: Line[] = [];
    private selectedLine: Line;
    private imageProvider: ImageProvider;

    constructor(context: CanvasRenderingContext2D,
                imageProvider: ImageProvider) {
        this.context = context;
        this.imageProvider = imageProvider;
        this.lines = this.getLines();
    }

    saveFromCoordinates(start: CoordinatesObject, end: CoordinatesObject) {
        let line = this.getLineFromCoordinates(start, end);
        this.saveLine(line)
    }

    drawFromCoordinates(start: CoordinatesObject, end: CoordinatesObject){
        let line = this.getLineFromCoordinates(start, end);
        this.drawLine(line);
    }

    saveLine(line: Line){
        if (LineDrawer.computeLineLength(line) > MIN_LINE_LENGTH){
            this.lines.push(line);
            this.addLine(line);
            this.drawLine(line);
        }
    }

    drawLine(line: Line){
        if (LineDrawer.computeLineLength(line) < MIN_LINE_LENGTH){
            return;
        }

        let color = line === this.selectedLine ? SELECTED_COLOR : DEFAULT_COLOR;

        this.drawCircle(line.x1, line.y1, color);
        this.context.beginPath();
        this.context.moveTo(line.x1, line.y1);
        this.context.lineTo(line.x2, line.y2);
        this.context.strokeStyle = color;
        this.context.stroke();
        this.drawCircle(line.x2, line.y2, color);
    }

    drawCircle(x: number, y: number, color = DEFAULT_COLOR){
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    static computeLineLength(line: Line){
        return Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    }

    render(){
        this.renderLines(this.lines);
    }

    renderLines(lines: Line[]){
        for(let line of lines){
            this.drawLine(line);
        }
    }

    // static isNearLine(line: Line, x, y): boolean{
    //     let distanceFromPoint1 = LineDrawer.computeLineLength({
    //         x1: line.x1,
    //         y1: line.y1,
    //         x2: x,
    //         y2: y
    //     } as Line);
    //
    //     let distanceFromPoint2 = LineDrawer.computeLineLength({
    //         x1: line.x2,
    //         y1: line.y2,
    //         x2: x,
    //         y2: y
    //     } as Line);
    //
    //     return distanceFromPoint1 <= POINT_RADIUS || distanceFromPoint2 <= POINT_RADIUS;
    // }
    //
    // isHoveringOnLine(x, y): boolean {
    //     let hoveringOnLine = false;
    //     for(let line of this.lines){
    //         if (LineDrawer.isNearLine(line, x, y)){
    //             hoveringOnLine = true;
    //         }
    //     }
    //     return hoveringOnLine;
    // }


    getLines() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src) &&
            this.imageProvider.annotations[currentImage.src].hasOwnProperty('lines')) {
            return this.imageProvider.annotations[currentImage.src].lines
        } else {
            return [];
        }
    }

    addLine(line: Line) {


        let currentImage = this.imageProvider.currentImage;
        if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src) &&
            this.imageProvider.annotations[currentImage.src].hasOwnProperty('lines')) {
            this.imageProvider.annotations[currentImage.src].lines.push(line);
        }
        else if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src)) {
            this.imageProvider.annotations[currentImage.src].lines = [line];
        }
        else if (currentImage) {
            this.imageProvider.annotations[currentImage.src] = {
                lines: [line]
            }
        }
    }

    getLineFromCoordinates(start: CoordinatesObject, end: CoordinatesObject): Line {
        return {
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y
        } as Line
    }
}