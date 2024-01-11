

import Signal from "../Modules/Core/signal"
import {
	
	TransferMode,
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	
	//LocalMonoPeer,
	//LocalMultiPeer,
	//RemotePeer,
	
} from "../Modules/Network/network"
import LocalMeshClient, { RemoteMeshClient } from "../Modules/Network/mesh_client"
import Arg from "../Modules/Network/arg"

import GameSignalingMessages, {
	GAME_CREATE_REQUEST,
	GAME_CREATE_RESPONSE,
	GAME_JOIN_REQUEST
} from "../MessageLists/game_signaling"


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
		this.addServerMessages(GameSignalingMessages);
		
		this.onServerMessage(GAME_CREATE_RESPONSE, packet => {
			
			console.log(`Game created: ${packet.data}`);
			
			//this.joinGame(packet.data);
			
		});
		
		
		
	}
	
	createGame() {
		this.sendServer(GAME_CREATE_REQUEST);
	}
	joinGame(code: string) {
		this.sendServer(GAME_JOIN_REQUEST, code);
	}
	
	
	
}


