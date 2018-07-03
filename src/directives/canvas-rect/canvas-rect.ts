import {Directive, ElementRef, HostListener} from '@angular/core';
import { ImageProvider } from "../../providers/image/image";
import { CanvasDirectivesEnum } from "../../enums/canvas-directives-enum";

let element: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let isDrawing: boolean;
let default_color = 'black';
let boxes = [];
let curBox = {x1: 0, y1: 0, x2: 0, y2: 0};
let selectedIndex = 0;
let i = 0;

@Directive({
		selector: `[${CanvasDirectivesEnum.canvas_rect}]` // Attribute selector
})
export class CanvasRectDirective {

    constructor(el: ElementRef, imageProvider: ImageProvider) {
        element = (<HTMLCanvasElement>el.nativeElement);
        context = element.getContext('2d');
	  	isDrawing = false;

	  	console.log("Getting new boxes in constructor");
	  	boxes = imageProvider.getBoxes();
	  	//imageProvider.setBoxes(imageProvider.currentImage, boxes);
    }

    ngOnInit() {
    }

	drawAllBoxes(): void {
		i = 0;
		for (let box of boxes) {
			if(i == selectedIndex){
				this.drawBox(box, 'yellow');
			}else{
					this.drawBox(box, 'red');
			}		
			i ++;
		}
	}


    drawLine(start, end, color = default_color): void {
        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();

    }

    drawBox(box, color = default_color): void {
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x1, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y1}, {x: box.x2, y: box.y1}, color);
        this.drawLine({x: box.x2, y: box.y1}, {x: box.x2, y: box.y2}, color);
        this.drawLine({x: box.x1, y: box.y2}, {x: box.x2, y: box.y2}, color);
    }

    @HostListener('mousedown', ['$event']) onMouseDown(event) {
        console.log("mousedown");
        curBox = {x1: event.offsetX, y1: event.offsetY, x2: -1, y2: -1};
        context.beginPath();
        isDrawing = true;
    }

	@HostListener('mouseup') onMouseUp() {
		//curBox.label = null;
		if(curBox.x2 != -1){
		  boxes.push(curBox);
		  imageProvider.addBox(curBox);
		}
        isDrawing = false;
        context.clearRect(0, 0, element.width, element.height);
		this.drawAllBoxes();
    }

    @HostListener('mousemove', ['$event']) onMouseMove(event) {
        if (isDrawing) {
            curBox.x2 = event.offsetX;
            curBox.y2 = event.offsetY;

            context.clearRect(0, 0, element.width, element.height);

            for (let box of boxes) {
                this.drawBox(box, 'red');
            }

            context.beginPath();
            context.strokeStyle = 'green';
            context.moveTo(curBox.x1, curBox.y1);
            context.lineTo(curBox.x2, curBox.y2);
            context.stroke();

            this.drawBox(curBox, 'black');
        }
    }
}
