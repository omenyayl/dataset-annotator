import {Component} from '@angular/core';
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
    selected: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private navProxy: NavProxyService,
                private fileProvider: FileProvider) {
        super();
    }

    ngOnInit() {
        this.fileProvider.filesChange.pipe().subscribe((files) => {
            this.files = files;
        });
        this.filesLoading$ = this.fileProvider.filesLoading.pipe();
    }

    /**
     * Called when the user clicks on an item in the master section.
     * @param item
     */
    onItemSelected(item) {
        // Rather than using:
        //     this.navCtrl.push(...)
        // Use our proxy:
        this.selected = item;
        console.log(this.selected);
        this.navProxy.pushDetail(ItemPage, item);
    }

}
