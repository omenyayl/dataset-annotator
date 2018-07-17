import {Component, EventEmitter, HostListener, Input, Output, Renderer2} from "@angular/core";

const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;
const KEYCODE_TAB = 9;
const KEYCODE_SHIFT = 16;


/**
 * Generated class for the ActionInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'action-input',
  templateUrl: 'action-input.html'
})
export class ActionInputComponent {
    @Input() value: string;
    @Input() id: string;
    @Input() obj: Object;
    newValue: string;
    newId: string;
    @Output() valueChange = new EventEmitter<string>();
    @Output() idChange = new EventEmitter<string>();
    editing: boolean;
    idProvided: boolean;

    constructor(private renderer: Renderer2){
    }

    ngOnInit() {
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

    onBlur(e: Event){
        this.accept();
        this.renderer.removeClass(e.srcElement, 'editing');
    }


}
