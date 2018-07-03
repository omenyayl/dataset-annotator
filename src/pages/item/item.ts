import {Component, HostListener} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {ImageObject} from '../../objects/image-object';
import {ImageProvider} from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";


@IonicPage()
@Component({
    selector: 'page-item',
    templateUrl: 'item.html',
})

/**
 * Details page that shows the item clicked in the master page.
 */
export class ItemPage extends _DetailPage {

    item: string = null;
    canvasDirectives = CanvasDirectivesEnum;
    selectedCanvasDirective: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider) {
        super();
        this.item = navParams.data;

        const currentImagePath = this.getImageSrc();
        this.imageProvider.initImage(currentImagePath as string);

        // Setting default directive for the canvas element
        this.selectedCanvasDirective = this.canvasDirectives.canvas_rect;
    }

    /**
     * Obtains the absolute local source of the selected image.
     * @returns {string}
     */
    getImageSrc(): string {
        return path.join(this.fileProvider.selectedFolder, this.item);
    }


    getCurrentImage(): ImageObject {
        return this.imageProvider.currentImage;
    }

    selectCanvasDirective(directiveName: CanvasDirectivesEnum){
        this.selectedCanvasDirective = directiveName as string;
    }

    @HostListener('window:keydown.l', ['$event'])
    hotkeySetCanvasDirectiveLine() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_line);
    }

    @HostListener('window:keydown.r', ['$event'])
    hotkeySetCanvasDirectiveRectangle() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_rect);

    }

    @HostListener('window:keydown.p', ['$event'])
    hotkeySetCanvasDirectivePolygon() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_polygon);
    }
}
