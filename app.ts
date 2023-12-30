

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
import SignalingServer, { SignalingSocket } from "./Modules/Network/signaling_server"
import express from "express"
//import http from "http"


const PORT: Number = 5050;

const app: express.Application = express();
//const appServer: http.Server = http.createServer(app);
const httpServer = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
const signalingServer = new SignalingServer({ server: httpServer, clientTracking: false }, SignalingSocket);


app.get("/", (req: express.Request, res: express.Response) => {
	app.use(express.static(__dirname + "/Public"));
	res.sendFile(__dirname + "/Public/index.html");
});


signalingServer.connected.connect(() => {
	console.log("Signaling!");
});
signalingServer.peerConnected.connect((peer: SignalingSocket) => {
	//console.log("Client connected!");
});
/*server.socketConnected.connect((socket: Socket) => {
	
	console.log("Socket connected");
	
});
server.socketDisconnected.connect((socket: Socket) => {
	console.log("Socket disconnected");
});*/
//server.connectionLost.connect((socket: Socket) => {});


