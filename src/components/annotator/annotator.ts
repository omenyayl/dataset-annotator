import {ImageProvider} from "../../providers/image/image";
import {Component, ElementRef, ViewChild, HostListener, Renderer2} from '@angular/core';
import { LineDrawer } from "../../drawers/line-drawer";
import {CanvasDirectivesEnum} from "../../enums/canvas-directives-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";
import { CoordinatesObject } from "../../objects/CoordinatesObject";

//EventListener for deletion
import { Events } from 'ionic-angular';
import {AnnotationsProvider} from "../../providers/annotations/annotations";
import {PolygonDrawer} from "../../drawers/polygon-drawer";
import {Drawer} from "../../drawers/drawer";

/**
 * Generated class for the AnnotatorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'annotator',
    templateUrl: 'annotator.html'
})
export class AnnotatorComponent {
    @ViewChild("visualization") visualization: ElementRef;
    @ViewChild('img') img: ElementRef;

    private context: CanvasRenderingContext2D;
    private imageElement: HTMLImageElement;

    src: string;
    imgWidth: number;
    imgHeight: number;

    private lineDrawer: LineDrawer;
    private rectangleDrawer: RectangleDrawer;
    private polygonDrawer: PolygonDrawer;
    private isDrawing: boolean;
    private isPointHeld: boolean;
    private heldPoint: CoordinatesObject;
    private start: CoordinatesObject;
    private renderer: Renderer2;

    constructor(private annotationsProvider: AnnotationsProvider,
                renderer: Renderer2,
                private events: Events,
                private imageProvider: ImageProvider) {
        let imageObj = imageProvider.currentImage;
        this.imgWidth = imageObj.width;
        this.imgHeight = imageObj.height;
        this.src = imageObj.src;
        this.renderer = renderer;
    }

    ngAfterViewInit() {
        this.context = this.visualization.nativeElement.getContext("2d");
        this.imageElement = this.img.nativeElement;
        // Initialize our drawing tools
        this.lineDrawer = new LineDrawer(this.context, this.annotationsProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, this.annotationsProvider);
        this.polygonDrawer = new PolygonDrawer(this.context, this.annotationsProvider);

        this.isDrawing = false; // for drawing
        this.isPointHeld = false; // for moving points

        this.subscribeToEvents();

        this.render();
    }

    afterLoading() {
        this.context.clearRect(0, 0, this.imgWidth, this.imgHeight);
        // this.context.drawImage(this.imageElement, 0, 0, this.imgWidth, this.imgHeight);
        this.render();
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
        this.context.clearRect(0, 0, this.imageElement.width, this.imageElement.height);
        // this.context.drawImage(this.imageElement, 0, 0, this.imgWidth, this.imgHeight);
        this.lineDrawer.render();
        this.rectangleDrawer.render();
        this.polygonDrawer.render();
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

        // Select the potentially hovering imageElement
        let isDraggingPoint = this.selectElement(mouseCoordinates);


        // if an imageElement is selected, initialize the initial held point
        if (isDraggingPoint) {
            this.heldPoint = mouseCoordinates;
            this.render(); // re-render the selected imageElement
            this.isPointHeld = true;
        }
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        let mouseCoordinates = {x: event.offsetX, y: event.offsetY} as CoordinatesObject;

        let hovering = this.checkIfHovering(mouseCoordinates);
        if (hovering) {
            this.renderer.setStyle(this.visualization.nativeElement, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(this.visualization.nativeElement, 'cursor', 'default');
        }

        // Draw the imageElement as the mouse moves
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
     * Checks if there is an imageElement under the mouse cursor
     * @param mouseCoordinates
     * @returns {boolean}
     */
    checkIfHovering(mouseCoordinates): boolean {
        return this.lineDrawer.isHovering(mouseCoordinates) ||
            this.rectangleDrawer.isHovering(mouseCoordinates) ||
            this.polygonDrawer.isHovering(mouseCoordinates);
    }

    /**
     * If there is an imageElement under the cursor, selects that imageElement.
     * @param mouseCoordinates
     * @returns {boolean}
     */
    selectElement(mouseCoordinates): boolean {
        return this.lineDrawer.selectElement(mouseCoordinates) ||
            this.rectangleDrawer.selectElement(mouseCoordinates) ||
            this.polygonDrawer.selectElement(mouseCoordinates);
    }

}
