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
    selector: 'generic-input',
    templateUrl: 'generic-input.html'
})
export class GenericInputComponent {
    @Input() labels: string[];
    @Input() idx: number;
    private newTxt: string;
    @Output() txtChange = new EventEmitter<string>();

    constructor(private renderer: Renderer2){
    }

    ngOnChanges(): void {
        this.newTxt = this.labels[this.idx];
    }

    accept(): void {
        this.labels[this.idx] = this.newTxt;
        this.txtChange.emit(this.newTxt);
    }

    cancel(): void {
        this.newTxt = this.labels[this.idx];
    }

    @HostListener('keydown', ['$event']) onEnterPressed(e) {
        if (e.keyCode === KEYCODE_ENTER) {
            this.accept();
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
