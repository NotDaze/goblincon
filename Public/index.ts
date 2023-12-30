
//import Socket from "../Modules/ws"
import Signal from "../Modules/Core/signal"
import Socket from "../Modules/Network/websocket_client"
import GameClient from "../Modules/game_client"

//import Color from "../Modules/Core/color"
import Canvas from "../Modules/Engine/Rendering/canvas"
import { PhysicsBody } from "../Modules/Engine/Physics/physics"

import SortedArray from "../Modules/Core/sorted_array"


//const socket = new Socket("ws://localhost:5050", ["soap"]);

const canvas = Canvas.create();

canvas.resized.connect(() => {
	canvas.clear(1.0, 1.0, 1.0);
	canvas.setFill(0, 0, 0);
	canvas.fillCircle(800, 450, 50);
});

canvas.fitWindow(1600, 900);
canvas.setFill(0, 0, 0);



const client = new GameClient("ws://localhost:5050");

client.connected.connect(() => {
	console.log("connected!");
});



window.onbeforeunload = (() => {
	client.close();
});



