

import React from "react";
import Canvas from "../../Modules/Client/Rendering/canvas";
import LocalGameClient from "../game_client";

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

export default class DrawPad extends React.Component {
	
	
	private canvas?: Canvas;
	private drawing = false;
	
	constructor() {
		
		super({});
		
		/*client.drawingEnded.connect(() => {
			
			if (this.canvas !== undefined)
				client.sendDrawingData(this.canvas.ctx.getImageData(0, 0, this.canvas.sourceWidth, this.canvas.sourceHeight));
			
		});*/
		
	}
	
	
	
	private Color(props: { color: string }) {
		
		const onClick = () => {
			this.canvas?.setStrokeStyle(props.color);
		}
		
		
		const unselectedStyle = {
			backgroundColor: props.color,
			
		};
		/*const selectedStyle = {
			backgroundColor: props.color
		}*/
		
		
		return (
			<button
				className="color-btn"
				style={unselectedStyle}
				onClick={onClick}
			/>
		);
		
	}
	private ColorContainer() {
		
		const Color = this.Color.bind(this);
		
		return (
			<div id="color-ctr">
				{colors.map(color => <Color key={color} color={color}/>)}
			</div>
		);
		
	}
	
	private canvasSetup(): void {
		
		if (!this.canvas)
			return;
		
		this.canvas.setStrokeStyle("black");
		this.canvas.setLineWidth(8);
		this.canvas.setLineCap("round");
		
	}
	private canvasStartDraw(ev: React.MouseEvent): void {
		
		if (this.drawing)
			return;
		
		this.drawing = true;
		this.canvasDraw(ev);
		
	}
	private canvasEndDraw(ev: React.MouseEvent): void {
		
		if (!this.drawing)
			return;
		
		this.drawing = false;
		this.canvasDraw(ev);
		
		console.log(this.canvas?.element.toDataURL("image/jpeg"));
		
	}
	private canvasDraw(ev: React.MouseEvent): void {
		
		
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
		
		this.canvas.line(
			this.canvas.mapX(ev.nativeEvent.offsetX),
			this.canvas.mapY(ev.nativeEvent.offsetY),
			this.canvas.mapX(ev.nativeEvent.offsetX - ev.movementX),
			this.canvas.mapY(ev.nativeEvent.offsetY - ev.movementY)
		);
		
	}
	private Canvas() {
		
		const canvasRef = React.useRef<HTMLCanvasElement>(null);
		
		React.useEffect(() => {
			
			let ctx = canvasRef.current?.getContext("2d");
			
			if (!ctx)
				throw new Error();
			
			this.canvas = new Canvas(ctx);
			this.canvasSetup();
			
		});
		
		const canvasStartDraw = this.canvasStartDraw.bind(this);
		const canvasEndDraw = this.canvasEndDraw.bind(this);
		const canvasDraw = this.canvasDraw.bind(this);
		
		const canvasComponent = (
			<canvas 
				ref={canvasRef} id="canvas"
				width="360px" height="360px"
				onMouseDown= {canvasStartDraw}
				onMouseMove= {canvasDraw}
				onMouseUp=   {canvasEndDraw}
				onMouseLeave={canvasEndDraw}
			>
				You don't have canvas support!
			</canvas>
		);
		
		return canvasComponent;
		
	}
	
	
	
	render(): JSX.Element {
		
		const ColorContainer = this.ColorContainer.bind(this);
		const Canvas = this.Canvas.bind(this);
		
		return (
			<div id="drawpad">
				<ColorContainer />
				<Canvas />
			</div>
		);
		
	}
	
}
/*
export default function DrawPad({ client }: { client: LocalGameClient }) {
	
}*/


