import {Drawer} from "./drawer";
import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Polygon} from "../providers/annotations/annotations";
import {LineDrawer} from "./line-drawer";

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';
const POINT_RADIUS = 5;

export class PolygonDrawer extends Drawer{
    private polygons: Polygon[];

    private points: CoordinatesObject[] = [];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider){
        super(context, annotationsProvider);
        this.polygons = annotationsProvider.getPolygons();
    }

    drawFromCoordinates(start: CoordinatesObject, mouse: CoordinatesObject) {

        for (let i = 0; i < this.points.length; i++){
            if (this.points[i+1]) {
                this.drawCircle(this.points[i]);
                this.drawLine(this.points[i], this.points[i+1]);
            }
            else {
                this.drawCircle(this.points[i]);
                this.drawLine(this.points[i], mouse);
            }
        }


    }

    drawPolygon(polygon: Polygon) {
        let color = polygon === Drawer.getSelectedElement() ? SELECTED_COLOR : DEFAULT_COLOR;
        for (let i = 0; i < polygon.coordinates.length; i++){
            if (polygon.coordinates[i+1]) {
                this.drawCircle(polygon.coordinates[i], color);
                this.drawLine(polygon.coordinates[i], polygon.coordinates[i+1], color);
            }
        }
    }

    addPoint(point: CoordinatesObject){
        this.points.push(point);
    }

    isHovering(coordinates: CoordinatesObject) {
        for (let polygon of this.polygons.concat({coordinates: this.points} as Polygon)) {
            if (PolygonDrawer.isNearCoordinates(polygon, coordinates)) {
                return true;
            }
        }
        return false;
    }

    render() {
        for(let polygon of this.polygons){
            this.drawPolygon(polygon);
        }
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        if (coordinates.length > 3) {
            this.getAnnotationsProvider().addPolygon({
                coordinates: coordinates
            } as Polygon);
        }
        this.points = [];
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        for (let polygon of this.polygons) {
            if (PolygonDrawer.isNearCoordinates(polygon, coordinates)) {
                Drawer.setSelectedElement(polygon);
                return true;
            }
        }
        return false;
    }

    drawLine(start, end, color = DEFAULT_COLOR): void {
        super.getContext().beginPath();
        super.getContext().strokeStyle = color;
        super.getContext().moveTo(start.x, start.y);
        super.getContext().lineTo(end.x, end.y);
        super.getContext().stroke();

    }

    drawCircle(coordinates: CoordinatesObject, color = DEFAULT_COLOR){
        super.getContext().beginPath();
        super.getContext().fillStyle = color;
        super.getContext().arc(coordinates.x, coordinates.y, POINT_RADIUS, 0, 2 * Math.PI);
        super.getContext().fill();
        super.getContext().stroke();
    }

    static computeDistance(from: CoordinatesObject, to: CoordinatesObject){
        return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    }

    static isNearCoordinates(polygon: Polygon, coords: CoordinatesObject) {
        for (let point of polygon.coordinates) {
            if (PolygonDrawer.computeDistance(point, coords) < POINT_RADIUS) {
                return true;
            }
        }
        return false;
    }

    isNearStartPoint(mouse: CoordinatesObject): boolean{
        return this.points[0] && PolygonDrawer.computeDistance(this.points[0], mouse) < POINT_RADIUS;

    }

    getPoints() {
        return this.points;
    }

}