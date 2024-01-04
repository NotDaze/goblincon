
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
	
	lineWidth?: number;
	
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
	withlineWidth(weight: number): CanvasStyle {
		this.lineWidth = weight;
		return this;
	}
	
}


/*export default class Canvas {
	
	
	
}*/



export default class Canvas {
	
	//canvas: HTMLCanvasElement;
	
	
	private stretch: number = 1.0;
	private resizeObserver?: ResizeObserver;
	
	//private contentStack = new Array<ImageBitmap>();
	
	//private pressedKeys = new Set<string>();
	
	//resized = new Signal<void>();
	resized = new Signal<void>();
	click = new Signal<[x: number, y: number]>();
	//keyDown = new Signal<string>();
	//keyUp = new Signal<string>();
	
	//element: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	
	style = new CanvasStyle();
	
	private static createElement(parent?: HTMLElement): HTMLCanvasElement {
		
		let canvasElement: HTMLCanvasElement = document.createElement("canvas");
		canvasElement.style.display = "block";
		canvasElement.style.margin = "auto";
		//canvasElement.style.objectFit = "contain";
		//canvasElement.style.maxWidth = "100%";
		//canvasElement.style.maxHeight = "100%";
		//canvasElement.style.aspectRatio = "1 / 1";
		//canvasElement.style.width = "auto";
		//canvasElement.style.height = "auto";
		//canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
		
		if (parent !== undefined)
			parent.appendChild(canvasElement);
		
		return canvasElement;
		
	}
	private static fromElement(parent?: HTMLElement): Canvas {
		
		let element: HTMLCanvasElement = Canvas.createElement(parent);
		let ctx: CanvasRenderingContext2D | null = element.getContext("2d");
		
		if (ctx == null)
			throw new Error("Canvas ctx error - does your browser have canvas support?");
		else
			return new Canvas(ctx);
		
	}
	static create(): Canvas {
		return Canvas.fromElement(undefined);
	}
	static createWithParent(parent: HTMLElement): Canvas {
		return Canvas.fromElement(parent);
	}
	
	constructor(ctx: CanvasRenderingContext2D) {
		
		this.ctx = ctx;
		//this.element = ctx.canvas;
		
		//this.width = this.element.width;
		//this.height = this.element.height;
		
		//this.element.addEventListener("keydown", (ev: KeyboardEvent) => this.keyDown.emit(ev.key.toLowerCase()));
		//this.element.addEventListener("keyup", (ev: KeyboardEvent) => this.keyUp.emit(ev.key.toLowerCase()));
		//this.keyDown.connect((key: string) => this.pressedKeys.add(key));
		//this.keyUp.connect((key: string) => this.pressedKeys.delete(key));
		
	}
	
	get element(): HTMLCanvasElement {
		return this.ctx.canvas;
	}
	get left(): number {
		return 0;
	}
	get right(): number {
		return this.element.width / this.stretch;
	}
	get top(): number {
		return 0;
	}
	get bottom(): number {
		return this.element.height / this.stretch;
	}
	get width(): number {
		return this.right - this.left;
	}
	get height(): number {
		return this.bottom - this.top;
	}
	
	getStretch(): number {
		return this.stretch;
	}
	
	// Scaling
	private setStretch(newStretch: number): void {
		this.scale(newStretch / this.stretch);
		this.stretch = newStretch;
	}
	resize(width: number, height: number, stretch = 1.0) {
		
		this.setStretch(stretch);
		
		let transform = this.ctx.getTransform();
		
		if (width > 0.0)
			this.element.width = width;
		if (height > 0.0)
			this.element.height = height;
		
		this.ctx.setTransform(transform);
		
		this.resized.emit();
		
	}
	
	fit(boundWidth: number, boundHeight: number, width: number, height: number): void {
		
		//this.width = width;
		//this.height = height;
		
		// document.documentElement.clientWidth & clientHeight as backup?
		
		let aspect = width / height;
		let boundAspect = boundWidth / boundHeight;
		
		if (aspect > boundAspect) {
			// canvas is shorter than the viewport, max out width
			//this.setStretch(fitWidth / width); // scale BEFORE resizing, for signal reasons
			this.resize(boundWidth, boundWidth / aspect, boundWidth / width);
		}
		else {
			// canvas is narrower than the viewport, max out height
			//this.setStretch(fitHeight / height);
			this.resize(boundHeight * aspect, boundHeight, boundHeight / height);
		}
		
	}
	fitWindow(width: number, height: number) {
		
		// clunky for now, probably wants to be generalized to fitElement and use a ResizeObserver
		this.fit(window.innerWidth, window.innerHeight, width, height);
		//window.addEventListener("resize", (ev: UIEvent) => { this.fit(width, height); });
		
	}
	fitWindowPersistent(width: number, height: number) {
		
		this.fitWindow(width, height);
		window.addEventListener("resize", () => this.fitWindow(width, height));
		
	}
	
	fitElement(element: HTMLElement, width: number, height: number): void {
		this.fit(element.clientWidth, element.clientHeight, width, height);
	}
	fitParent(width: number, height: number): void {
		if (this.element.parentElement !== null)
			this.fitElement(this.element.parentElement, width, height);
	}
	fitElementPersistent(element: HTMLElement, width: number, height: number): void {
		
		//let el = WeakRef(element);
		
		this.fitElement(element, width, height);
		
		if (this.resizeObserver !== undefined)
			this.resizeObserver.disconnect();
		
		this.resizeObserver = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
			
			if (entries.length !== 1)
				throw new Error();
			
			this.fit(entries[0].contentRect.width, entries[0].contentRect.height, width, height);
			
		});
		
		this.resizeObserver.observe(element);
		
	}
	fitParentPersistent(width: number, height: number): void {
		
		if (this.element.parentElement === null)
			return;
		
		this.fitElementPersistent(this.element.parentElement, width, height);
		
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
	
	// Image & data
	/*drawImage(image: CanvasImageSource, x: number, y: number): void {
		this.ctx.drawImage(image, x, y);
	}*/
	
	// Colors
	private useFill() {
		if (this.style.fill !== undefined)
			this.ctx.fillStyle = this.style.fill.getString();
	}
	private useStroke() {
		if (this.style.stroke !== undefined)
			this.ctx.strokeStyle = this.style.stroke.getString();
		if (this.style.lineWidth !== undefined)
			this.ctx.lineWidth = this.style.lineWidth;
	}
	
	/*setFill(r: number, g: number, b: number, a = 1.0): void {
		this.style.setFill(r, g, b, a);
	}
	setStroke(r: number, g: number, b: number, a = 1.0): void {
		this.style.setStroke(r, g, b, a);
	}
	setFillColor(color: Color): void {
		this.style.setFillColor(color);
	}
	setStrokeColor(color: Color): void {
		this.style.setStrokeColor(color);
	}*/
	
	
	// Image data management
	/*async pushContent(): Promise<void> {
		//this.contentStack.push(this.ctx.getImageData(0, 0, this.element.width, this.element.height));
		this.contentStack.push(await createImageBitmap(this.element));
	}
	popContent(): void {
		
		let data = this.contentStack.pop();
		
		if (data !== undefined)
			this.ctx.drawImage(data, 0, 0, this.element.width / this.stretch, this.element.height / this.stretch);
		
	}*/
	
	//
	clear(r?: number, g?: number, b?: number, a = 1.0) {
		
		if (r === undefined || g === undefined || b === undefined) {
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
		
		/*let path = new Path2D();
		
		path.moveTo(x1, y1);
		path.lineTo(x2, y2);
		
		this.ctx.stroke(path);*/
		
		this.useStroke();
		
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		
	}
	
}













