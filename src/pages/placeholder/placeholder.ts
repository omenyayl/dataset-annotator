import {Component} from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams
} from 'ionic-angular';
import {HelpPage} from "../help/help";

@IonicPage()
@Component({
    selector: 'page-placeholder',
    templateUrl: 'placeholder.html',
})

/**
 * This page is shown when there are no items in the Master page
 */
export class PlaceholderPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    openHelpPage() {
        this.navCtrl.push(HelpPage)
            .catch((e) => {
                console.error('Caught error at PlacehorderPage.openHelpPage()');
                console.error(e);
            });
    }

}
