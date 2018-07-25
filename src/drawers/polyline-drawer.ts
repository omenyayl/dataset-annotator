import {Drawer} from "./drawer";
import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Polyline} from "../providers/annotations/annotations";

export class PolylineDrawer extends Drawer{
    private polylines: Polyline[];

    private points: CoordinatesObject[] = []; // currently drawing polyline's points

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider){
        super(context, annotationsProvider);
        this.polylines = annotationsProvider.getPolylines();
    }

    drawFromCoordinates(start: CoordinatesObject, mouse: CoordinatesObject) {

        for (let i = 0; i < this.points.length; i++){
            if (this.points[i+1]) {
                super.drawCircle(this.points[i]);
                super.drawLine(this.points[i], this.points[i+1]);
            }
            else {
                super.drawCircle(this.points[i]);
                super.drawLine(this.points[i], mouse);
            }
        }


    }

    drawPolyline(polyline: Polyline) {
        let color = polyline === Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;

        for (let i = 0; i < polyline.coordinates.length; i++){
            if (polyline.coordinates[i+1]) {
                super.drawCircle(polyline.coordinates[i], color);
                super.drawLine(polyline.coordinates[i], polyline.coordinates[i+1], color);
            } else {
                super.drawCircle(polyline.coordinates[i], color);
            }
        }
        super.drawText(polyline.label, new CoordinatesObject(
            polyline.coordinates[0].x,
            polyline.coordinates[0].y - 10
        ), color);
    }

    addPoint(point: CoordinatesObject){
        this.points.push(point);
    }

    isHovering(coordinates: CoordinatesObject) {
        for (let polyline of this.polylines.concat(new Polyline(this.points))) {
            if (PolylineDrawer.isNearCoordinates(polyline, coordinates)) {
                return true;
            }
        }
        return false;
    }

    render() {
        for(let polyline of this.polylines){
            this.drawPolyline(polyline);
        }
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        if (coordinates.length > 1) {
            let polylineToAdd = new Polyline(
                coordinates,
                AnnotationsProvider.lastLabel ? AnnotationsProvider.lastLabel : 'unnamed'
            );
            this.getAnnotationsProvider().addPolyline(polylineToAdd);
            this.getAnnotationsProvider().selectElement(polylineToAdd);
        }
        this.points = [];
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        for (let polyline of this.polylines) {
            if (PolylineDrawer.isNearCoordinates(polyline, coordinates)) {
                this.setSelectedElement(polyline);
                return true;
            }
        }
        return false;
    }

    static isNearCoordinates(polyline: Polyline, coords: CoordinatesObject) {
        for (let point of polyline.coordinates) {
            if (Drawer.computeDistance(point, coords) < Drawer.POINT_RADIUS) {
                return true;
            }
        }
        return false;
    }

    isNearStartPoint(mouse: CoordinatesObject): boolean{
        return this.points[0] && Drawer.computeDistance(this.points[0], mouse) <= Drawer.POINT_RADIUS;

    }

    getPoints() {
        return this.points;
    }



}