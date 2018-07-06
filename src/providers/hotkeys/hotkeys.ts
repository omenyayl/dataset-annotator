import {Injectable, NgZone} from '@angular/core';

@Injectable()
export class HotkeyProvider {

    public hotkeys = {
        nextImage: "d",
        prevImage: "a"
    };

    constructor() {
    }
}
