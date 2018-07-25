import {Component, EventEmitter, HostListener, Input, Output, Renderer2} from "@angular/core";
import {Events} from "ionic-angular";
import {AnnotationsProvider} from "../../providers/annotations/annotations";
import {ItemPage} from "../../pages/item/item";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;
const KEYCODE_TAB = 9;
const KEYCODE_SHIFT = 16;


@Component({
    selector: "object-input",
    templateUrl: "object-input.html",
})
export class ObjectInputComponent {
    @Input() value: string;
    @Input() id: string;
    @Input() obj: any;
    newValue: string;
    newId: string;
    @Output() valueChange = new EventEmitter<string>();
    @Output() idChange = new EventEmitter<string>();
    editing: boolean;
    idProvided: boolean;

    constructor(public events: Events,
                private renderer: Renderer2){
    }

    ngOnInit() {
        this.idProvided = this.id !== undefined;
        this.editing = false;
    }
    ngOnChanges(): void {
        this.newValue = this.value;
        this.newId = this.id;
    }

    accept(): void {
        this.value = this.newValue;
        this.id = this.newId;
        this.valueChange.emit(this.newValue);
        this.idChange.emit(this.newId);
        this.editing = false;
        AnnotationsProvider.lastLabel = this.value;
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
            e.target.blur();
            this.renderer.removeClass(e.srcElement, 'editing');
        }
        else if (e.keyCode === KEYCODE_ESCAPE) {
            this.cancel();
        }
        else if (e.keyCode !== KEYCODE_TAB && e.keyCode !== KEYCODE_SHIFT){
            this.renderer.addClass(e.srcElement, 'editing');
        }
    }

    onFocus() {
        if(this.obj) {
            AnnotationsProvider.selectedElement = this.obj;
            this.renderCanvas();
        }

    }

    onBlur(e: Event){
        this.accept();
        this.renderer.removeClass(e.srcElement, 'editing');
    }

    renderCanvas() {
        this.events.publish('render-canvas');
    }

    isSelected() {
        return ItemPage.isSelected(this.obj);
    }

}