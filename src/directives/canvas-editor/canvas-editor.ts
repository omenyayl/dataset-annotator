import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';
import { LineDrawer } from "../../drawers/line-drawer";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";
import {ImageProvider} from "../../providers/image/image";
import { CoordinatesObject } from "../../objects/CoordinatesObject";

//EventListener for deletion
import { Events } from 'ionic-angular';
import {AnnotationsProvider} from "../../providers/annotations/annotations";
import {PolygonDrawer} from "../../drawers/polygon-drawer";
import {Drawer} from "../../drawers/drawer";

/**
 * Directive for drawing elements on the HTML5 Canvas
 */
@Directive({
    selector: `[canvas-editor]`
})
export class CanvasEditorDirective {
    private lineDrawer: LineDrawer;
    private rectangleDrawer: RectangleDrawer;
    private polygonDrawer: PolygonDrawer;

    private readonly context: CanvasRenderingContext2D;
    private readonly element: HTMLCanvasElement;
    private isDrawing: boolean;
    private isPointHeld: boolean;
    private heldPoint: CoordinatesObject;
    private start: CoordinatesObject;

    constructor(el: ElementRef,
                annotationsProvider: AnnotationsProvider,
	  			private renderer: Renderer2,
	  			private events: Events,
                private imageProvider: ImageProvider) {
        this.element = (<HTMLCanvasElement>el.nativeElement);
        this.context = this.element.getContext('2d');

        // Initialize our drawing tools
        this.lineDrawer = new LineDrawer(this.context, annotationsProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, annotationsProvider);
        this.polygonDrawer = new PolygonDrawer(this.context, annotationsProvider);

        this.isDrawing = false; // for drawing
        this.isPointHeld = false; // for moving points

	  	this.renderer = renderer;

        this.subscribeToEvents();
    }

    /**
     * Subscriber that re-renders the canvas.
     */
    subscribeToEvents() {
	  	this.events.subscribe('render-canvas', () => {
            this.render();
        });
    }

    render() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
        this.lineDrawer.render();
        this.rectangleDrawer.render();
        this.polygonDrawer.render();
    }

    ngAfterViewInit() {
        this.render();
    }

    @HostListener('click', ['$event']) onMouseClick(event) {

        // The user releases the mouse button to stop dragging the held point
        if (this.isPointHeld && ! this.isDrawing) {
            this.isPointHeld = false;
            Drawer.finishMovingSelectedElement();
            return;
        }

        let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;

        // initializes the starting position when the first click is found
        if (!this.isDrawing) {
            this.start = {
                x: event.offsetX,
                y: event.offsetY
            };

            this.isDrawing = true;

            // Adding the initial starting point to the polygon
            if (this.imageProvider.selectedCanvasDirective === CanvasDirectivesEnum.canvas_polygon) {
                this.polygonDrawer.addPoint(this.start);
            }

            this.render(); // re-render whatever was selected
        }


        // Save point when clicked the second time
        else {

            switch (this.imageProvider.selectedCanvasDirective){
                case CanvasDirectivesEnum.canvas_line:
                    this.lineDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    this.isDrawing = false;
                    this.render();
                    break;
                case CanvasDirectivesEnum.canvas_rect:
                    this.rectangleDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    this.isDrawing = false;
                    this.render();
                    break;
                case CanvasDirectivesEnum.canvas_polygon:
                    if(this.polygonDrawer.isNearStartPoint(mouseCoordinates)) {
                        this.polygonDrawer.addPoint(this.start);
                        this.polygonDrawer.saveFromCoordinates(...this.polygonDrawer.getPoints());
                        this.render();
                        this.isDrawing = false;
                    } else {
                        this.polygonDrawer.addPoint(mouseCoordinates);
                    }
                    break;
            }

        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        let mouseCoordinates = {x: event.offsetX, y: event.offsetY};

        // Select the potentially hovering element
        let isDraggingPoint = this.selectElement(mouseCoordinates);


        // if an element is selected, initialize the initial held point
        if (isDraggingPoint) {
            this.heldPoint = mouseCoordinates;
            this.render(); // re-render the selected element
            this.isPointHeld = true;
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;

        let hovering = this.checkIfHovering(mouseCoordinates);

        if (hovering) {
            this.renderer.setStyle(this.element, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(this.element, 'cursor', 'default');
        }

        // Draw the element as the mouse moves
        if (this.isDrawing) {

            this.render();

            switch (this.imageProvider.selectedCanvasDirective){
                case CanvasDirectivesEnum.canvas_line:
                    this.lineDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case CanvasDirectivesEnum.canvas_rect:
                    this.rectangleDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case CanvasDirectivesEnum.canvas_polygon:
                    this.polygonDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
            }
        }

        // if the user is not drawing but instead is holding a point, then move the point
        else if (this.isPointHeld) {
            Drawer.moveSelectedElement(this.heldPoint, mouseCoordinates);
            this.render();
        }
    }

    /**
     * Checks if there is an element under the mouse cursor
     * @param mouseCoordinates
     * @returns {boolean}
     */
    checkIfHovering(mouseCoordinates): boolean {
        return this.lineDrawer.isHovering(mouseCoordinates) ||
            this.rectangleDrawer.isHovering(mouseCoordinates) ||
            this.polygonDrawer.isHovering(mouseCoordinates);
    }

    /**
     * If there is an element under the cursor, selects that element.
     * @param mouseCoordinates
     * @returns {boolean}
     */
    selectElement(mouseCoordinates): boolean {
        return this.lineDrawer.selectElement(mouseCoordinates) ||
            this.rectangleDrawer.selectElement(mouseCoordinates) ||
            this.polygonDrawer.selectElement(mouseCoordinates);
    }

}
