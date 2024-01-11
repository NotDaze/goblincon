"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import Color from "./Core/color";
const react_1 = __importDefault(require("react"));
const canvas_1 = __importDefault(require("../../Modules/Client/Rendering/canvas"));
class DrawPadCanvas extends react_1.default.Component {
    canvas;
    source = canvas_1.default.create();
    isDrawing = false;
    constructor(props) {
        //let a: ReactDOM.createElement(<canvas />);
        //a.getContext("2d");
        super();
        this.canvas = props.canvas;
        //this.source.setSize(this.canvas.width, this.canvas.height);
        this.source.setSize(sourceWidth, sourceHeight);
        this.canvas.element.addEventListener("mousedown", (ev) => {
            this.startDraw();
            this.drawEvent(ev);
        });
        this.canvas.element.addEventListener("mouseup", (ev) => {
            this.drawEvent(ev);
            this.stopDraw();
        });
        this.canvas.element.addEventListener("mouseleave", (ev) => {
            this.drawEvent(ev);
            this.stopDraw();
        });
        this.canvas.element.addEventListener("mousemove", (ev) => {
            this.drawEvent(ev);
        });
        this.canvas.sizeChanged.connect(() => this.updateCanvas());
        this.source.wipe(1, 1, 1);
        this.source.setLineWidth(5);
        this.source.setLineCap("round");
    }
    updateCanvas() {
        this.canvas.apply(this.source);
    }
    startDraw() {
        if (this.isDrawing)
            return;
        this.isDrawing = true;
        //this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY)
    }
    stopDraw() {
        if (!this.isDrawing)
            return;
        this.isDrawing = false;
    }
    drawEvent(ev) {
        this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY);
    }
    draw(fromX, fromY, toX, toY) {
        if (!this.isDrawing)
            return;
        //if (!this.activeLayer)
        //	return;
        //let stretch = this.canvas.getStretch();
        /*this.activeLayer.style.setStrokeColor(this.color);
        this.activeLayer.line(
            fromX * stretch, fromY * stretch,
            toX * stretch, toY * stretch
        );*/
        //let stretch = this.source.getStretchFactor();
        let stretch = this.canvas.getStretchFactor();
        this.source.line(fromX / stretch, fromY / stretch, toX / stretch, toY / stretch);
        this.updateCanvas();
    }
}
exports.default = DrawPadCanvas;
/*export default class DrawPad {
    
    private layers = new Array<Canvas>();
    private activeLayerIndex: number = NaN;
    
    //private canvas: HTMLCanvasElement;
    private canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {
        
        this.canvas = new Canvas(canvas);
        
        this.createLayer();
        this.setActiveLayer(0);
        
    }
    
    private get activeLayer() {
        return this.layers[this.activeLayerIndex];
    }
    
    createLayer(): number {
        
        this.layers.push(Canvas.create());
        return this.layers.length - 1;
        
    }
    
    setActiveLayer(layer: number): void {
        this.activeLayerIndex = layer;
    }
    draw(startX: number, startY: number, endX: number, endY: number): void {
        this.activeLayer.line(startX, startY, endX, endY);
    }
    
    undo(): void {
        
    }
    redo(): void {
        
    }
    
    
    
    
    
    
}*/
/*export default class DrawPad {
    
    canvas: Canvas;
    
    private layers = new Array<Canvas>();
    private activeLayer?: Canvas;
    
    private color = new Color(0, 0, 0);
    private isDrawing: boolean = false;
    
    constructor(canvas: Canvas, ...layerWeights: Array<number>) {
        
        this.canvas = canvas;
        
        this.canvas.element.addEventListener("mousemove", (ev: MouseEvent) => {
            this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY);
        });
        this.canvas.element.addEventListener("mousedown", (ev: MouseEvent) => this.startDraw());
        this.canvas.element.addEventListener("mouseup", (ev: MouseEvent) => this.stopDraw());
        this.canvas.element.addEventListener("mouseleave", (ev: MouseEvent) => this.stopDraw());
        
        for (const weight of layerWeights)
            this.createLayer(weight);
        
        this.setActiveLayer(0);
        
    }
    
    private createLayer(weight: number): void {
        
        let layer = Canvas.create();
        
        layer.resize(this.canvas.width, this.canvas.height);
        //layer.fitElementPersistent(this.canvas.element, this.canvas.width, this.canvas.height);
        
        this.layers.push(layer);
        
        
    }
    setActiveLayer(index: number): void {
        
        this.stopDraw();
        this.activeLayer = this.layers[index];
        
    }
    
    private startDraw(): void {
        
        if (this.isDrawing)
            return;
        
        this.isDrawing = true;
        
    }
    private stopDraw(): void {
        
        if (!this.isDrawing)
            return;
        
        this.isDrawing = false;
        
    }
    private draw(fromX: number, fromY: number, toX: number, toY: number): void {
        
        if (!this.isDrawing)
            return;
        if (!this.activeLayer)
            return;
        
        let stretch = this.canvas.getStretch();
        
        this.activeLayer.style.setStrokeColor(this.color);
        this.activeLayer.line(
            fromX * stretch, fromY * stretch,
            toX * stretch, toY * stretch
        );
        
        this.updateCanvas();
        
    }
    private updateCanvas(): void {
        
        this.canvas.clear();
        
        for (const layer of this.layers)
            this.canvas.ctx.drawImage(layer.element, 0, 0, this.canvas.width, this.canvas.height);
        
    }
    
    setColor(color: Color): void {
        this.color = color;
    }
    setRGB(r: number, g: number, b: number, a = 1): void {
        this.color = new Color(r, g, b, a);
    }
    
}*/
