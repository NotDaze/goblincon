"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Canvas {
    ctx;
    get element() { return this.ctx.canvas; }
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
    get sourceWidth() {
        return this.element.width;
    }
    get sourceHeight() {
        return this.element.height;
    }
    // Constructors and related methods
    static getCanvasElementContext(canvasElement) {
        let ctx = canvasElement.getContext("2d");
        if (ctx == null)
            throw new Error("Couldn't get 2d canvas context.");
        else
            return ctx;
    }
    static createElement(parent) {
        let canvasElement = document.createElement("canvas");
        canvasElement.style.display = "block";
        canvasElement.style.margin = "auto";
        canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
        if (parent !== undefined)
            parent.appendChild(canvasElement);
        return canvasElement;
    }
    static fromElement(canvasElement) {
        return new Canvas(this.getCanvasElementContext(canvasElement));
    }
    static create() {
        return Canvas.fromElement(Canvas.createElement());
    }
    static createWithParent(parent) {
        return Canvas.fromElement(Canvas.createElement(parent));
    }
    constructor(ctx) {
        this.ctx = ctx;
        //this.element = ctx.canvas;
        //this.width = this.element.width;
        //this.height = this.element.height;
        //this.element.addEventListener("keydown", (ev: KeyboardEvent) => this.keyDown.emit(ev.key.toLowerCase()));
        //this.element.addEventListener("keyup", (ev: KeyboardEvent) => this.keyUp.emit(ev.key.toLowerCase()));
        //this.keyDown.connect((key: string) => this.pressedKeys.add(key));
        //this.keyUp.connect((key: string) => this.pressedKeys.delete(key));
    }
    // 
    apply(...canvases) {
        this.clear();
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
    clear() {
        this.clearRect(0, 0, this.sourceWidth, this.sourceHeight);
    }
    wipe(r, g, b, a = 1.0) {
        this.wipeStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    wipeStyle(style) {
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
