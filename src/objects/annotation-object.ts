import {Rectangle, Line, Polygon} from "../providers/annotations/annotations";

export class AnnotationObject{
    constructor(public src: string,
                public lines: Line[] = [],
                public rectangles: Rectangle[] = [],
                public polygons: Polygon[] = []){}
}
