import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HotkeyProvider} from '../../providers/hotkeys/hotkeys';
import {NavProxyService} from '../../providers/nav-proxy/nav-proxy';

@IonicPage()
@Component({
    selector: 'page-hotkeys',
    templateUrl: 'hotkeys.html',
})
export class HotkeysPage {

    private hotkeys: FormGroup;
    private inputs: string[];
    private duplicates = {
        nextImage: [],
        prevImage: [],
        line: [],
        rectangle: [],
        polygon: [],
        polyline: []
    };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private navProxy: NavProxyService,
                private hotkeyProvider: HotkeyProvider) {

        this.hotkeyProvider.hotkeys.subscribe(value => {
            this.hotkeys = this.formBuilder.group({
                nextImage: [value.nextImage],
                prevImage: [value.prevImage],
                line: [value.line],
                rectangle: [value.rectangle],
                polygon: [value.polygon],
                polyline: [value.polyline]
            }, {
                validator: this.duplicateHotkeyValidator.bind(this)
            });
        });

        this.inputs = [];
    }

    updateHotkeys() {
        this.hotkeyProvider.update(this.hotkeys.value);
        this.navProxy.popMaster(HotkeysPage);
    }

    markInput($event) {
        // Only mark inputs that are not Shift and are not currently marked.
        if ($event.key !== "Shift" &&
            this.inputs !== undefined && this.inputs.indexOf($event.key) == -1) {

            if ($event.key !== "Control" && $event.ctrlKey == true
                && this.inputs.indexOf("Control") == -1) {
                this.inputs.push("Control");
            }

            if ($event.key !== "Alt" && $event.altKey == true
                && this.inputs.indexOf("Alt") == -1) {
                this.inputs.push("Alt");
            }

            this.inputs.push($event.key);
        }
    }

    saveCompositeInput($event, name) {
        if (this.inputs !== undefined && this.inputs.length !== 0) {
            const fc = this.hotkeys.controls[name] as FormControl;
            fc.setValue(this.cleanInputString(this.inputs.join("+")));

            this.inputs = [];

            $event.target.select();
        }
    }

    cleanInputString(str) {
        return str.replace("Control", "ctrl")
            .replace("Alt", "alt")
            .replace("ArrowUp", "up")
            .replace("ArrowDown", "down")
            .replace("ArrowLeft", "left")
            .replace("ArrowRight", "right")
    }

    duplicateHotkeyValidator(control: FormControl): { [key: string]: any } | null {
        let keys = Object.keys(control.value);
        let duplicate = false;
        this.duplicates = {
            nextImage: [],
            prevImage: [],
            line: [],
            rectangle: [],
            polygon: [],
            polyline: []
        };

        for (let i = 0; i < keys.length; i++) {
            for (let j = i + 1; j < keys.length; j++) {
                if (control.value[keys[i]] === control.value[keys[j]]) {
                    duplicate = true;
                    this.duplicates[keys[i]].push(keys[j]);
                    this.duplicates[keys[j]].push(keys[i]);
                }
            }
        }

        return duplicate ? {'duplicateHotkey': true} : null;
    }
}
