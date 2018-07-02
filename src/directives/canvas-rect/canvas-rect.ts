import { Directive, ElementRef, HostListener } from '@angular/core';

let element: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let isDrawing: boolean;
let default_color = 'black';
let boxes = [];

@Directive({
	selector: '[canvas-rect]' // Attribute selector
})
export class CanvasRectDirective {

	constructor(el: ElementRef) {
		element = (<HTMLCanvasElement>el.nativeElement);
		context = element.getContext('2d');
		isDrawing = false;	
		startingPosition = {x: 0, y: 0};
 	}

	ngOnInit(){}
		
	curBox : Object = {x1: 0, y1: 0, x2: 0, y2: 0};
		
	drawLine(start, end, color=default_color) : void {
		context.beginPath();
		context.strokeStyle = color;
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		context.stroke();
		
	}
	
	drawBox(box, color=default_color) : void {
		this.drawLine({x: box.x1, y: box.y1}, {x: box.x1, y: box.y2}, color);
		this.drawLine({x: box.x1, y: box.y1}, {x: box.x2, y: box.y1}, color);
		this.drawLine({x: box.x2, y: box.y1}, {x: box.x2, y: box.y2}, color);
		this.drawLine({x: box.x1, y: box.y2}, {x: box.x2, y: box.y2}, color);
	}

	@HostListener('mousedown', ['$event']) onMouseDown(event) {
		console.log("mousedown");
		this.curBox = {x1: event.offsetX, y1: event.offsetY, x2: 0, y2: 0};
		context.beginPath();
		isDrawing = true;
	}
	@HostListener('mouseup') onMouseUp() {
		boxes.push(this.curBox);
  		isDrawing = false;
	}
	@HostListener('mousemove', ['$event']) onMouseMove(event) {
		if(isDrawing){
			this.curBox.x2 = event.offsetX;
			this.curBox.y2 = event.offsetY;

			context.clearRect(0, 0, element.width, element.height);

			for(let box of boxes){
				this.drawBox(box, 'red');
			}
				
			context.beginPath();
			context.strokeStyle = 'green';
			context.moveTo(this.curBox.x1, this.curBox.y1);
			context.lineTo(this.curBox.x2, this.curBox.y2);
			context.stroke();

			this.drawBox(this.curBox, 'black');
		}
	}
}
