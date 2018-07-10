import {Injectable, NgZone} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HotkeyObject } from '../../objects/hotkey-object';

@Injectable()
export class HotkeyProvider {

    public hotkeys = new BehaviorSubject<HotkeyObject>({
        nextImage: "d",
        prevImage: "a",
        line: "q",
        rectangle: "w",
        polygon: "e"
    });

    constructor() {
    }
}
