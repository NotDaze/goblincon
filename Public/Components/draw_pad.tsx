

import React, { ReactPropTypes } from "react";
import Canvas from "../../Modules/Client/Rendering/canvas";
import client from "../client_instance";

//import LocalGameClient from "../game_client";

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

function Color({ color, setColor }: { color: string, setColor: (color: string) => void }) {
	
	const unselectedStyle = {
		backgroundColor: color
		
	};
	/*const selectedStyle = {
		backgroundColor: props.color
	}*/
	
	
	return (
		<button
			className="color-btn"
			style={unselectedStyle}
			onClick={ev => setColor(color)}
		/>
	);
	
}
function ColorContainer({ setColor }: { setColor: (color: string) => void }) {
	
	return (
		<div id="color-ctr">
			{colors.map(color => <Color key={color} color={color} setColor={setColor} />)}
		</div>
	);
	
}

const DrawCanvas = ({ canvasRef, startDraw, endDraw, draw }: {
	canvasRef: React.RefObject<HTMLCanvasElement>,
	startDraw: (ev: React.MouseEvent) => void,
	endDraw: (ev: React.MouseEvent) => void,
	draw: (ev: React.MouseEvent) => void
},) => {
	
	const canvasComponent = (
		<canvas 
			id="canvas"
			width="360px" height="360px"
			ref={canvasRef}
			onMouseDown= {startDraw}
			onMouseUp=   {endDraw}
			onMouseLeave={endDraw}
			onMouseMove= {draw}
		>
			You don't have canvas support!
		</canvas>
	);
	
	return canvasComponent;

}

/*const DrawCanvas = React.forwardRef(({ startDraw, endDraw, draw }: {
		startDraw: (ev: React.MouseEvent) => void,
		endDraw: (ev: React.MouseEvent) => void,
		draw: (ev: React.MouseEvent) => void
	}, ref: React.ForwardedRef<HTMLCanvasElement>) => {
	
	const canvasComponent = (
		<canvas 
			id="canvas"
			width="360px" height="360px"
			ref={ref}
			onMouseDown= {startDraw}
			onMouseUp=   {endDraw}
			onMouseLeave={endDraw}
			onMouseMove= {draw}
		>
			You don't have canvas support!
		</canvas>
	);
	
	return canvasComponent;
	
})*/

export default function DrawPad() {
	
	const canvasElementRef = React.useRef<HTMLCanvasElement>(null);
	
	let canvas: Canvas | undefined;
	let drawing = false;
	
	const setColor = (color: string) => {
		canvas?.setStrokeStyle(color);
	}
	
	const draw = (ev: React.MouseEvent) => {
		
		if (!drawing || !canvas)
			return;
		
		canvas.line(
			canvas.mapX(ev.nativeEvent.offsetX),
			canvas.mapY(ev.nativeEvent.offsetY),
			canvas.mapX(ev.nativeEvent.offsetX - ev.movementX),
			canvas.mapY(ev.nativeEvent.offsetY - ev.movementY)
		);
		
	}
	const startDraw = (ev: React.MouseEvent) => {
		
		if (drawing)
			return;
		
		drawing = true;
		draw(ev);
		
	}
	const endDraw = (ev: React.MouseEvent) => {
		
		if (!drawing)
			return;
		
		drawing = false;
		draw(ev);
		
	}
	
	React.useEffect(() => {
		
		let ctx = canvasElementRef.current?.getContext("2d");
		
		if (!ctx)
			throw new Error("Couldn't get canvas context.");
		
		canvas = new Canvas(ctx);
		canvas.setStrokeStyle("black");
		canvas.setLineWidth(8);
		canvas.setLineCap("round");
		
	}, [canvasElementRef.current]);
	React.useEffect(() => client.doneDrawing.subscribe(() => {
		
		if (canvasElementRef.current === null)
			throw new Error("Couldn't get canvas data");
		
		client.handleDrawingData(canvasElementRef.current.toDataURL("image/jpeg"));
		
	}), [canvasElementRef.current]);
	
	return (
		<div id="drawpad">
			<ColorContainer setColor={setColor} />
			<DrawCanvas
				canvasRef={canvasElementRef}
				startDraw={startDraw}
				endDraw={endDraw}
				draw={draw}
			/>
		</div>
	);
	
}

/*export default class DrawPad extends React.Component {
	
	
	private canvas?: Canvas;
	private drawing = false;
	
	constructor(props: ReactPropTypes) {
		
		super(props: ReactProp);
		
		
		
	}
	
	
	
	private Color(props: { color: string }) {
		
		const onClick = () => {
			this.canvas?.setStrokeStyle(props.color);
		}
		
		
		const unselectedStyle = {
			backgroundColor: props.color,
			
		};
		
		
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
	
}*/
/*
export default function DrawPad({ client }: { client: LocalGameClient }) {
	
}*/
