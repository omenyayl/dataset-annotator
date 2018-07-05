import {CoordinatesObject} from "../objects/CoordinatesObject";

export interface Drawable {
    saveFromCoordinates(...coordinates: CoordinatesObject[]);
    drawFromCoordinates(...coordinates: CoordinatesObject[]);
    isHovering(coordinates: CoordinatesObject);
    render();
}