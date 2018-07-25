import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Line} from "../providers/annotations/annotations";


export class LineDrawer extends Drawer{
    private lines: Line[] = [];

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider) {
        super(context, annotationsProvider);
        this.lines = this.getAnnotationsProvider().getLines(); // Reference!
    }

    saveFromCoordinates(start: CoordinatesObject, end: CoordinatesObject) {
        let line = LineDrawer.getLineFromCoordinates(start, end);
        this.saveLine(line)
    }

    drawFromCoordinates(start: CoordinatesObject, end: CoordinatesObject){
        let color = LineDrawer.getLineFromCoordinates(start, end) == Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
        super.drawLine(start, end, color);
        super.drawCircle(start, color);
        super.drawCircle(end, color);
    }

    saveLine(line: Line){
        if (Drawer.computeDistance(line.start, line.end) > Drawer.POINT_RADIUS * 2){
            this.getAnnotationsProvider().addLine(line);
            this.getAnnotationsProvider().selectElement(line);
            let color = line == Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
            super.drawLine(line.start, line.end, color);
        }
    }

    render(){
        this.renderLines(this.lines);
    }

    renderLines(lines: Line[]){
        for(let line of lines){
            let color = line == Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
            super.drawText(line.label, new CoordinatesObject(
                (line.start.x + line.end.x) / 2,
                (line.start.y + line.end.y) / 2 - 10
            ), color);
            super.drawLine(line.start, line.end, color);
            super.drawCircle(line.start, color);
            super.drawCircle(line.end, color);
        }
    }

    static isNearCoordinates(line: Line, coordinates: CoordinatesObject): boolean{
        let distanceFromPoint1 = Drawer.computeDistance(line.start, coordinates);
        let distanceFromPoint2 = Drawer.computeDistance(line.end, coordinates);
        return distanceFromPoint1 <= Drawer.POINT_RADIUS || distanceFromPoint2 <= Drawer.POINT_RADIUS;
    }

    isHovering(coordinates: CoordinatesObject): boolean {
        let hoveringOnLine = false;
        for(let line of this.lines){
            if (LineDrawer.isNearCoordinates(line, coordinates)){
                hoveringOnLine = true;
            }
        }
        return hoveringOnLine;
    }


    static getLineFromCoordinates(start: CoordinatesObject, end: CoordinatesObject): Line {
        return new Line(start, end, AnnotationsProvider.lastLabel ? AnnotationsProvider.lastLabel : 'unnamed');
    }

    selectElement(location: CoordinatesObject) : boolean {
        for (let line of this.lines) {
            if (LineDrawer.isNearCoordinates(line, location)) {
                this.setSelectedElement(line);
                return true;
            }
        }
        return false;
    }


}
