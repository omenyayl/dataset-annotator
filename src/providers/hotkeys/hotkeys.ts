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
        polyline: "r"
    });

    constructor() {
        let savedHotkeys = JSON.parse(localStorage.getItem('hotkeySettings'));

        if (savedHotkeys != null) {
        	for(let hotkey in this.hotkeys.getValue()) {
			  	//if (! savedHotkeys[hotkey]){
        	    if (! savedHotkeys.hasOwnProperty(hotkey)){
        	        savedHotkeys[hotkey] = this.hotkeys.getValue()[hotkey];
        	    }
        	}
            this.hotkeys.next(savedHotkeys);
        }
    }

    update(hotkeys: HotkeyObject) {
        console.log(hotkeys);
        localStorage.setItem('hotkeySettings', JSON.stringify(hotkeys));
        this.hotkeys.next(hotkeys);
    }
}
