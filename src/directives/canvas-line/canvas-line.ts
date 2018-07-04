import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import { ImageProvider } from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";
import { Line } from "../../objects/line";

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
    private selectedLine: Line;
    private readonly element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private isDrawing: boolean;
    private start: {
        x: number, y: number;
    };
    private imageProvider: ImageProvider;
    private lines: Line[];
    
    constructor(el: ElementRef,
                imageProvider: ImageProvider,
                renderer: Renderer2) {
        this.element = (<HTMLCanvasElement>el.nativeElement);
        this.context = this.element.getContext('2d');
        this.isDrawing = false;
        this.renderer = renderer;
        this.imageProvider = imageProvider;

        this.lines = this.getLines();
    }

    ngAfterViewInit() {
        this.renderLines(this.lines);
    }

    @HostListener('click', ['$event']) onMouseClick(event) {
        this.selectNearestLine(event.offsetX, event.offsetY);
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        this.start = {
            x: event.offsetX,
            y: event.offsetY
        };

        this.isDrawing = true;
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
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

    @HostListener('mouseup', ['$event']) onMouseUp(event) {
        this.isDrawing = false;
        let lineToPush = {
            x1: this.start.x,
            y1: this.start.y,
            x2: event.offsetX,
            y2: event.offsetY
        } as Line;

        if (CanvasLineDirective.computeLineLength(lineToPush) > MIN_LINE_LENGTH){
            this.lines.push(lineToPush);
            this.addLine(lineToPush);
        }
    }

    drawLine(line: Line) {

        if (CanvasLineDirective.computeLineLength(line) < MIN_LINE_LENGTH){
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
            if (CanvasLineDirective.isNearLine(line, offsetX, offsetY)){
                this.selectedLine = line;
                this.renderLines(this.lines);
            }
        }
    }

    static isNearLine(line: Line, x, y): boolean{
        let distanceFromPoint1 = CanvasLineDirective.computeLineLength({
            x1: line.x1,
            y1: line.y1,
            x2: x,
            y2: y
        } as Line);

        let distanceFromPoint2 = CanvasLineDirective.computeLineLength({
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
            if (CanvasLineDirective.isNearLine(line, x, y)){
                hoveringOnLine = true;
            }
        }
        return hoveringOnLine;
    }

    getLines() {
        let currentImage = this.imageProvider.currentImage;
        if (currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src) &&
        this.imageProvider.annotations[currentImage.src].hasOwnProperty('lines')) {
            return this.imageProvider.annotations[currentImage.src].lines
        } else {
            return [];
        }
    }

    addLine(line) {
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
}
