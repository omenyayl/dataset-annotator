import {Box, Line, Polygon} from "../providers/annotations/annotations";

export class AnnotationObject{
    constructor(public src: string,
                public lines: Line[] = [],
                public boxes: Box[] = [],
	  			public polygons: Polygon[] = [],
	  			public _id: number = -1){}
}
