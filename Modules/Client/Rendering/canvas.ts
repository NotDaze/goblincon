


import Signal from "../../Core/signal";

export default class Canvas {
	
	sizeChanged = new Signal<void>();
	
	ctx: CanvasRenderingContext2D;
	
	private stretchFactor: number = 1.0;
	
	get element(): HTMLCanvasElement { return this.ctx.canvas; }
	
	get left(): number {
		return 0;
	}
	get right(): number {
		return this.element.width / this.stretchFactor;
	}
	get top(): number {
		return 0;
	}
	get bottom(): number {
		return this.element.height / this.stretchFactor;
	}
	get width(): number {
		return this.right - this.left;
	}
	get height(): number {
		return this.bottom - this.top;
	}
	
	
	
	// Constructors and related methods
	protected static getCanvasElementContext(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D {
		
		let ctx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
		
		if (ctx == null)
			throw new Error("Couldn't get 2d canvas context.");
		else
			return ctx;
		
	}
	protected static createElement(parent?: HTMLElement): HTMLCanvasElement {
		
		let canvasElement: HTMLCanvasElement = document.createElement("canvas");
		canvasElement.style.display = "block";
		canvasElement.style.margin = "auto";
		canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
		
		if (parent !== undefined)
			parent.appendChild(canvasElement);
		
		return canvasElement;
		
	}
	protected static fromElement(canvasElement: HTMLCanvasElement): Canvas {
		return new Canvas(this.getCanvasElementContext(canvasElement));
	}
	static create(): Canvas {
		return Canvas.fromElement(Canvas.createElement());
	}
	static createWithParent(parent: HTMLElement): Canvas {
		return Canvas.fromElement(Canvas.createElement(parent));
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
	
	// Stretch and sizing
	getStretchFactor(): number {
		return this.stretchFactor;
	}
	setStretchFactor(factor: number): void {
		this.scale(factor / this.stretchFactor);
		this.stretchFactor = factor;
	}
	
	setSize(width: number, height: number) {
		
		//let transform = this.ctx.getTransform();
		
		this.element.width = width;
		this.element.height = height;
		
		//this.ctx.setTransform(transform);
		
		this.sizeChanged.emit();
		
	}
	
	protected fitResize(width: number, height: number, stretchFactor: number): void {
		
		this.setStretchFactor(stretchFactor);
		this.setSize(width, height);
		
	}
	fit(boundWidth: number, boundHeight: number, width: number, height: number): void {
		
		//this.width = width;
		//this.height = height;
		
		// document.documentElement.clientWidth & clientHeight as backup?
		
		let aspect = width / height;
		let boundAspect = boundWidth / boundHeight;
		
		if (aspect > boundAspect) {
			// canvas is shorter than the viewport, max out width
			this.fitResize(boundWidth, boundWidth / aspect, boundWidth / width);
		}
		else {
			// canvas is narrower than the viewport, max out height
			this.fitResize(boundHeight * aspect, boundHeight, boundHeight / height);
		}
		
	}
	fitWindow(width: number, height: number) {
		this.fit(window.innerWidth, window.innerHeight, width, height);
	}
	fitWindowPersistent(width: number, height: number) {
		
		this.fitWindow(width, height);
		window.addEventListener("resize", () => this.fitWindow(width, height));
		// Wants a way to clear this event listener
		
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
		
		//if (this.resizeObserver !== undefined)
		//	this.resizeObserver.disconnect();
		
		//this.resizeObserver = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
		let resizeObserver = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
			
			if (entries.length !== 1)
				throw new Error();
			
			this.fit(entries[0].contentRect.width, entries[0].contentRect.height, width, height);
			
		});
		
		//this.resizeObserver.observe(element);
		resizeObserver.observe(element);
		
	}
	fitParentPersistent(width: number, height: number): void {
		
		if (this.element.parentElement === null)
			return;
		
		this.fitElementPersistent(this.element.parentElement, width, height);
		
	}
	
	
	// 
	apply(...canvases: Array<Canvas>): void {
		
		this.clear();
		
		for (const canvas of canvases)
			this.ctx.drawImage(canvas.element, 0, 0, this.element.width, this.element.height);
		
	}
	
	// Transform
	scale(x: number, y = x): void {
		this.ctx.scale(x, y);
	}
	
	resetTransform(): void {
		//this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		//this.scale(this.stretch);
		this.ctx.setTransform(
			this.stretchFactor, 0, 0,
			this.stretchFactor, 0, 0
		);
	}
	
	// Color
	protected static rgbaToStyle(r: number, g: number, b: number, a = 1): string {
		return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 255)})`;
	}
	
	setFill(r: number, g: number, b: number, a = 1): void {
		this.setFillStyle(Canvas.rgbaToStyle(r, g, b, a));
	}
	setFillStyle(style: string | CanvasGradient | CanvasPattern): void {
		this.ctx.fillStyle = style;
	}
	setStroke(r: number, g: number, b: number, a = 1): void {
		this.setStrokeStyle(Canvas.rgbaToStyle(r, g, b, a));
	}
	setStrokeStyle(style: string | CanvasGradient | CanvasPattern): void {
		this.ctx.strokeStyle = style;
	}
	setLineWidth(width: number): void {
		this.ctx.lineWidth = width;
	}
	setLineCap(cap: CanvasLineCap): void {
		this.ctx.lineCap = cap;
	}
	
	
	
	clear(): void {
		this.clearRect(0, 0, this.width, this.height);
	}
	wipe(r: number, g: number, b: number, a = 1.0): void {
		this.wipeStyle(Canvas.rgbaToStyle(r, g, b, a));
	}
	wipeStyle(style: string): void {
		
		this.setFillStyle(style);
		this.fillRect(0, 0, this.width, this.height);
		// Maybe reset fillStyle to what it was before
		
	}
	
	// Shapes
	clearRect(x: number, y: number, w: number, h: number): void {
		this.ctx.clearRect(x, y, w, h);
	}
	fillRect(x: number, y: number, w: number, h: number): void {
		//this.ctx.fillStyle = "rgb(0,0,0)";
		//this.ctx.fillStyle = "blue";
		//this.useFill();
		this.ctx.fillRect(x, y, w, h);
	}
	strokeRect(x: number, y: number, w: number, h: number): void {
		//this.useStroke();
		this.ctx.strokeRect(x, y, w, h);
	}
	fillStrokeRect(x: number, y: number, w: number, h: number): void {
		this.fillRect(x, y, w, h);
		this.strokeRect(x, y, w, h);
	}
	
	private pathEllipse(x: number, y: number, w: number, h: number): void {
		
		this.ctx.beginPath();
		this.ctx.ellipse(x, y, w, h, 0, 0, 6.3); // 6.3 = a bit over 2pi
		
	}
	fillEllipse(x: number, y: number, w: number, h = w): void {
		this.pathEllipse(x, y, w, h);
		this.ctx.fill();
	}
	strokeEllipse(x: number, y: number, w: number, h = w): void {
		this.pathEllipse(x, y, w, h);
		this.ctx.stroke();
	}
	ellipse(x: number, y: number, w: number, h = w): void {
		this.pathEllipse(x, y, w, h);
		this.ctx.fill();
		this.ctx.stroke();
	}
	
	/*fillCircle(x: number, y: number, r: number): void {
		this.fillEllipse(x, y, r, r);
	}
	strokeCircle(x: number, y: number, r: number): void {
		this.strokeEllipse(x, y, r, r);
	}
	circle(x: number, y: number, r: number): void {
		this.ellipse(x, y, r, r);
	}*/
	
	line(x1: number, y1: number, x2: number, y2: number): void {
		
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
		
	}
	
}

/*export class LayeredCanvas extends Canvas {
	
	private layers = new Array<Canvas>();
	
	protected static fromElement(canvasElement: HTMLCanvasElement): LayeredCanvas {
		return new LayeredCanvas(this.getCanvasElementContext(canvasElement));
	}
	static create(): LayeredCanvas {
		return this.fromElement(this.createElement(undefined));
	}
	static createWithParent(parent: HTMLElement): LayeredCanvas {
		return this.fromElement(this.createElement(parent));
	}
	constructor(ctx: CanvasRenderingContext2D) {
		
		super(ctx);
		
	}
	
	
}

export class SourcedCanvas extends Canvas {
	
	//private source?: Canvas;
	source: Canvas;
	
	static create(source: Canvas): SourcedCanvas {
		
		
		
	}
	
	constructor(source: Canvas, ctx: CanvasRenderingContext2D) {
		
		super(ctx);
		
		this.source = source;
		
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
	
	clearPersistentFit(): void {
		
	}
	
	
}*/

































