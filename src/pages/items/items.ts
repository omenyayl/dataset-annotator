import {Component, HostListener, ViewChild} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    Content
} from 'ionic-angular';
import {NavProxyService} from '../../providers/nav-proxy/nav-proxy';
import {
    ItemPage
} from '../item/item';
import {_MasterPage} from "../_MasterPage";
import {FileProvider} from "../../providers/file/file";
import {HotkeyProvider} from "../../providers/hotkeys/hotkeys";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
    selector: 'page-items',
    templateUrl: 'items.html',
})

/**
 * Master page that displays all of the items in the selected directory.
 */
export class ItemsPage extends _MasterPage {

    @ViewChild(Content) content: Content;
    files: string[];
    filesLoading$: Observable<boolean>;
    selected: [string, number];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private navProxy: NavProxyService,
                private fileProvider: FileProvider,
                private hotkeyProvider: HotkeyProvider) {
        super();
    }

    ngOnInit() {
        this.filesLoading$ = this.fileProvider.filesLoading.pipe();
        this.fileProvider.filesChange.pipe().subscribe((files) => {
            this.files = files;
        })
        this.selected = [null, -1];
    }

    /**
     * Called when the user clicks on an item in the master section.
     * @param item: string
     * @param index: number
     */
    onItemSelected(item, index) {
        // Rather than using:
        //     this.navCtrl.push(...)
        // Use our proxy:
        this.selected = [item, index];
        console.log(`file name: ${this.selected[0]} index: ${this.selected[1]}`);
        this.navProxy.pushDetail(ItemPage, item);
    }

    @HostListener('window:keydown', ['$event'])
    doAction($event) {
        if($event.key === this.hotkeyProvider.hotkeys.prevImage) {
            this.previousItem();
        }
        else if($event.key === this.hotkeyProvider.hotkeys.nextImage) {
            this.nextItem();
        }
    }

    previousItem() {
        let newIndex = this.selected[1] - 1;
        if(newIndex >= 0) {
            this.onItemSelected(this.files[newIndex], newIndex);

            let yOffset = document.getElementById(`${newIndex}`).offsetTop;
            this.content.scrollTo(0, yOffset, 1);
        }
    }

    nextItem() {
        let newIndex = this.selected[1] + 1;
        if(newIndex < this.files.length) {
            this.onItemSelected(this.files[newIndex], newIndex);

            let yOffset = document.getElementById(`${newIndex}`).offsetTop;
            this.content.scrollTo(0, yOffset, 1);
        }
    }
}
