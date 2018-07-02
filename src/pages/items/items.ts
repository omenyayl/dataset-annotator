import {Component, HostListener} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';
import {NavProxyService} from '../../providers/nav-proxy/nav-proxy';
import {
    ItemPage
} from '../item/item';
import {_MasterPage} from "../_MasterPage";
import {FileProvider} from "../../providers/file/file";
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

    files: string[];
    filesLoading$: Observable<boolean>;
    selected: [string, number];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private navProxy: NavProxyService,
                private fileProvider: FileProvider) {
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

    @HostListener('window:keydown.a', ['$event'])
    nextItem($event) {
        if(this.selected[1] - 1 >= 0) {
            console.log(this.files[this.selected[1] - 1]);
        }
    }

    @HostListener('window:keydown.d', ['$event'])
    previousItem($event) {
        if(this.selected[1] + 1 < this.files.length) {
            console.log(this.files[this.selected[1] + 1]);
        }
    }
}
