import {CoordinatesObject} from "../objects/CoordinatesObject";
import {Drawer} from "./drawer";
import {AnnotationsProvider, Line} from "../providers/annotations/annotations";


const MIN_LINE_LENGTH = 10;
const POINT_RADIUS = 5;

const DEFAULT_COLOR = 'red';
const SELECTED_COLOR = 'yellow';

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
        let line = LineDrawer.getLineFromCoordinates(start, end);
        this.drawLine(line);
    }

    saveLine(line: Line){
        if (LineDrawer.computeLineLength(line) > MIN_LINE_LENGTH){
            this.getAnnotationsProvider().addLine(line);
            this.drawLine(line);
        }
    }

    drawLine(line: Line){
        let color = line == Drawer.getSelectedElement() ? SELECTED_COLOR : DEFAULT_COLOR;

        this.drawCircle(line.start.x, line.start.y, color);
        super.getContext().beginPath();
        super.getContext().moveTo(line.start.x, line.start.y);
        super.getContext().lineTo(line.end.x, line.end.y);
        super.getContext().strokeStyle = color;
        super.getContext().stroke();
        this.drawCircle(line.end.x, line.end.y, color);
    }

    drawCircle(x: number, y: number, color = DEFAULT_COLOR){
        super.getContext().beginPath();
        super.getContext().fillStyle = color;
        super.getContext().arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
        super.getContext().fill();
        super.getContext().stroke();
    }

    static computeLineLength(line: Line){
        return Math.sqrt(Math.pow(line.end.x - line.start.x, 2) + Math.pow(line.end.y - line.start.y, 2));
    }

    render(){
        this.renderLines(this.lines);
    }

    renderLines(lines: Line[]){
        for(let line of lines){
            this.drawLine(line);
        }
    }

    static isNearCoordinates(line: Line, coordinates: CoordinatesObject): boolean{
        let distanceFromPoint1 = LineDrawer.computeLineLength(new Line(
                new CoordinatesObject(line.start.x, line.start.y),
                new CoordinatesObject(coordinates.x, coordinates.y))
            );
        let distanceFromPoint2 = LineDrawer.computeLineLength(new Line(
            new CoordinatesObject(line.end.x, line.end.y),
            new CoordinatesObject(coordinates.x, coordinates.y)
        ));
        return distanceFromPoint1 <= POINT_RADIUS || distanceFromPoint2 <= POINT_RADIUS;
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
        return new Line(start, end);
    }

    selectElement(location: CoordinatesObject) : boolean {
        for (let line of this.lines) {
            if (LineDrawer.isNearCoordinates(line, location)) {
                Drawer.setSelectedElement(line);
                return true;
            }
        }
        return false;
    }


}
