

/*import Signal from "./Modules/Core/signal"
import Arg from "./Modules/Network/arg"
import {
	Message,
	MessageIndex,
	MessageHandler,
	Packet,
	Socket,
	SocketServer,
	Room
} from "./Modules/Network/wss"*/


//import { SignalingSocket } from "./Modules/Network/ss"
//import SignalingServer, { SignalingSocket } from "./Modules/Network/signaling_server"

import path from "path";
import express from "express";
//import http from "http"
import GameServer, { GameSocket } from "./Private/game_server";


const PORT: Number = 5050;

const app: express.Application = express();
//const appServer: http.Server = http.createServer(app);
const httpServer = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
const gameServer = new GameServer({ server: httpServer, clientTracking: false });


app.get("/", (req: express.Request, res: express.Response) => {
	app.use(express.static(path.join(__dirname, "/Public")));
	res.sendFile(__dirname + "/Public/index.html");
});


gameServer.connected.connect(() => {
	console.log("Signaling!");
});
/*gameServer.peerConnected.connect((peer: GameSocket) => {
	//console.log("Client connected!");
});*/
/*server.socketConnected.connect((socket: Socket) => {
	
	console.log("Socket connected");
	
});
server.socketDisconnected.connect((socket: Socket) => {
	console.log("Socket disconnected");
});*/
//server.connectionLost.connect((socket: Socket) => {});


