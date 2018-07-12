import {Component, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {Events} from "ionic-angular";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

@Component({
    selector: "inplace-input",
    templateUrl: "inplace-input.html",
})
export class InplaceInputComponent {
    @Input() value: string;
    @Input() id: string;
    newValue: string;
    @Output() valueChange = new EventEmitter<string>();
    editing: boolean;
    idProvided: boolean;

    constructor(public events: Events){
        this.idProvided = false;
    }

    ngOnInit() {
        this.idProvided = this.id != undefined;
    }

    ngOnChanges(): void {
        this.newValue = this.value;
    }

    startEditing(): void {
        this.editing = true;
    }

    accept(): void {
        this.value = this.newValue;
        this.valueChange.emit(this.newValue);
        this.editing = false;
        this.events.publish('render-canvas');
    }

    cancel(): void {
        this.newValue = this.value;
        this.editing = false;
    }

    @HostListener('keydown', ['$event']) onEnterPressed(e) {
        if (e.keyCode === KEYCODE_ENTER) {
            this.accept();
        }
        else if (e.keyCode === KEYCODE_ESCAPE) {
            this.cancel();
        }
    }
}