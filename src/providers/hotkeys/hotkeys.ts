import {Injectable} from '@angular/core';

@Injectable()
export class HotkeyProvider {

    public hotkeys = {
        nextImage: "d",
        prevImage: "a",
        line: "q",
        rectangle: "w",
        polygon: "e"
    };

    constructor() {
    }
}
