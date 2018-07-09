import {Component, HostListener, ViewChild} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {_DetailPage} from '../_DetailPage';
import {FileProvider} from "../../providers/file/file";
import * as path from 'path';
import {ImageObject} from '../../objects/image-object';
import {ImageProvider} from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";
import {platform} from 'process';
import { HotkeyProvider } from '../../providers/hotkeys/hotkeys';
import { AnnotationObject } from '../../objects/annotation-object';
import {CanvasEditorDirective} from "../../directives/canvas-editor/canvas-editor";
import { DomSanitizer } from "@angular/platform-browser";

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
	currentTool = 0;
    @ViewChild(CanvasEditorDirective) canvasDirective;

    item: string = null;
    canvasDirectives = CanvasDirectivesEnum;
    sanitizer: DomSanitizer;

    constructor(public navParams: NavParams,
				public events: Events,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private hotkeyProvider: HotkeyProvider,
                sanitizer: DomSanitizer) {
        super();
        this.item = navParams.data;
        this.sanitizer = sanitizer;

        const currentImagePath = path.join(fileProvider.selectedFolder, this.item);

        // Setting default tool
        if (! this.imageProvider.selectedCanvasDirective) {
            this.imageProvider.selectedCanvasDirective = this.canvasDirectives.canvas_line;
        }

	  	this.imageProvider.initImage(currentImagePath as string);
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
		console.log("getting annotations...");
		let currentImage = this.imageProvider.currentImage;
	  	if(currentImage && this.imageProvider.annotations.hasOwnProperty(currentImage.src) && this.imageProvider.annotations[currentImage.src].hasOwnProperty('boxes') && this.imageProvider.annotations[currentImage.src].hasOwnProperty('lines')){
			console.log(this.imageProvider.annotations[currentImage.src].boxes);
		  	this.boxes = this.imageProvider.annotations[currentImage.src].boxes;
		  	this.lines = this.imageProvider.annotations[currentImage.src].lines;
		}else{
		  	this.imageProvider.annotations[currentImage.src] = new AnnotationObject;
			console.log(this.imageProvider.annotations[currentImage.src].boxes);
		  	this.boxes = this.imageProvider.annotations[currentImage.src].boxes;
		  	this.lines = this.imageProvider.annotations[currentImage.src].lines;
		}
	}

	itemSelected(itm){
	  	console.log(`${itm} <- selected`);
	  	let deleteElement = 0;
	  	switch(this.currentTool){
		  	case 0:
				console.log('line');
	  			deleteElement = this.lines.indexOf(itm);
				break;
			case 1:
				console.log('box');
	  			deleteElement = this.boxes.indexOf(itm);
				break;
			case 2:
				deleteElement = this.polys.indexOf(itm);
				break;
			default:
				console.log(`${this.currentTool}`);
		}
	  	if(deleteElement > -1 ){
			switch(this.currentTool){
				case 0:
					console.log('line');
		  			this.lines.splice(deleteElement, 1);
					break;
		  		case 1:
					console.log('box');
		  			this.boxes.splice(deleteElement, 1);
					break;
		  		case 2:	
		  			this.polys.splice(deleteElement, 1);
					break;
			}
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
		this.currentTool = 0;
    }

    hotkeySetCanvasDirectiveRectangle() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_rect);
		this.currentTool = 1;
    }

    hotkeySetCanvasDirectivePolygon() {
        this.selectCanvasDirective(this.canvasDirectives.canvas_polygon);
		this.currentTool = 2;
    }
}
