"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = __importDefault(require("../Core/signal"));
const color_1 = __importDefault(require("../Core/color"));
/*type CanvasStyle {
    
    fillColor:
    
}*/
class CanvasStyle {
    //fill: Color;
    //stroke: Color;
    fill;
    stroke;
    lineWidth;
    setFillColor(fill) {
        this.fill = fill;
    }
    setStrokeColor(stroke) {
        this.stroke = stroke;
    }
    setFill(r, g, b, a = 1.0) {
        if (this.fill == undefined)
            this.setFillColor(new color_1.default(r, g, b, a));
        else
            this.fill.set(r, g, b);
    }
    setStroke(r, g, b, a = 1.0) {
        if (this.stroke == undefined)
            this.setStrokeColor(new color_1.default(r, g, b, a));
        else
            this.stroke.set(r, g, b);
    }
    clearFill() {
        this.fill = undefined;
    }
    clearStroke() {
        this.stroke = undefined;
    }
    getFill() {
        return this.fill;
    }
    getStroke() {
        return this.stroke;
    }
    withFillColor(color) {
        this.setFillColor(color);
        return this;
    }
    withFill(r, g, b, a = 1.0) {
        this.setFill(r, g, b, a);
        return this;
    }
    withoutFill() {
        this.clearFill();
        return this;
    }
    withStrokeColor(color) {
        this.setStrokeColor(color);
        return this;
    }
    withStroke(r, g, b, a = 1.0) {
        this.setStroke(r, g, b, a);
        return this;
    }
    withoutStroke() {
        this.clearStroke();
        return this;
    }
    withlineWidth(weight) {
        this.lineWidth = weight;
        return this;
    }
}
class Canvas {
    static createElement(parent) {
        let canvasElement = document.createElement("canvas");
        canvasElement.style.display = "block";
        canvasElement.style.margin = "auto";
        canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
        if (parent !== undefined)
            parent.appendChild(canvasElement);
        return canvasElement;
    }
    static create(parent) {
        let element = Canvas.createElement(parent);
        let ctx = element.getContext("2d");
        if (ctx == null)
            throw new Error("Canvas ctx error - does your browser have canvas support?");
        else
            return new Canvas(ctx);
    }
    //canvas: HTMLCanvasElement;
    stretch = 1;
    resizeObserver;
    //private contentStack = new Array<ImageBitmap>();
    //private pressedKeys = new Set<string>();
    //resized = new Signal<void>();
    resized = new signal_1.default();
    click = new signal_1.default();
    //keyDown = new Signal<string>();
    //keyUp = new Signal<string>();
    //element: HTMLCanvasElement;
    ctx;
    style = new CanvasStyle();
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
    get element() {
        return this.ctx.canvas;
    }
    get left() {
        return 0;
    }
    get right() {
        return this.element.width / this.stretch;
    }
    get top() {
        return 0;
    }
    get bottom() {
        return this.element.height / this.stretch;
    }
    get width() {
        return this.right - this.left;
    }
    get height() {
        return this.bottom - this.top;
    }
    // Scaling
    setStretch(newStretch) {
        this.scale(newStretch / this.stretch);
        this.stretch = newStretch;
    }
    resize(width, height, stretch = 1.0) {
        this.setStretch(stretch);
        let transform = this.ctx.getTransform();
        if (width > 0.0)
            this.element.width = width;
        if (height > 0.0)
            this.element.height = height;
        this.ctx.setTransform(transform);
        this.resized.emit();
    }
    fit(boundWidth, boundHeight, width, height) {
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
    fitWindow(width, height) {
        // clunky for now, probably wants to be generalized to fitElement and use a ResizeObserver
        this.fit(window.innerWidth, window.innerHeight, width, height);
        //window.addEventListener("resize", (ev: UIEvent) => { this.fit(width, height); });
    }
    fitWindowPersistent(width, height) {
        this.fitWindow(width, height);
        window.addEventListener("resize", () => this.fitWindow(width, height));
    }
    fitElement(element, width, height) {
        this.fit(element.clientWidth, element.clientHeight, width, height);
    }
    fitParent(width, height) {
        if (this.element.parentElement !== null)
            this.fitElement(this.element.parentElement, width, height);
    }
    fitElementPersistent(element, width, height) {
        //let el = WeakRef(element);
        this.fitElement(element, width, height);
        if (this.resizeObserver !== undefined)
            this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver((entries) => {
            if (entries.length !== 1)
                throw new Error();
            this.fit(entries[0].contentRect.width, entries[0].contentRect.height, width, height);
        });
        this.resizeObserver.observe(element);
    }
    fitParentPersistent(width, height) {
        if (this.element.parentElement === null)
            return;
        this.fitElementPersistent(this.element.parentElement, width, height);
    }
    scale(x, y = x) {
        this.ctx.scale(x, y);
    }
    resetTransform() {
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
    useFill() {
        if (this.style.fill !== undefined)
            this.ctx.fillStyle = this.style.fill.getString();
    }
    useStroke() {
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
    clear(r, g, b, a = 1.0) {
        if (r === undefined || g === undefined || b === undefined) {
            this.ctx.clearRect(this.left, this.top, this.width, this.height);
        }
        else {
            //this.ctx.fillStyle = color.getString();
            this.ctx.fillStyle = color_1.default.getString(r, g, b, a);
            this.ctx.fillRect(this.left, this.top, this.width, this.height);
        }
    }
    // Shapes
    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    }
    fillRect(x, y, w, h) {
        //this.ctx.fillStyle = "rgb(0,0,0)";
        //this.ctx.fillStyle = "blue";
        this.useFill();
        this.ctx.fillRect(x, y, w, h);
    }
    strokeRect(x, y, w, h) {
        this.useStroke();
        this.ctx.strokeRect(x, y, w, h);
    }
    fillStrokeRect(x, y, w, h) {
        this.fillRect(x, y, w, h);
        this.strokeRect(x, y, w, h);
    }
    drawEllipse(fill, stroke, x, y, w, h) {
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
    fillEllipse(x, y, w, h) {
        this.drawEllipse(true, false, x, y, w, h);
    }
    strokeEllipse(x, y, w, h) {
        this.drawEllipse(false, true, x, y, w, h);
    }
    ellipse(x, y, w, h) {
        this.drawEllipse(true, true, x, y, w, h);
    }
    fillCircle(x, y, r) {
        this.fillEllipse(x, y, r, r);
    }
    strokeCircle(x, y, r) {
        this.strokeEllipse(x, y, r, r);
    }
    circle(x, y, r) {
        this.ellipse(x, y, r, r);
    }
    line(x1, y1, x2, y2) {
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
exports.default = Canvas;
