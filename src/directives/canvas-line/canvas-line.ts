import {Directive, ElementRef, HostListener} from '@angular/core';
import { ImageProvider } from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";

let element: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let isDrawing: boolean;
let lastMouse: { x: number, y: number };


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
        console.log(imageProvider.currentImage);
    }

    ngOnInit() {

    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        lastMouse.x = event.offsetX;
        lastMouse.y = event.offsetY;
        context.beginPath();
        isDrawing = true;
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        if (isDrawing) {
            context.moveTo(lastMouse.x, lastMouse.y);
            context.lineTo(event.offsetX, event.offsetY);
            context.strokeStyle = 'red';
            context.stroke();
            // save last mouse
            lastMouse.x = event.offsetX;
            lastMouse.y = event.offsetY;
        }
    }

    @HostListener('mouseup') onMouseUp() {
        isDrawing = false;
    }
}
