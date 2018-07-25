import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {HotkeyProvider} from "../../providers/hotkeys/hotkeys";

/**
 * Page that deals with hotkeys that automatically label the selected annotation
 */

@IonicPage()
@Component({
    selector: 'page-auto-label',
    templateUrl: 'auto-label.html',
})
export class AutoLabelPage {

    public labels: string[] = [];

    constructor(private hotkeyProvider: HotkeyProvider) {
    }

    deleteClassLabel(i: number) {
        if (i != -1) {
            this.hotkeyProvider.removeHotkeyLabel((i+1).toString());
            this.labels[i] = '';
        }
    }

    valueChanged(i: number) {
        if (this.labels[i].length > 0) {
            this.hotkeyProvider.updateHotkeyLabel((i+1).toString());
        }
    }

    clearLabels() {
        for (let i = 0; i < this.labels.length; i ++) {
            this.deleteClassLabel(i);
        }
    }

    ionViewDidLoad() {
        this.hotkeyProvider.initHotkeyLabels();
        this.labels = this.hotkeyProvider.getHotkeyLabels();
    }

    ionViewWillLeave() {
        this.hotkeyProvider.saveHotkeyLabels();
    }

}
