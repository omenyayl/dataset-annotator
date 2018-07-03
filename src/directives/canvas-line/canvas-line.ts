import {Directive, ElementRef, HostListener} from '@angular/core';
import { ImageProvider } from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";

class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number
}


let element: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let isDrawing: boolean;
let lastMouse: { x: number, y: number };
let start: {
    x: number, y: number;
};
let lines: Line[] = [];
const MIN_LINE_LENGTH = 10;


/**
 * Directive for drawing elements on the HTML5 Canvas
 */
@Directive({
    selector: `[${CanvasDirectivesEnum.canvas_line}]`
})
export class CanvasLineDirective {

    constructor(el: ElementRef,
                imageProvider: ImageProvider) {
        element = (<HTMLCanvasElement>el.nativeElement);
        context = element.getContext('2d');
        isDrawing = false;
        lastMouse = {x: 0, y: 0};
        console.log('Constructor called from directive');
    }

    ngOnInit() {
    }

    @HostListener('click', ['$event']) onMouseClick(event) {
        this.selectNearestLine(event.offsetX, event.offsetY);
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        start = {
            x: event.offsetX,
            y: event.offsetY
        };

        isDrawing = true;
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        if (isDrawing) {

            context.clearRect(0, 0, element.width, element.height);

            this.drawLines(lines.concat([{
                x1: start.x,
                y1: start.y,
                x2: event.offsetX,
                y2: event.offsetY
            } as Line]));
        }
    }

    @HostListener('mouseup', ['$event']) onMouseUp(event) {
        isDrawing = false;
        lines.push({
            x1: start.x,
            y1: start.y,
            x2: event.offsetX,
            y2: event.offsetY
        } as Line);
    }

    drawLine(line: Line) {

        if(this.computeLineLength(line) < MIN_LINE_LENGTH){
            return;
        }

        this.drawCircle(line.x1, line.y1);
        context.beginPath();
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.strokeStyle = 'red';
        context.stroke();
        this.drawCircle(line.x2, line.y2);
    }

    drawCircle(x: number, y: number, r: number = 3){
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = 'red';
        context.fill();
        context.stroke();
    }

    computeLineLength(line: Line){
        return Math.sqrt(Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2));
    }

    drawLines(lines: Line[]){
        for(let line of lines){
            this.drawLine(line);
        }
    }

    selectNearestLine(offsetX: number, offsetY: number) {
        for(let line of lines){
            if (this.isNearLine(line)){

            }
        }
    }

    isNearLine(line: Line): boolean{
        return false;
    }
}
