import {ImageProvider} from "../../providers/image/image";
import {Component, ElementRef, ViewChild, HostListener, Renderer2} from '@angular/core';
import { LineDrawer } from "../../drawers/line-drawer";
import {DrawerNamesEnum} from "../../enums/drawer-names-enum";
import {RectangleDrawer} from "../../drawers/rectangle-drawer";
import { CoordinatesObject } from "../../objects/CoordinatesObject";
import {DomSanitizer} from "@angular/platform-browser";
import * as path from 'path';

//EventListener for deletion
import { Events } from 'ionic-angular';
import {AnnotationsProvider} from "../../providers/annotations/annotations";
import {PolygonDrawer} from "../../drawers/polygon-drawer";
import {Drawer} from "../../drawers/drawer";
import {FileProvider} from "../../providers/file/file";
import {PolylineDrawer} from "../../drawers/polyline-drawer";
// import * as sharp from 'sharp';

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
    @ViewChild("drawing") drawing: ElementRef;
    @ViewChild('visualization') visualization: ElementRef;

    private context: CanvasRenderingContext2D;
    private imageContext: CanvasRenderingContext2D;
    public logText: string;


    private lineDrawer: LineDrawer;
    private rectangleDrawer: RectangleDrawer;
    private polygonDrawer: PolygonDrawer;
    private polylineDrawer: PolylineDrawer;

    private isDrawing: boolean;
    private isPointHeld: boolean;
    private heldPoint: CoordinatesObject;
    private start: CoordinatesObject;
    private renderer: Renderer2;
    sanitizer: DomSanitizer;

    imgWidth: number;
    imgHeight: number;

    constructor(private annotationsProvider: AnnotationsProvider,
                renderer: Renderer2,
                sanitizer: DomSanitizer,
                private events: Events,
                private imageProvider: ImageProvider,
                private fileProvider: FileProvider) {
        this.renderer = renderer;
        this.sanitizer = sanitizer;
    }

    initImage(context: CanvasRenderingContext2D, src, width, height, scale){
        let img = new Image();
        img.width = width;
        img.height = height;
        img.src = src;
        img.onload = () => {
            context.drawImage(img, 0, 0, width, height);
            img.remove();
            img = null;
            this.render();
        };
    }

    onImageChanged() {
        let imageObj = this.imageProvider.currentImage;
        if (imageObj) {
            this.imgWidth = imageObj.width;
            this.imgHeight = imageObj.height;
            this.annotationsProvider.initAnnotations(imageObj.src, imageObj.scale);
            this.initAnnotator(imageObj.width,
                imageObj.height,
                path.join(this.fileProvider.selectedFolder, imageObj.src),
                imageObj.scale);
        }
    }

    initAnnotator(width: number, height: number, src: string, scale: number) {
        this.initImage(this.imageContext, src, width, height, scale);
        // Initialize our drawing tools
        this.lineDrawer = new LineDrawer(this.context, this.annotationsProvider);
        this.rectangleDrawer = new RectangleDrawer(this.context, this.annotationsProvider);
        this.polygonDrawer = new PolygonDrawer(this.context, this.annotationsProvider);
        this.polylineDrawer = new PolylineDrawer(this.context, this.annotationsProvider);
        this.isDrawing = false; // for drawing
        this.isPointHeld = false; // for moving points
    }

    ngAfterViewInit() {
        this.context = this.drawing.nativeElement.getContext('2d');
        this.imageContext = this.visualization.nativeElement.getContext('2d');
        this.subscribeToEvents();
        this.onImageChanged();
    }

    /**
     * Subscriber that re-renders the canvas.
     */
    subscribeToEvents() {
        this.events.subscribe('render-canvas', () => {
            this.onImageChanged();
        });
    }

    render() {
        this.context.clearRect(0, 0, this.imgWidth, this.imgHeight);
        this.lineDrawer.render();
        this.rectangleDrawer.render();
        this.polygonDrawer.render();
        this.polylineDrawer.render();
    }

    // Handles right click for ending the polyline draw
    @HostListener('contextmenu', ['$event']) onRightClick(event) {
        if (this.imageProvider.selectedCanvasDirective === DrawerNamesEnum.canvas_polyline){
            this.polylineDrawer.addPoint(new CoordinatesObject(event.offsetX, event.offsetY));
            this.polylineDrawer.saveFromCoordinates(...this.polylineDrawer.getPoints());
            this.render();
            this.finishDrawing();
        }
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

            // Adding the initial starting point to the polygon/polyline
            if (this.imageProvider.selectedCanvasDirective === DrawerNamesEnum.canvas_polygon) {
                this.logText = 'Click on the starting point to finish drawing';
                this.polygonDrawer.addPoint(this.start);
            }
            else if (this.imageProvider.selectedCanvasDirective === DrawerNamesEnum.canvas_polyline) {
                this.logText = 'Right click to finish drawing';
                this.polylineDrawer.addPoint(this.start);
            }

            this.render(); // re-render whatever was selected
        }


        // Save point when clicked the second time
        else {

            switch (this.imageProvider.selectedCanvasDirective){
                case DrawerNamesEnum.canvas_line:
                    this.lineDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    this.finishDrawing();
                    this.render();
                    break;
                case DrawerNamesEnum.canvas_rect:
                    this.rectangleDrawer.saveFromCoordinates(this.start, mouseCoordinates);
                    this.finishDrawing();
                    this.render();
                    break;
                case DrawerNamesEnum.canvas_polygon:
                    if(this.polygonDrawer.isNearStartPoint(mouseCoordinates)) {
                        this.polygonDrawer.addPoint(this.start);
                        this.polygonDrawer.saveFromCoordinates(...this.polygonDrawer.getPoints());
                        this.render();
                        this.finishDrawing();
                    } else {
                        this.polygonDrawer.addPoint(mouseCoordinates);
                    }
                    break;
                case DrawerNamesEnum.canvas_polyline:
                    this.polylineDrawer.addPoint(mouseCoordinates);
                    break;
            }

        }
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        if(this.isDrawing) return;

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
            this.renderer.setStyle(this.drawing.nativeElement, 'cursor', 'pointer');
        } else {
            this.renderer.setStyle(this.drawing.nativeElement, 'cursor', 'default');
        }

        // Draw the imageElement as the mouse moves
        if (this.isDrawing) {

            this.render();

            switch (this.imageProvider.selectedCanvasDirective){
                case DrawerNamesEnum.canvas_line:
                    this.lineDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case DrawerNamesEnum.canvas_rect:
                    this.rectangleDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case DrawerNamesEnum.canvas_polygon:
                    this.polygonDrawer.drawFromCoordinates(this.start, mouseCoordinates);
                    break;
                case DrawerNamesEnum.canvas_polyline:
                    this.polylineDrawer.drawFromCoordinates(this.start, mouseCoordinates);
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
            this.polygonDrawer.isHovering(mouseCoordinates) ||
            this.polylineDrawer.isHovering(mouseCoordinates);
    }

    /**
     * If there is an imageElement under the cursor, selects that imageElement.
     * @param mouseCoordinates
     * @returns {boolean}
     */
    selectElement(mouseCoordinates): boolean {
        return this.lineDrawer.selectElement(mouseCoordinates) ||
            this.rectangleDrawer.selectElement(mouseCoordinates) ||
            this.polygonDrawer.selectElement(mouseCoordinates) ||
            this.polylineDrawer.selectElement(mouseCoordinates);
    }

    logClear() {
        this.logText = '';
    }

    finishDrawing(){
        this.isDrawing = false;
        this.logClear();
    }

}
