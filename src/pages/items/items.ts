import {Component, ViewChild} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    Content
} from 'ionic-angular';
import {NavProxyService} from '../../providers/nav-proxy/nav-proxy';
import {_MasterPage} from "../_MasterPage";
import {FileProvider} from "../../providers/file/file";
import {HotkeyProvider} from "../../providers/hotkeys/hotkeys";
import {Observable} from "rxjs/Observable";
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { HotkeyObject } from '../../objects/hotkey-object';

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
    hotkeys: HotkeyObject;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private navProxy: NavProxyService,
                private fileProvider: FileProvider,
                private hotkeyProvider: HotkeyProvider,
                private hotkeyService: HotkeysService) {
        super();

        this.hotkeyProvider.hotkeys.subscribe(value => {
            this.updateHotkeys(value);
        })
    }

    ngOnInit() {
        this.filesLoading$ = this.fileProvider.filesLoading.pipe();
        this.fileProvider.filesChange.pipe().subscribe((files) => {
            this.files = files;
            this.selected = [this.files[0], 0];
        });
    }

    /**
     * Called when the user clicks on an item in the master section.
     * @param item: string
     * @param index: number
     */
    onItemSelected(item: string, index: number) {
        this.selected = [item, index];
        this.navProxy.selectedItem.next(this.selected[0]);
    }

    previousItem() {

        let newIndex = this.selected[1] - 1;
        if(this.files !== undefined && newIndex >= 0) {
            this.onItemSelected(this.files[newIndex], newIndex);

            let yOffset = document.getElementById(`${newIndex}`).offsetTop;
            this.content.scrollTo(0, yOffset, 1);
        }
    }

    nextItem() {
        let newIndex = this.selected[1] + 1;
        if(this.files && newIndex < this.files.length) {
            this.onItemSelected(this.files[newIndex], newIndex);

            let yOffset = document.getElementById(`${newIndex}`).offsetTop;
            this.content.scrollTo(0, yOffset, 1);
        }
    }

    updateHotkeys(hotkeys) {
        if(this.hotkeys !== undefined) {
            this.hotkeyService.add(new Hotkey(this.hotkeys.nextImage, (): boolean =>{ return false }));
            this.hotkeyService.add(new Hotkey(this.hotkeys.prevImage, (): boolean =>{ return false }));
        }

        this.hotkeys = hotkeys;
        this.hotkeyService.add(new Hotkey(this.hotkeys.nextImage,
            (): boolean => {
                this.nextItem();
                return false;
            }));
        this.hotkeyService.add(new Hotkey(this.hotkeys.prevImage,
            (): boolean => {
                this.previousItem();
                return false;
            }));
    }
}
