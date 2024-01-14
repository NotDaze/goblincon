

import Signal from "../Modules/Core/signal"
/*import {
	
	TransferMode,
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	
	//LocalMonoPeer,
	//LocalMultiPeer,
	//RemotePeer,
	
} from "../Modules/Network/network"*/
import LocalMeshClient, { RemoteMeshClient } from "../Modules/Network/mesh_client"
//import Arg from "../Modules/Network/arg"
import State from "../Modules/Core/state"

import GameSignalingMessages, {
	GAME_CREATE,
	GAME_JOIN,
	GAME_JOINED,
	GAME_LOBBY_PLAYERS_JOINED,
	GAME_LOBBY_PLAYERS_LEFT
} from "../MessageLists/game_signaling"
import SortedArray from "../Modules/Core/sorted_array";


//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 

export class RemoteGameClient extends RemoteMeshClient {
	
	//public name: string;
	
	private name = "";
	
	constructor() {
		
		super();
		
	}
	
	isHost(): boolean {
		return this.id === 0;
	}
	
	getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}
	
}

export enum GameState {
	IDLE,
	LOBBY,
	ACTIVE
}

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	//gameJoined = new Signal<void>();
	//gameLeft = new Signal<void>();
	
	gameState = new State(GameState.IDLE);
	
	gameJoined = this.gameState.transitionTo(GameState.LOBBY);
	gameLeft = this.gameState.transitionTo(GameState.IDLE);
	
	lobbyPlayerListUpdate = new Signal<void>();
	
	private name: string = "";
	private code: string = "";
	
	//private lobbyNames = new SortedArray();
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(RemoteGameClient, serverUrl, protocols);
		this.addServerMessages(GameSignalingMessages);
		
		this.onServerMessage(GAME_JOINED, packet => {
			
			if (packet.data === undefined) {
				console.log("Game join failed...");
				this.handleLeft(); // Poorly named
			}
			else {
				console.log(`Game joined: ${packet.data.code}`);
				this.handleJoined(packet.data.id, packet.data.name, packet.data.code);
			}
			
		});
		
		this.onServerMessage(GAME_LOBBY_PLAYERS_JOINED, packet => {
			
			for (const playerData of packet.data) {
				
				let player = this.getOrCreatePeer(playerData.id);
				player?.setName(playerData.name);
				
			}
			
			this.lobbyPlayerListUpdate.emit();
			
		});
		this.onServerMessage(GAME_LOBBY_PLAYERS_LEFT, packet => {
			
			for (const playerData of packet.data) {
				
				let player = this.getPeer(playerData.id);
				
				if (player)
					this.dropPeer(player);
				
			}
			
			this.lobbyPlayerListUpdate.emit();
			
		});
		
		//this.meshLeft.connect();
		
		
	}
	
	isHost(): boolean {
		return this.id === 0;
	}
	
	getGameName(): string {
		return this.name;
	}
	getGameCode(): string {
		return this.code;
	}
	
	private handleJoined(id: number, name: string, code: string): void {
		
		if (!this.gameState.is(GameState.IDLE))
			console.error("GameClient joined a game while already in one...");
		
		this.setID(id); // Kind of a hack
		this.name = name;
		this.code = code;
		
		//this.inGame = true;
		//this.gameJoined.emit();
		this.gameState.set(GameState.LOBBY);
		
	}
	private handleLeft(): void {
		
		//if (!this.inGame)
		//	return;
		this.setID(-1);
		this.gameState.set(GameState.IDLE);
		
	}
	
	createGame(name: string): void {
		this.sendServer(GAME_CREATE, { name });
	}
	joinGame(name: string, code: string): void {
		this.sendServer(GAME_JOIN, { name, code: code.toUpperCase() });
	}
	
	getPeerNames(): Array<string> {
		
		let peerNames = new Array<string>();
		
		for (const peer of this.peers)
			peerNames.push(peer.getName());
		
		return peerNames;
	
	}
	
}


