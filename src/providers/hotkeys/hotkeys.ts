import { BehaviorSubject } from 'rxjs';
import { HotkeyObject } from '../../objects/hotkey-object';
import {Injectable} from '@angular/core';
import {Hotkey, HotkeysService} from "angular2-hotkeys";
import {AnnotationsProvider} from "../annotations/annotations";

const LABEL_HOTKEYS_COUNT = 9;
const LOCAL_STORAGE_HOTKEY_LABELS = 'autolabels';

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

    private labels: string[] = [];

    constructor(private hotkeyService: HotkeysService,
                private annotationsProvider: AnnotationsProvider) {
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

    removeHotkeyLabel(hotkey: string) {
        this.hotkeyService.add(new Hotkey(hotkey, (): boolean =>{ return false }));
    }

    updateHotkeyLabel(hotkey: string) {
        this.hotkeyService.add(new Hotkey(hotkey, (): boolean => {
            this.annotationsProvider.setLabelOnSelectedElement(this.labels[+hotkey-1]);
            return false;
        }));
    }

    public initHotkeyLabels() {
        let storedLabels = localStorage.getItem(LOCAL_STORAGE_HOTKEY_LABELS);
        if (storedLabels) {
            this.labels = JSON.parse(storedLabels);
            for (let i = 0; i < LABEL_HOTKEYS_COUNT; i++) {
                if (this.labels[i].length > 0) {
                    this.updateHotkeyLabel((i+1).toString());
                }
            }
        } else {
            this.labels = [];
            for(let i = 0; i < LABEL_HOTKEYS_COUNT; i++) {
                this.labels.push('');
            }
        }
    }

    public saveHotkeyLabels() {
        localStorage.setItem(LOCAL_STORAGE_HOTKEY_LABELS, JSON.stringify(this.labels));
    }

    public getHotkeyLabels() {
        return this.labels;
    }

    update(hotkeys: HotkeyObject) {
        console.log(hotkeys);
        localStorage.setItem('hotkeySettings', JSON.stringify(hotkeys));
        this.hotkeys.next(hotkeys);
    }
}
