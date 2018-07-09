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
import { AnnotationObject } from '../../objects/annotation-object';

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

    item: string = null;
    canvasDirectives = CanvasDirectivesEnum;

    constructor(public navCtrl: NavController,
	  			public navParams: NavParams,
				public events: Events,
                private fileProvider: FileProvider,
                private imageProvider: ImageProvider,
                private sanitizer: DomSanitizer,
                private hotkeyProvider: HotkeyProvider) {
        super();
	 	this.item = navParams.data;

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
	  	//WIP
	  	let deleteElement = this.boxes.indexOf(itm);
	  	if(deleteElement > -1 ){
		  	this.boxes.splice(deleteElement, 1);
			this.events.publish('deleteItem');
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
