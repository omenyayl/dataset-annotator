import {Component, HostListener} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {ImageObject} from '../../objects/image-object';
import {ImageProvider} from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";
import {platform} from 'process';
import { DomSanitizer } from "@angular/platform-browser";


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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private sanitizer: DomSanitizer) {
        super();
        this.item = navParams.data;

        const currentImagePath = path.join(fileProvider.selectedFolder, this.item);
        this.imageProvider.selectedCanvasDirective = this.canvasDirectives.canvas_line;
        this.imageProvider.initImage(currentImagePath as string);
    }

    /**
     * Obtains the absolute local source of the selected image.
     * @returns {string}
     */
    getImageSrc(): string {
        let imgPath = path.join(this.fileProvider.selectedFolder, this.item);
        if (platform == 'win32'){
            return `file:///${imgPath}`;
        } else {
            return imgPath;
        }
    }

    getSelectedCanvasDirective(): string {
        return this.imageProvider.selectedCanvasDirective;
    }

    getCurrentImage(): ImageObject {
        return this.imageProvider.currentImage;
    }

    selectCanvasDirective(directiveName: CanvasDirectivesEnum){
        this.imageProvider.selectedCanvasDirective = directiveName;
    }

    @HostListener('window:keydown.q', ['$event'])
    hotkeySetCanvasDirectiveLine() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_line);
    }

    @HostListener('window:keydown.w', ['$event'])
    hotkeySetCanvasDirectiveRectangle() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_rect);

    }

    @HostListener('window:keydown.e', ['$event'])
    hotkeySetCanvasDirectivePolygon() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_polygon);
    }
}
