



import Signal, { SignalListener } from "../../Core/signal"


export default class MouseInputListener {
	
	mouseDown = new Signal<[number, number]>();
	mouseUp = new Signal<[number, number]>();
	
	
	constructor(element: HTMLElement) {
		
		/*element.addEventListener("mousedown", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
		element.addEventListener("mouseup", (ev: MouseEvent) => this.mouseUp.emit([ ev.offsetX, ev.offsetY ]));
		//element.addEventListener("mous", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
		element.addEventListener("mousedown", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
		element.addEventListener("mouse")*/
		
	}
	
	
}







