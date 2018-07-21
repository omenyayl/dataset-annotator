import {Rectangle, Line, Polygon, Polyline} from "../providers/annotations/annotations";


export class AnnotationObject{
    /**
     * Object that holds annotation for a given image name
     * @param {string} src
     * @param {Line[]} lines
     * @param {Rectangle[]} rectangles
     * @param {Polygon[]} polygons
     * @param {Polyline[]} polylines
     * @param {number} action_id
     */
    constructor(public src: string,
                public lines: Line[] = [],
                public rectangles: Rectangle[] = [],
                public polygons: Polygon[] = [],
                public polylines: Polyline[] = [],
                public action_id?: number){}
}
