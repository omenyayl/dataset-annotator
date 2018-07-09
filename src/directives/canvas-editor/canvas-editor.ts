import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import { LineDrawer } from "../../drawers/line-drawer";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";
import {ImageProvider} from "../../providers/image/image";
import { CoordinatesObject } from "../../objects/CoordinatesObject";

//EventListener for deletion
import { Events } from 'ionic-angular';
import {AnnotationsProvider} from "../../providers/annotations/annotations";

/**
 * Directive for drawing elements on the HTML5 Canvas
 */
@Directive({
    selector: `[canvas-editor]`
})
export class CanvasEditorDirective {
    private lineDrawer: LineDrawer;
    private rectangleDrawer: RectangleDrawer;

    private readonly context: CanvasRenderingContext2D;
    private readonly element: HTMLCanvasElement;
    private isDrawing: boolean;
    private start: CoordinatesObject;


    constructor(private el: ElementRef,
                private annotationsProvider: AnnotationsProvider,
	  			private renderer: Renderer2,
	  			private events: Events,
                private imageProvider: ImageProvider) {
        this.element = (<HTMLCanvasElement>el.nativeElement);
        this.context = this.element.getContext('2d');
        this.lineDrawer = new LineDrawer(this.context, annotationsProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, annotationsProvider);
        this.isDrawing = false;
	  	this.renderer = renderer;

        this.subscribeToEvents();
    }

    subscribeToEvents() {
        this.events.subscribe('render-canvas', () => {
            this.render();
        });
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
        let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;

        if (this.isDrawing === false) {

            let selectedElement = this.lineDrawer.selectElement(mouseCoordinates) ||
                                    this.rectangleDrawer.selectElement(mouseCoordinates);

            if (!selectedElement) {
                this.start = {
                    x: event.offsetX,
                    y: event.offsetY
                };

                this.isDrawing = true;
            } else {
                this.render(); // re-render whatever was selected
            }

        }

        else {


            switch (this.imageProvider.selectedCanvasDirective){
                case CanvasDirectivesEnum.canvas_line:
                    this.lineDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    break;
                case CanvasDirectivesEnum.canvas_rect:
                    this.rectangleDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    break;
            }
            this.isDrawing = false;
        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {

    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {

        let hovering =
            this.lineDrawer.isHovering({x: event.offsetX, y: event.offsetY}) ||
            this.rectangleDrawer.isHovering({x: event.offsetX, y: event.offsetY});

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

    }

}
