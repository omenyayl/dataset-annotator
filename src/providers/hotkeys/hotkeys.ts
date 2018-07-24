import { BehaviorSubject } from 'rxjs';
import { HotkeyObject } from '../../objects/hotkey-object';
import {Injectable} from '@angular/core';

@Injectable()
export class HotkeyProvider {

    public hotkeys = new BehaviorSubject<HotkeyObject>({
        nextImage: "d",
        prevImage: "a",
        line: "q",
        rectangle: "w",
        polygon: "e",
        polyline: "r",
        autoLabel1: "1",
        autoLabel2: "2",
        autoLabel3: "3",
        autoLabel4: "4",
        autoLabel5: "5",
        autoLabel6: "6",
    });

    constructor() {
        let savedHotkeys = JSON.parse(localStorage.getItem('hotkeySettings'));

        if (savedHotkeys) {
        	for(let hotkey in this.hotkeys.getValue()) {
			  	if (! savedHotkeys[hotkey]){
        	        savedHotkeys[hotkey] = this.hotkeys.getValue()[hotkey];
        	    }
        	}
            this.hotkeys.next(savedHotkeys);
        }
    }

    update(hotkeys: HotkeyObject) {
        localStorage.setItem('hotkeySettings', JSON.stringify(hotkeys));
        this.hotkeys.next(hotkeys);
    }
}
