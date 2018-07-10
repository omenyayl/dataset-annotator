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
import { HotkeyProvider } from '../../providers/hotkeys/hotkeys';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { HotkeyObject } from '../../objects/hotkey-object';


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
    hotkeys: HotkeyObject;
    canvasDirectives = CanvasDirectivesEnum;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private sanitizer: DomSanitizer,
                private hotkeyProvider: HotkeyProvider,
                private hotkeyService: HotkeysService) {

        super();
        this.item = navParams.data;

        const currentImagePath = path.join(fileProvider.selectedFolder, this.item);

        // Setting default tool
        if (! this.imageProvider.selectedCanvasDirective) {
            this.imageProvider.selectedCanvasDirective = this.canvasDirectives.canvas_line;
        }

        this.imageProvider.initImage(currentImagePath as string);

        this.hotkeyProvider.hotkeys.subscribe(value => {
            this.updateHotkeys(value);
        })
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

    hotkeySetCanvasDirectiveLine() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_line);
    }

    hotkeySetCanvasDirectiveRectangle() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_rect);

    }

    hotkeySetCanvasDirectivePolygon() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_polygon);
    }

    updateHotkeys(hotkeys) {
        if(this.hotkeys !== undefined) {
            this.hotkeyService.remove(new Hotkey(this.hotkeys.line, null));
            this.hotkeyService.remove(new Hotkey(this.hotkeys.rectangle, null));
            this.hotkeyService.remove(new Hotkey(this.hotkeys.polygon, null));
        }

        this.hotkeys = hotkeys;
        this.hotkeyService.add(new Hotkey(this.hotkeys.line,
            (event: KeyboardEvent): boolean => {
                this.hotkeySetCanvasDirectiveLine();
                return false;
            }));
        this.hotkeyService.add(new Hotkey(this.hotkeys.rectangle,
            (event: KeyboardEvent): boolean => {
                this.hotkeySetCanvasDirectiveRectangle();
                return false;
            }));
        this.hotkeyService.add(new Hotkey(this.hotkeys.polygon,
            (event: KeyboardEvent): boolean => {
                this.hotkeySetCanvasDirectivePolygon();
                return false;
            }));
    }
}
