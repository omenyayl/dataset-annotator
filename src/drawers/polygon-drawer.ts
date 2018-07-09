import {Drawer} from "./drawer";
import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Polygon} from "../providers/annotations/annotations";

export class PolygonDrawer extends Drawer{
    private polygons: Polygon[];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider){
        super(context, annotationsProvider);
    }

    drawFromCoordinates(...coordinates: CoordinatesObject[]) {

    }

    isHovering(coordinates: CoordinatesObject) {
    }

    render() {
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        return false;
    }

}