


//const WebSocket = require("ws");

import ByteIStream from "../Core/byteistream"
import ByteOStream from "../Core/byteostream"
import Deferrable from "../Core/deferrable"
import Signal from "../Core/signal"

import Arg from "./arg"

//import { Message, Packet, MessageIndex, MessageHandler } from "./network_message"
import { WebSocket, WebSocketServer, ServerOptions as WebSocketServerOptions } from "ws"

//const Index = require("../core/index");

//const ByteStream = require("../core/bytestream");


import {
	ConnectionState,
	
	//Packet,
	//Message,
	//MessageDomain,
	//MessageHandler,
	
	//Group,
	LocalMultiPeer,
	RemotePeer,
	
} from "./network"


export class Socket extends RemotePeer {
	
	private ws: WebSocket;
	
	constructor(ws: WebSocket) {
		
		super();
		this.ws = ws;
		
		this.rawReceived.bindEvent(this.ws, "message");
		
		this.disconnected.bindEvent(this.ws, "close");
		
		//this.ws.on("")
		
		this.ws.on("close", (code: number, reason: Buffer): void => {
			// Maybe wants some better handling for unexpected disconnect
			this.close();
		});
		
		this.closed.connect(() => {
			this.ws.close();
		});
		
		this.state.set(ConnectionState.CONNECTED);
		
	}
	
	sendRaw(raw: Uint8Array): void {
		this.ws.send(raw);
	}
	
}

export class SocketServer<SocketType extends Socket> extends LocalMultiPeer<SocketType> {
	
	static WSS_ARGS: WebSocketServerOptions = {
		port: 5050,
		clientTracking: false
	};
	
	private wss: WebSocketServer;
	
	constructor(socketClass: { new(ws: WebSocket): SocketType }, wssArgs = SocketServer.WSS_ARGS) {
		
		super();
		
		this.wss = new WebSocketServer(wssArgs);
		
		this.connected.bindEvent(this.wss, "listening");
		this.disconnected.bindEvent(this.wss, "close");
		
		
		//this.wss.addListener(""
		
		this.wss.on("error", (error: Error) => {
			console.error(`SocketServer Error: ${error.cause}`);
		});
		
		this.wss.on("connection", (ws: WebSocket) => {
			this.addPeer(new socketClass(ws));
		});
		
		this.peerDisconnected.connect((peer: SocketType) => {
			this.dropPeer(peer);
		});
		
	}
	
/*	public bStart(): void {
		this.buffer.clear();
	}
	public bAddRaw(raw: Uint8Array): void {
		this.buffer.write(raw);
	}
	public bAdd(message: Message, data? : any): void {
		this.bAddRaw(this.createRaw(message, data));
	}
	public bSend(target: Socket | Array<Socket>): void {
		this.sendRaw(target, this.buffer.bytes);
	}*/
	
	
	//public createAcknowledgement(message: Message, sockets: Socket | Iterable<Socket>): Acknowledgement {
		//console.log(this, this.onMessage, this.addCallback);
		//return new Acknowledgement(this, message, sockets);
		
		/*return new Promise<Array<Packet>>((
			resolve: ((value: Array<Packet> | PromiseLike<Array<Packet>>) => void),
			reject: ((reason: any) => void)
		): void => {
			
			if (this.condition == null || (this.sockets.has(packet.socket) && this.condition(packet))) {
				
				this.sockets.delete(packet.socket);
				
				if (this.sockets.size == 0)
					this.complete();
				
			}
			
		});*/
		
	//}
	
}

//const wss = new WebSocket.Server({ port: 5050, WebSocket: WebSocketClient });


/*class Server {
	
	constructor(port) {
		
		this.wss = new WebSocket.Server({ port });
		
	}
	
}*/




/*wss.on("listening", () => {
	
});*/


/*wss.on("connection", (socket) => {
	
	console.log("Connection Established!");
	socket.client = new Client(socket, messageIndex);
	
	//socket.send("whee");
	
	socket.on("message", (data) => {
		
		
		console.log(data instanceof Uint8Array);
		socket.send(data);
		
		
	});
	
	socket.on("request", () => {
		
	});
	
	socket.on("close", () => {
		
	});
	
});*/
