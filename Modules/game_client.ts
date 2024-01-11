

import Signal from "./Core/signal"
import {
	
	TransferMode,
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	
	//LocalMonoPeer,
	//LocalMultiPeer,
	//RemotePeer,
	
} from "./Network/network"
import LocalMeshClient, { RemoteMeshClient } from "./Network/mesh_client"
import Arg from "./Network/arg"

import GameMessages, {
	GAME_CREATE_REQUEST,
	GAME_CREATE_RESPONSE,
	GAME_JOIN_REQUEST
} from "../MessageLists/game"


//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 

export class RemoteGameClient extends RemoteMeshClient {
	
	constructor() {
		
		super();
		
	}
	
}

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(RemoteGameClient, serverUrl, protocols);
		this.addServerMessages(GameMessages);
		
		console.log(this.getMessageID(GAME_CREATE_REQUEST));
		
		this.onServerMessage(GAME_CREATE_RESPONSE, (packet: Packet<void>) => {
			
			console.log(`Game created: ${packet.data}`);
			
			this.joinGame(packet.data);
			
		});
		
		this.socket.connected.connect(() => {
			this.createGame();
		});
		
	}
	
	createGame() {
		this.sendServer(GAME_CREATE_REQUEST);
	}
	joinGame(code: string) {
		this.sendServer(GAME_JOIN_REQUEST, code);
	}
	
	
	
}


