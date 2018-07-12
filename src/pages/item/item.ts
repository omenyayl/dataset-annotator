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
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { HotkeyObject } from '../../objects/hotkey-object';
import { DomSanitizer } from "@angular/platform-browser";
import {ActionObject} from '../../objects/action-object';
import { AnnotationsProvider, Line, Rectangle, Polygon } from "../../providers/annotations/annotations";

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
	actions = [];

    item: string = null;
    hotkeys: HotkeyObject;
    canvasDirectives = CanvasDirectivesEnum;
    sanitizer: DomSanitizer;

    constructor(public navParams: NavParams,
				public events: Events,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private hotkeyProvider: HotkeyProvider,
                private hotkeyService: HotkeysService,
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

        this.hotkeyProvider.hotkeys.subscribe(value => {
            this.updateHotkeys(value);
        });

        this.imageProvider.initImage(currentImagePath as string, this.annotationsProvider);
        this.getCurrentAnnotations();

        this.hotkeyService.add(new Hotkey(["del", "backspace"],
            (event: KeyboardEvent): boolean => {
                this.deleteHotkey();
                return false;
            }));
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
		this.boxes = this.annotationsProvider.getRectangles();
		this.lines = this.annotationsProvider.getLines();
	  	this.polys = this.annotationsProvider.getPolygons();
	  	this.actions = this.annotationsProvider.getActions();
    }

    deleteHotkey() {
        this.itemDelete(AnnotationsProvider.selectedElement);
    }

	isSelected(itm){
		return (AnnotationsProvider.selectedElement === itm);
	}

	itemSelect(itm){
	  	AnnotationsProvider.selectedElement = itm;
		this.renderCanvas();
	}

	itemDelete(itm){
  	    let successfullyRemoved = false;
  	    if (itm instanceof Line) {
  	        successfullyRemoved = this.annotationsProvider.removeLine(itm);
        }
        else if(itm instanceof Rectangle) {
            successfullyRemoved = this.annotationsProvider.removeRectangle(itm);
        }
        else if(itm instanceof Polygon) {
            successfullyRemoved = this.annotationsProvider.removePolygon(itm);
        }

        if (successfullyRemoved) {
  	        this.renderCanvas();
        }

	}

  	actionAdd(){
		this.annotationsProvider.addAction(new ActionObject('New Action'));
	}

	actionDelete(itm){
		this.annotationsProvider.removeAction(itm);
	}

  	actionSelect(itm){
		this.annotationsProvider.selectAction(itm);
	}

	isSelectedAction(itm){
		return (AnnotationsProvider.selectedAction === itm);
	}

	renderCanvas() {
        this.events.publish('render-canvas');
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
