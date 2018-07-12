import {Component, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {Events} from "ionic-angular";
import {AnnotationsProvider} from "../../providers/annotations/annotations";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

@Component({
    selector: "object-input",
    templateUrl: "object-input.html",
})
export class ObjectInputComponent {
    @Input() value: string;
    @Input() id: string;
    @Input() obj: Object;
    newValue: string;
    newId: string;
    @Output() valueChange = new EventEmitter<string>();
    @Output() idChange = new EventEmitter<string>();
    editing: boolean;
    idProvided: boolean;

    constructor(public events: Events){
    }

    ngOnInit() {
        console.log('Object: ');
        console.log(this.obj);
        this.editing = true;
        this.idProvided = this.id !== undefined;
    }
    ngOnChanges(): void {
        this.newValue = this.value;
        this.newId = this.id;
    }

    startEditing(): void {
        this.editing = true;
    }

    accept(): void {
        this.value = this.newValue;
        this.id = this.newId;
        this.valueChange.emit(this.newValue);
        this.idChange.emit(this.newId);
        this.editing = false;
        this.renderCanvas();
    }

    cancel(): void {
        this.newValue = this.value;
        this.newId = this.id;
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

    getId() {
        return this.id != undefined ? `${this.id}: ` : '';
    }

    onFocus() {
        if(this.obj) {
            AnnotationsProvider.selectedElement = this.obj;
            this.renderCanvas();
        }
    }

    renderCanvas() {
        this.events.publish('render-canvas');
    }
}