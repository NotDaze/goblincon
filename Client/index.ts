
//import Socket from "../Modules/ws"
import Signal from "../Modules/Core/signal"
import Socket from "../Modules/Network/websocket_client"
import GameClient from "../Modules/game_client"

//import Color from "../Modules/Core/color"
import Canvas from "../Modules/Client/Rendering/canvas"
import DrawPad from "../Modules/draw_pad"
//import { PhysicsBody } from "../Modules/Engine/Physics/physics"

//import SortedArray from "../Modules/Core/sorted_array"


//const socket = new Socket("ws://localhost:5050", ["soap"]);

//const drawPad = new DrawPad(Canvas.createWithParent(document.body));
//drawPad.canvas.fitParentPersistent(1000, 1000);
//drawPad.

//drawPad.canvas.clear(1.0, 1.0, 1.0);
//drawPad.canvas.style.setFill(0, 0, 0);
//drawPad.canvas.fillCircle(0, 0, 50);

//drawPad.canvas.


/*drawPad.canvas.resized.connect(() => {
	drawPad.canvas.clear(1.0, 1.0, 1.0);
	drawPad.canvas.style.setFill(0, 0, 0);
	drawPad.canvas.fillCircle(400, 400, 50);
	
});*/


/*const canvas = Canvas.create(document.body);

canvas.resized.connect(() => {
	canvas.clear(1.0, 1.0, 1.0);
	canvas.style.setFill(0, 0, 0);
	canvas.fillCircle(800, 450, 50);
});*/

//canvas.fitParentPersistent(1600, 900);
//canvas.setFill(0, 0, 0);

//canvas.fitElementPersistent(document.body, 1600, 900);
//canvas.fitElementPersistent(document.body, 1600, 900);
/*canvas.clear(1.0, 1.0, 1.0);
canvas.style.setFill(0, 0, 0);
canvas.fillCircle(800, 450, 50);*/

/*let src = Canvas.create();
//src.setStretchFactor(10.0);
src.setSize(1000, 1000);
src.setStretchFactor(10.0);

let dest = Canvas.createWithParent(document.body);
dest.fitParentPersistent(100, 100);

src.wipe(1.0, 1.0, 1.0);
src.setFill(1.0, 0.0, 0.0);
src.setStroke(0.0, 0.0, 0.0);
src.ellipse(30, 30, 20);

dest.apply(src);
dest.sizeChanged.connect(() => dest.apply(src));*/

let canvas = Canvas.createWithParent(document.body);
canvas.fitParentPersistent(1000, 1000);

let drawPad = new DrawPad(canvas);


const client = new GameClient("ws://localhost:5050");

client.connected.connect(() => {
	console.log("connected!");
});



window.onbeforeunload = (() => {
	client.close();
});



