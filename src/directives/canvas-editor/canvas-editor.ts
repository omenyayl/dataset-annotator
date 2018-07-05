import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import { LineDrawer } from "../../drawers/line-drawer";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";
import {ImageProvider} from "../../providers/image/image";
import { CoordinatesObject } from "../../objects/CoordinatesObject";

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
    private isDrawing: boolean;
    private start: CoordinatesObject;
    private renderer: Renderer2;


    constructor(el: ElementRef,
                imageProvider: ImageProvider,
                renderer: Renderer2) {
        this.element = (<HTMLCanvasElement>el.nativeElement);
        this.context = this.element.getContext('2d');
        this.lineDrawer = new LineDrawer(this.context, imageProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, imageProvider);
        this.imageProvider = imageProvider;
        this.isDrawing = false;
        this.renderer = renderer;
    }

    render() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.lineDrawer.render();
        this.rectangleDrawer.render();
    }

    ngAfterViewInit() {
        this.render();
    }

    @HostListener('click', ['$event']) onMouseClick(event) {

    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {

        this.start = {
            x: event.offsetX,
            y: event.offsetY
        };

        this.isDrawing = true;
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {

        let hovering = false;
        hovering = this.lineDrawer.isHovering({x: event.offsetX, y: event.offsetY});

        if (hovering) {
            this.renderer.setStyle(this.element, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(this.element, 'cursor', 'default');
        }


        if (this.isDrawing) {

            let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;
            this.render();

            switch (this.imageProvider.selectedCanvasDirective){
                case CanvasDirectivesEnum.canvas_line:
                    this.lineDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case CanvasDirectivesEnum.canvas_rect:
                    this.rectangleDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
            }

        }
    }

    @HostListener('mouseup', ['$event']) onMouseUp(event) {
        this.isDrawing = false;

        let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;

        switch (this.imageProvider.selectedCanvasDirective){
            case CanvasDirectivesEnum.canvas_line:
                this.lineDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                break;
            case CanvasDirectivesEnum.canvas_rect:
                this.rectangleDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                break;
        }

    }

}
