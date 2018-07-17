import {Rectangle, Line, Polygon, Polyline} from "../providers/annotations/annotations";

export class AnnotationObject{
    constructor(public src: string,
                public lines: Line[] = [],
                public rectangles: Rectangle[] = [],
                public polygons: Polygon[] = [],
                public polylines: Polyline[] = [],
                public action_id?: number){}
}
