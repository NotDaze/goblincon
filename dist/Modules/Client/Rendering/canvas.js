"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    ctx;
    get element() {
        return this.ctx.canvas;
    }
    get sourceWidth() {
        return this.element.width;
    }
    get sourceHeight() {
        return this.element.height;
    }
    get clientWidth() {
        return this.element.clientWidth;
    }
    get clientHeight() {
        return this.element.clientHeight;
    }
    /*get left(): number {
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
    }*/
    // Constructors and related methods
    static getCanvasElementContext(canvasElement) {
        let ctx = canvasElement.getContext("2d");
        if (ctx == null)
            throw new Error("Couldn't get 2d canvas context.");
        else
            return ctx;
    }
    static fromElement(canvasElement) {
        return new Canvas(this.getCanvasElementContext(canvasElement));
    }
    static fromImageData(imageData) {
        let canvas = Canvas.create(imageData.width, imageData.height);
        canvas.ctx.putImageData(imageData, 0, 0);
        return canvas;
    }
    static create(sourceWidth, sourceHeight) {
        let canvasElement = document.createElement("canvas");
        canvasElement.width = sourceWidth;
        canvasElement.height = sourceHeight;
        return Canvas.fromElement(canvasElement);
    }
    constructor(ctx) {
        this.ctx = ctx;
    }
    mapX(x) {
        return x * this.sourceWidth / this.clientWidth;
    }
    mapY(y) {
        return y * this.sourceHeight / this.clientHeight;
    }
    unmapX(x) {
        return x * this.clientWidth / this.sourceWidth;
    }
    unmapY(y) {
        return y * this.clientHeight / this.sourceHeight;
    }
    /*map(x: number, y: number): [number, number] {
        return [this.mapX(x), this.mapY(y)];
    }
    unmap(x: number, y: number): void {
        
    }*/
    // 
    reset() {
        this.resetTransform();
        this.clear();
    }
    apply(...canvases) {
        this.reset();
        for (const canvas of canvases)
            this.ctx.drawImage(canvas.element, 0, 0, this.element.width, this.element.height);
    }
    // Transform
    scale(x, y = x) {
        this.ctx.scale(x, y);
    }
    resetTransform() {
        //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        //this.scale(this.stretch);
        this.ctx.resetTransform();
    }
    // Color
    static rgbaToStyle(r, g, b, a = 1) {
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 255)})`;
    }
    getFillStyle() {
        return this.ctx.fillStyle;
    }
    getStrokeStyle() {
        return this.ctx.strokeStyle;
    }
    setFill(r, g, b, a = 1) {
        this.setFillStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    setFillStyle(style) {
        this.ctx.fillStyle = style;
    }
    setStroke(r, g, b, a = 1) {
        this.setStrokeStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    setStrokeStyle(style) {
        this.ctx.strokeStyle = style;
    }
    setLineWidth(width) {
        this.ctx.lineWidth = width;
    }
    setLineCap(cap) {
        this.ctx.lineCap = cap;
    }
    /*protected withoutTransform<T>(callback: () => T): T {
        
        let transform = this.getTransform();
        
        let out = callback();
        
        return out;
        
    }*/
    clear() {
        this.clearRect(0, 0, this.sourceWidth, this.sourceHeight);
    }
    wipe(r, g, b, a = 1.0) {
        this.wipeStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    wipeStyle(style) {
        let fillStyle = this.getFillStyle();
        this.setFillStyle(style);
        this.fillRect(0, 0, this.sourceWidth, this.sourceHeight);
        // Maybe reset fillStyle to what it was before
    }
    // Shapes
    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    }
    fillRect(x, y, w, h) {
        //this.ctx.fillStyle = "rgb(0,0,0)";
        //this.ctx.fillStyle = "blue";
        //this.useFill();
        this.ctx.fillRect(x, y, w, h);
    }
    strokeRect(x, y, w, h) {
        //this.useStroke();
        this.ctx.strokeRect(x, y, w, h);
    }
    fillStrokeRect(x, y, w, h) {
        this.fillRect(x, y, w, h);
        this.strokeRect(x, y, w, h);
    }
    pathEllipse(x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, w, h, 0, 0, 6.3); // 6.3 = a bit over 2pi
    }
    fillEllipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.fill();
    }
    strokeEllipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.stroke();
    }
    ellipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.fill();
        this.ctx.stroke();
    }
    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}
exports.default = Canvas;
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
