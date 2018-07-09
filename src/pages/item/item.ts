import {Component, HostListener} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {ImageObject} from '../../objects/image-object';
import {ImageProvider} from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";
import {platform} from 'process';
import { HotkeyProvider } from '../../providers/hotkeys/hotkeys';
import { DomSanitizer } from "@angular/platform-browser";
import { AnnotationsProvider, Line, Box } from "../../providers/annotations/annotations";

//EventListener for deletion
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-item',
    templateUrl: 'item.html',
})

/**
 * Details page that shows the item clicked in the master page.
 */
export class ItemPage extends _DetailPage {

	boxes = [];
	lines = [];
  	polys = [];

    item: string = null;
    canvasDirectives = CanvasDirectivesEnum;
    sanitizer: DomSanitizer;

    constructor(public navParams: NavParams,
				public events: Events,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private hotkeyProvider: HotkeyProvider,
                private annotationsProvider: AnnotationsProvider,
                sanitizer: DomSanitizer) {
        super();
        this.item = navParams.data;
        this.sanitizer = sanitizer;

        const currentImagePath = path.join(fileProvider.selectedFolder, this.item);

        // Setting default tool
        if (! this.imageProvider.selectedCanvasDirective) {
            this.imageProvider.selectedCanvasDirective = this.canvasDirectives.canvas_line;
        }

	  	this.imageProvider.initImage(currentImagePath as string, this.annotationsProvider);
		this.getCurrentAnnotations();
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

  	/**
	 * Gets the annotations for the current image
	 * and puts them in: dummy
	 */
  	getCurrentAnnotations(){
	  	//let allAnnotations = [];
		this.boxes = this.annotationsProvider.getBoxes();
		this.lines = this.annotationsProvider.getLines();
	}

	itemSelected(itm){
  	    let successfullyRemoved = false;
  	    switch(this.getSelectedCanvasDirective()) {
            case CanvasDirectivesEnum.canvas_line:
                successfullyRemoved = this.annotationsProvider.removeLine(itm as Line);
                break;
            case CanvasDirectivesEnum.canvas_rect:
                successfullyRemoved = this.annotationsProvider.removeBox(itm as Box);
                break;
        }

        if (successfullyRemoved) {
            this.events.publish('render-canvas');
        }

	}

    selectCanvasDirective(directiveName: CanvasDirectivesEnum){
        this.imageProvider.selectedCanvasDirective = directiveName;
    }

    @HostListener('window:keydown', ['$event'])
    doAction($event) {
        if($event.key === this.hotkeyProvider.hotkeys.line) {
            this.hotkeySetCanvasDirectiveLine();
        }
        else if($event.key === this.hotkeyProvider.hotkeys.rectangle) {
            this.hotkeySetCanvasDirectiveRectangle();
        }
        else if($event.key === this.hotkeyProvider.hotkeys.polygon) {
            this.hotkeySetCanvasDirectivePolygon();
        }
    }

  	hotkeySetCanvasDirectiveLine() {
		console.log("Line!");
	  	this.selectCanvasDirective(this.canvasDirectives.canvas_line);
    }

    hotkeySetCanvasDirectiveRectangle() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_rect);
    }

    hotkeySetCanvasDirectivePolygon() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_polygon);
    }
}
