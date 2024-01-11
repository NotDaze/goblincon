"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { SignalingSocket } from "./Modules/Network/ss"
//import SignalingServer, { SignalingSocket } from "./Modules/Network/signaling_server"
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
//import http from "http"
const game_server_1 = __importDefault(require("./Private/game_server"));
const PORT = 5050;
const app = (0, express_1.default)();
//const appServer: http.Server = http.createServer(app);
const httpServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
const gameServer = new game_server_1.default({ server: httpServer, clientTracking: false });
app.get("/", (req, res) => {
    app.use(express_1.default.static(path_1.default.join(__dirname, "/Public")));
    res.sendFile(__dirname + "/Public/index.html");
});
gameServer.connected.connect(() => {
    console.log("Signaling!");
});
gameServer.peerConnected.connect((peer) => {
    //console.log("Client connected!");
});
/*server.socketConnected.connect((socket: Socket) => {
    
    console.log("Socket connected");
    
});
server.socketDisconnected.connect((socket: Socket) => {
    console.log("Socket disconnected");
});*/
//server.connectionLost.connect((socket: Socket) => {});
