"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const canvas_1 = __importDefault(require("../../../Modules/Client/Rendering/canvas"));
const colors = [
    "#FF0000",
    "#FF9900",
    "#FFFF00",
    "#00FF00",
    "#0099FF",
    "#0000FF",
    "#9900FF",
    "#000000",
];
class DrawPad extends react_1.default.Component {
    /*constructor(props: {}) {
        
        super(props);
        
    }*/
    canvas;
    drawing = false;
    Color(props) {
        const onClick = () => {
            this.canvas?.setStrokeStyle(props.color);
        };
        const unselectedStyle = {
            backgroundColor: props.color,
        };
        /*const selectedStyle = {
            backgroundColor: props.color
        }*/
        return (react_1.default.createElement("button", { className: "color-btn", style: unselectedStyle, onClick: onClick }));
    }
    ColorContainer() {
        const Color = this.Color.bind(this);
        return (react_1.default.createElement("div", { id: "color-ctr" }, colors.map(color => react_1.default.createElement(Color, { key: color, color: color }))));
    }
    canvasSetup() {
        if (!this.canvas)
            return;
        this.canvas.setStrokeStyle("black");
        this.canvas.setLineWidth(8);
        this.canvas.setLineCap("round");
    }
    canvasStartDraw(ev) {
        if (this.drawing)
            return;
        this.drawing = true;
        this.canvasDraw(ev);
    }
    canvasEndDraw(ev) {
        if (!this.drawing)
            return;
        this.drawing = false;
        this.canvasDraw(ev);
    }
    canvasDraw(ev) {
        if (!this.drawing)
            return;
        if (!this.canvas)
            return;
        /*const scaleX = this.canvas.width / this.canvas.element.clientWidth;
        const scaleY = this.canvas.height / this.canvas.element.clientHeight;
        
        
        let toX = ev.nativeEvent.offsetX * scaleX;
        let toY = ev.nativeEvent.offsetY * scaleX;
        let fromX = toX - scaleX * ev.movementX;
        let fromY = toY - scaleY * ev.movementY;
        
        this.canvas.line(fromX, fromY, toX, toY);*/
        this.canvas.line(this.canvas.mapX(ev.nativeEvent.offsetX), this.canvas.mapY(ev.nativeEvent.offsetY), this.canvas.mapX(ev.nativeEvent.offsetX - ev.movementX), this.canvas.mapY(ev.nativeEvent.offsetY - ev.movementY));
    }
    Canvas() {
        const canvasRef = react_1.default.useRef(null);
        react_1.default.useEffect(() => {
            let ctx = canvasRef.current?.getContext("2d");
            if (!ctx)
                throw new Error();
            this.canvas = new canvas_1.default(ctx);
            this.canvasSetup();
        });
        const canvasStartDraw = this.canvasStartDraw.bind(this);
        const canvasEndDraw = this.canvasEndDraw.bind(this);
        const canvasDraw = this.canvasDraw.bind(this);
        const canvasComponent = (react_1.default.createElement("canvas", { ref: canvasRef, id: "canvas", width: "360px", height: "360px", onMouseDown: canvasStartDraw, onMouseMove: canvasDraw, onMouseUp: canvasEndDraw, onMouseLeave: canvasEndDraw }, "You don't have canvas support!"));
        return canvasComponent;
    }
    render() {
        const ColorContainer = this.ColorContainer.bind(this);
        const Canvas = this.Canvas.bind(this);
        return (react_1.default.createElement("div", { id: "drawpad" },
            react_1.default.createElement(ColorContainer, null),
            react_1.default.createElement(Canvas, null)));
    }
}
exports.default = DrawPad;
