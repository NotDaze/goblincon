

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
	GAME_LOBBY_PLAYERS_LEFT,
	
	GAME_START
} from "../MessageLists/game_signaling"
import GameMessages, {
	DRAWING_DATA_CHUNK
} from "../MessageLists/game"

import SortedArray from "../Modules/Core/sorted_array";
import Canvas from "../Modules/Client/Rendering/canvas"


//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 

export class RemoteGameClient extends RemoteMeshClient {
	
	//public name: string;
	
	drawingFinished = new Signal<void>();
	
	private name = "";
	private drawings = new Map<number, Canvas>();
	
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
	gameStarted = this.gameState.transitionTo(GameState.ACTIVE);
	
	drawingStarted = new Signal<string>();
	drawingEnded = new Signal<void>();
	votingStarted = new Signal<void>();
	votingEnded = new Signal<void>();
	
	//gameDrawingStarted = new Signal<string>();
	//gameVotingStarted = new Signal<void>();
	
	
	private name = "";
	private code = "";
	
	private roundNumber = 1;
	
	private drawings = new Map<number, Canvas>();
	
	//private lobbyNames = new SortedArray();
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(RemoteGameClient, serverUrl, protocols);
		this.addServerMessages(GameSignalingMessages);
		this.addMessages(GameMessages);
		
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
		
		this.onServerMessage(GAME_START, packet => {
			//if (!this.gameState.is());
			this.gameState.set(GameState.ACTIVE);
		});
		
		
		
		
		
		this.addServerCondition([
			GAME_LOBBY_PLAYERS_JOINED,
			GAME_LOBBY_PLAYERS_LEFT
		], packet => {
			
			if (!this.gameState.is(GameState.LOBBY))
				return "Received lobby join/leave message while not in lobby.";
			
		});
		
		this.onServerMessage(GAME_LOBBY_PLAYERS_JOINED, packet => {
			
			for (const playerData of packet.data) {
				
				let player = this.getOrCreatePeer(playerData.id);
				
				if (player !== undefined) {
					player.setName(playerData.name);
					console.log(`Lobby Join: ${playerData.id}: ${playerData.name}`);
				}
				
			}
			
		});
		this.onServerMessage(GAME_LOBBY_PLAYERS_LEFT, packet => {
			
			for (const playerData of packet.data) {
				
				let player = this.getPeer(playerData.id);
				
				if (player)
					this.dropPeer(player);
				
			}
			
		});
		
		//this.meshLeft.connect();
		this.onMessage(DRAWING_DATA_CHUNK, packet => {
			
			
			
		});
		
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
	
	canStartGame(): boolean {
		return this.isHost()// && this.getPeerCount() >= 2;
	}
	startGame(): void {
		
		if (this.canStartGame())
			this.sendServer(GAME_START);
		
	}
	
	sendDrawingData(encoded: string): void {
		
		//this.drawings.set(this.roundNumber, Canvas.fromImageData(imageData));
		
		const MAX_CHUNK_SIZE = 16000;
		let next = 0;
		
		while (next < encoded.length) {
			
			let chunk_size = Math.min(encoded.length - next, MAX_CHUNK_SIZE);
			
			this.sendAll(DRAWING_DATA_CHUNK, {
				round: this.roundNumber,
				data: encoded.substring(next, next += chunk_size)
			});
			
		}
		
		/*let data = imageData.data;
		let next = 0;
		
		while (next < data.length) {
			
			let chunk_size = Math.min(data.length - next, MAX_CHUNK_SIZE);
			
			this.sendAll(DRAWING_DATA_CHUNK, {
				round: this.roundNumber,
				index: next,
				// This hurts my soul, but I think it's fine
				data: new Uint8Array(data.slice(next, next + chunk_size))
			});
			
			next += chunk_size;
			
		}*/
		
	}
	
	/*getPeerNames(): Array<string> {
		
		let peerNames = new Array<string>();
		
		for (const peer of this.peers)
			peerNames.push(peer.getName());
		
		return peerNames;
		
	}*/
	
}


