import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import { ImageProvider } from "../../providers/image/image";
import { LineDrawer } from "../../drawers/line-drawer";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";

/**
 * Directive for drawing elements on the HTML5 Canvas
 */
@Directive({
    selector: `[canvas-editor]`
})
export class CanvasEditorDirective {
    private lineDrawer: LineDrawer;
    private rectangleDrawer: RectangleDrawer;

    private context: CanvasRenderingContext2D;
    private element: HTMLCanvasElement;
    private imageProvider: ImageProvider;

    constructor(el: ElementRef,
                imageProvider: ImageProvider,
                renderer: Renderer2) {
        this.element = (<HTMLCanvasElement>el.nativeElement);
        this.context = this.element.getContext('2d');
        this.lineDrawer = new LineDrawer(this.context, this.element, renderer, imageProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, this.element, renderer, imageProvider);
        this.imageProvider = imageProvider;
        console.log(imageProvider.selectedCanvasDirective);
    }

    @HostListener('click', ['$event']) onMouseClick(event) {
        switch(this.imageProvider.selectedCanvasDirective){
            case CanvasDirectivesEnum.canvas_line:
                this.lineDrawer.onMouseClick(event);
        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        switch(this.imageProvider.selectedCanvasDirective){
            case CanvasDirectivesEnum.canvas_line:
                this.lineDrawer.onMouseDown(event);
                break;
            case CanvasDirectivesEnum.canvas_rect:
                this.rectangleDrawer.onMouseDown(event);
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        switch(this.imageProvider.selectedCanvasDirective){
            case CanvasDirectivesEnum.canvas_line:
                this.lineDrawer.onMouseMove(event);
                break;
            case CanvasDirectivesEnum.canvas_rect:
                this.rectangleDrawer.onMouseMove(event);
        }
    }

    @HostListener('mouseup', ['$event']) onMouseUp(event) {
        switch(this.imageProvider.selectedCanvasDirective){
            case CanvasDirectivesEnum.canvas_line:
                this.lineDrawer.onMouseUp(event);
                break;
            case CanvasDirectivesEnum.canvas_rect:
                this.rectangleDrawer.onMouseUp(event);
        }
    }

}
