import {Component, HostListener, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {ImageObject} from '../../objects/image-object';
import {ImageProvider} from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";
import {platform} from 'process';


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
                private ngZone: NgZone) {
        super();
        this.item = navParams.data;

        const currentImagePath = path.join(fileProvider.selectedFolder, this.item);
        this.imageProvider.initImage(currentImagePath as string);

        // Setting default directive for the canvas element
        if (!imageProvider.selectedCanvasDirective) {
            this.selectCanvasDirective(CanvasDirectivesEnum.canvas_line);
        }
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


    getCurrentImage(): ImageObject {
        return this.imageProvider.currentImage;
    }

    selectCanvasDirective(directiveName: CanvasDirectivesEnum){
        this.ngZone.run(() => {
            this.imageProvider.selectedCanvasDirective = directiveName;
        });
    }

    getSelectedCanvasDirective(): CanvasDirectivesEnum {
        return this.imageProvider.selectedCanvasDirective;
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
