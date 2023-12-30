
import Signal from "../../Core/signal"
import Color from "../../Core/color"

/*type CanvasStyle {
	
	fillColor: 
	
}*/



class CanvasStyle {
	
	//fill: Color;
	//stroke: Color;
	
	fill?: Color;
	stroke?: Color;
	
	lineWeight?: number;
	
	setFillColor(fill: Color): void {
		this.fill = fill;
	}
	setStrokeColor(stroke: Color): void {
		this.stroke = stroke;
	}
	setFill(r: number, g: number, b: number, a: number = 1.0): void {
		if (this.fill == undefined)
			this.setFillColor(new Color(r, g, b, a));
		else
			this.fill.set(r, g, b);
	}
	setStroke(r: number, g: number, b: number, a: number = 1.0): void {
		if (this.stroke == undefined)
			this.setStrokeColor(new Color(r, g, b, a));
		else
			this.stroke.set(r, g, b);
	}
	clearFill(): void {
		this.fill = undefined;
	}
	clearStroke(): void {
		this.stroke = undefined;
	}
	
	getFill(): Color | undefined {
		return this.fill;
	}
	getStroke(): Color | undefined {
		return this.stroke;
	}
	
	
	withFillColor(color: Color): CanvasStyle {
		this.setFillColor(color);
		return this;
	}
	withFill(r: number, g: number, b: number, a: number = 1.0): CanvasStyle {
		this.setFill(r, g, b, a);
		return this;
	}
	withoutFill(): CanvasStyle {
		this.clearFill();
		return this;
	}
	withStrokeColor(color: Color): CanvasStyle {
		this.setStrokeColor(color);
		return this;
	}
	withStroke(r: number, g: number, b: number, a: number = 1.0): CanvasStyle {
		this.setStroke(r, g, b, a);
		return this;
	}
	withoutStroke(): CanvasStyle {
		this.clearStroke();
		return this;
	}
	withLineWeight(weight: number): CanvasStyle {
		this.lineWeight = weight;
		return this;
	}
	
}

export default class Canvas {
	
	
	
	static create(): Canvas {
		
		let canvasElement: HTMLCanvasElement = document.createElement("canvas");
		canvasElement.setAttribute("display", "block");
		canvasElement.setAttribute("margin", "auto");
		canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
		
		document.body.appendChild(canvasElement);
		
		let ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
		
		if (ctx == null)
			throw new Error("Canvas ctx error - does your browser have canvas support?");
		else
			return new Canvas(ctx);
		
	}
	
	//canvas: HTMLCanvasElement;
	
	private ctx: CanvasRenderingContext2D;
	private stretch: number = 1.0;
	
	//private pressedKeys = new Set<string>();
	
	//resized = new Signal<void>();
	resized = new Signal<void>();
	click = new Signal<[x: number, y: number]>();
	//keyDown = new Signal<string>();
	//keyUp = new Signal<string>();
	
	style = new CanvasStyle();
	
	
	constructor(ctx: CanvasRenderingContext2D) {
		
		this.ctx = ctx;
		//this.canvas = ctx.canvas;
		
		//this.width = this.canvas.width;
		//this.height = this.canvas.height;
		
		//this.canvas.addEventListener("keydown", (ev: KeyboardEvent) => this.keyDown.emit(ev.key.toLowerCase()));
		//this.canvas.addEventListener("keyup", (ev: KeyboardEvent) => this.keyUp.emit(ev.key.toLowerCase()));
		//this.keyDown.connect((key: string) => this.pressedKeys.add(key));
		//this.keyUp.connect((key: string) => this.pressedKeys.delete(key));
		
	}
	
	get canvas(): HTMLCanvasElement {
		return this.ctx.canvas;
	}
	get left(): number {
		return 0;
	}
	get right(): number {
		return this.canvas.width / this.stretch;
	}
	get top(): number {
		return 0;
	}
	get bottom(): number {
		return this.canvas.height / this.stretch;
	}
	get width(): number {
		return this.right - this.left;
	}
	get height(): number {
		return this.bottom - this.top;
	}
	
	// Scaling
	private setStretch(newStretch: number): void {
		this.scale(newStretch / this.stretch);
		this.stretch = newStretch;
	}
	private resize(width: number, height: number, stretch: number) {
		
		this.setStretch(stretch);
		
		let transform = this.ctx.getTransform();
		
		if (width > 0.0) // maybe >=, but doesn't really matter
			this.canvas.width = width;
		if (height > 0.0)
			this.canvas.height = height;
		
		this.ctx.setTransform(transform);
		
		this.resized.emit();
		
	}
	
	fit(width: number, height: number, fitWidth = window.innerWidth, fitHeight = window.innerHeight): void {
		
		//this.width = width;
		//this.height = height;
		
		// document.documentElement.clientWidth & clientHeight as backup?
		
		let aspect = width / height;
		let fitAspect = fitWidth / fitHeight;
		
		if (aspect > fitAspect) {
			// canvas is shorter than the viewport, max out width
			//this.setStretch(fitWidth / width); // scale BEFORE resizing, for signal reasons
			this.resize(fitWidth, fitWidth / aspect, fitWidth / width);
		}
		else {
			// canvas is narrower than the viewport, max out height
			//this.setStretch(fitHeight / height);
			this.resize(fitHeight * aspect, fitHeight, fitHeight / height);
		}
		
	}
	fitWindow(width: number, height: number) {
		
		// clunky for now, probably wants to be generalized to fitElement and use a ResizeObserver
		this.fit(width, height);
		window.addEventListener("resize", (ev: UIEvent) => { this.fit(width, height); });
		
	}
	
	
	
	
	scale(x: number, y = x): void {
		this.ctx.scale(x, y);
	}
	
	resetTransform(): void {
		//this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		//this.scale(this.stretch);
		this.ctx.setTransform(this.stretch, 0, 0, this.stretch, 0, 0);
	}
	
	/*private useFillColor(color?: Color): void {
		
	}
	private useFill(...styles: Array<CanvasStyle>): void {
		
		for (const style of styles)
			if (style.fill != undefined)
				return this.useFillColor(style.fill);
		
		if (this.style.fill != undefined)
			this.useFillColor(this.style.fill);
		
	}
	
	private useStrokeColor(color: Color): void {
		
	}
	private useStroke(...styles: Array<CanvasStyle>) {
		
	}*/
	
	// Colors
	private useFill() {
		if (this.style.fill != undefined)
			this.ctx.fillStyle = this.style.fill.getString();
	}
	private useStroke() {
		if (this.style.stroke != undefined)
			this.ctx.strokeStyle = this.style.stroke.getString();
	}
	
	public setFill(r: number, g: number, b: number, a = 1.0): void {
		this.style.setFill(r, g, b, a);
	}
	public setStroke(r: number, g: number, b: number, a = 1.0): void {
		this.style.setStroke(r, g, b, a);
	}
	
	//
	clear(r?: number, g?: number, b?: number, a = 1.0) {
		
		if (r == undefined || g == undefined || b == undefined) {
			this.ctx.clearRect(this.left, this.top, this.width, this.height);
		}
		else {
			//this.ctx.fillStyle = color.getString();
			this.ctx.fillStyle = Color.getString(r, g, b, a);
			this.ctx.fillRect(this.left, this.top, this.width, this.height);
		}
		
	}
	
	
	// Shapes
	clearRect(x: number, y: number, w: number, h: number): void {
		this.ctx.clearRect(x, y, w, h);
	}
	fillRect(x: number, y: number, w: number, h: number): void {
		//this.ctx.fillStyle = "rgb(0,0,0)";
		//this.ctx.fillStyle = "blue";
		this.useFill();
		this.ctx.fillRect(x, y, w, h);
	}
	strokeRect(x: number, y: number, w: number, h: number): void {
		this.useStroke();
		this.ctx.strokeRect(x, y, w, h);
	}
	fillStrokeRect(x: number, y: number, w: number, h: number): void {
		this.fillRect(x, y, w, h);
		this.strokeRect(x, y, w, h);
	}
	
	private drawEllipse(fill: boolean, stroke: boolean, x: number, y: number, w: number, h: number): void {
		//this.useFill();
		
		//if (fill)
		//	this.useFill();
		
		
		
		this.ctx.beginPath();
		this.ctx.ellipse(x, y, w, h, 0, 0, 6.3); // 6.3 = a bit over 2pi
		
		if (fill) {
			this.useFill();
			this.ctx.fill();
		}
		if (stroke) {
			this.useStroke();
			this.ctx.stroke();
		}
		
	}
	fillEllipse(x: number, y: number, w: number, h: number): void {
		this.drawEllipse(true, false, x, y, w, h);
	}
	strokeEllipse(x: number, y: number, w: number, h: number): void {
		this.drawEllipse(false, true, x, y, w, h);
	}
	ellipse(x: number, y: number, w: number, h: number): void {
		this.drawEllipse(true, true, x, y, w, h);
	}
	
	fillCircle(x: number, y: number, r: number): void {
		this.fillEllipse(x, y, r, r);
	}
	strokeCircle(x: number, y: number, r: number): void {
		this.strokeEllipse(x, y, r, r);
	}
	circle(x: number, y: number, r: number): void {
		this.ellipse(x, y, r, r);
	}
	
	line(x1: number, y1: number, x2: number, y2: number): void {
		
	}
	
}













