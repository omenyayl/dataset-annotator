import {Renderer2} from '@angular/core';
import {ImageProvider} from "../providers/image/image";
import {elementAttribute} from "@angular/core/src/render3/instructions";

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

export class LineDrawer {
    private context: CanvasRenderingContext2D;
    private element: HTMLCanvasElement;
    private renderer: Renderer2;
    private lines: Line[] = [];
    private selectedLine: Line;
    private isDrawing: boolean;
    private start: {
        x: number, y: number;
    };
    private imageProvider: ImageProvider;

    constructor(context: CanvasRenderingContext2D,
                element: HTMLCanvasElement,
                renderer: Renderer2,
                imageProvider: ImageProvider) {
        this.context = context;
        this.element = element;
        this.renderer = renderer;
        this.imageProvider = imageProvider;
    }

    onMouseClick(event) {
        this.selectNearestLine(event.offsetX, event.offsetY);
    }

    onMouseDown(event) {
        this.start = {
            x: event.offsetX,
            y: event.offsetY
        };

        this.isDrawing = true;
    }

    onMouseMove(event) {
        if (this.isDrawing) {

            this.context.clearRect(0, 0, this.element.width, this.element.height);

            this.renderLines(this.lines.concat([{
                x1: this.start.x,
                y1: this.start.y,
                x2: event.offsetX,
                y2: event.offsetY
            } as Line]));
        }

        if (this.isHoveringOnLine(event.offsetX, event.offsetY)){
            this.renderer.setStyle(this.element, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(this.element, 'cursor', 'default');
        }

    }

    onMouseUp(event) {
        this.isDrawing = false;
        let lineToPush = {
            x1: this.start.x,
            y1: this.start.y,
            x2: event.offsetX,
            y2: event.offsetY
        } as Line;

        if (LineDrawer.computeLineLength(lineToPush) > MIN_LINE_LENGTH){
            this.lines.push(lineToPush);
        }

        this.renderLines(this.lines);
    }

    drawLine(line: Line) {

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

    renderLines(lines: Line[]){
        for(let line of lines){
            this.drawLine(line);
        }
    }

    selectNearestLine(offsetX: number, offsetY: number) {
        for(let line of this.lines){
            if (LineDrawer.isNearLine(line, offsetX, offsetY)){
                this.selectedLine = line;
                this.renderLines(this.lines);
            }
        }
    }

    static isNearLine(line: Line, x, y): boolean{
        let distanceFromPoint1 = LineDrawer.computeLineLength({
            x1: line.x1,
            y1: line.y1,
            x2: x,
            y2: y
        } as Line);

        let distanceFromPoint2 = LineDrawer.computeLineLength({
            x1: line.x2,
            y1: line.y2,
            x2: x,
            y2: y
        } as Line);

        return distanceFromPoint1 <= POINT_RADIUS || distanceFromPoint2 <= POINT_RADIUS;
    }

    isHoveringOnLine(x, y): boolean {
        let hoveringOnLine = false;
        for(let line of this.lines){
            if (LineDrawer.isNearLine(line, x, y)){
                hoveringOnLine = true;
            }
        }
        return hoveringOnLine;
    }
}