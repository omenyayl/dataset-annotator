import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
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
let selectedLine: Line;
const MIN_LINE_LENGTH = 10;
const POINT_RADIUS = 7;

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';


/**
 * Directive for drawing elements on the HTML5 Canvas
 */
@Directive({
    selector: `[${CanvasDirectivesEnum.canvas_line}]`
})
export class CanvasLineDirective {
    renderer: Renderer2;

    constructor(el: ElementRef,
                imageProvider: ImageProvider,
                renderer: Renderer2) {
        element = (<HTMLCanvasElement>el.nativeElement);
        context = element.getContext('2d');
        isDrawing = false;
        lastMouse = {x: 0, y: 0};
        this.renderer = renderer;
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

        if (this.isHoveringOnLine(event.offsetX, event.offsetY)){
            this.renderer.setStyle(element, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(element, 'cursor', 'default');
        }

    }

    @HostListener('mouseup', ['$event']) onMouseUp(event) {
        isDrawing = false;
        let lineToPush = {
            x1: start.x,
            y1: start.y,
            x2: event.offsetX,
            y2: event.offsetY
        } as Line;

        if (this.computeLineLength(lineToPush) > MIN_LINE_LENGTH){
            lines.push(lineToPush);
        }
    }

    drawLine(line: Line) {

        if (this.computeLineLength(line) < MIN_LINE_LENGTH){
            return;
        }

        let color = line === selectedLine ? SELECTED_COLOR : DEFAULT_COLOR;

        this.drawCircle(line.x1, line.y1, color);
        context.beginPath();
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.strokeStyle = color;
        context.stroke();
        this.drawCircle(line.x2, line.y2, color);

    }

    drawCircle(x: number, y: number, color = DEFAULT_COLOR){
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
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
            if (this.isNearLine(line, offsetX, offsetY)){
                selectedLine = line;
                this.drawLines(lines);
            }
        }
    }

    isNearLine(line: Line, x, y): boolean{
        let distanceFromPoint1 = this.computeLineLength({
            x1: line.x1,
            y1: line.y1,
            x2: x,
            y2: y
        } as Line);

        let distanceFromPoint2 = this.computeLineLength({
            x1: line.x2,
            y1: line.y2,
            x2: x,
            y2: y
        } as Line);

        return distanceFromPoint1 <= POINT_RADIUS || distanceFromPoint2 <= POINT_RADIUS;
    }

    isHoveringOnLine(x, y): boolean {
        let hoveringOnLine = false;
        for(let line of lines){
            if (this.isNearLine(line, x, y)){
                hoveringOnLine = true;
            }
        }
        return hoveringOnLine;
    }
}
