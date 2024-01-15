

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
	
	ROUND_START,
	
	DRAWING_START,
	DRAWING_END,
	DONE_DRAWING,
	
	LOADING_CHUNK,
	DONE_LOADING,
	
	VOTING_START,
	VOTING_END,
	DONE_VOTING,
	
	//VOTING_RESULTS,
} from "../MessageLists/game"

import SortedArray from "../Modules/Core/sorted_array";
import Canvas from "../Modules/Client/Rendering/canvas"
import { Message, Packet } from "../Modules/Network/network"

//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 

class PlayerPresence {
	
	
	private name = "<PlayerName>";
	private drawings = new Array<string>(); // round number -> data url
	
	getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}
	
	
	getDrawing(round: number): string | undefined {
		return this.drawings[round];
	}
	setDrawing(round: number, drawingData: string): void {
		this.drawings[round] = drawingData;
	}
	addDrawingChunk(round: number, chunk: string): void {
		
		if (this.drawings[round] === undefined)
			this.drawings[round] = chunk;
		else
			this.drawings[round] += chunk;
		
	}
	
	
	
	
}

export class RemoteGameClient extends RemoteMeshClient {
	
	playerState = new State(PlayerState.IDLE);
	
	doneDrawing = this.playerState.transitionFrom(PlayerState.DRAWING);
	doneVoting = this.playerState.transitionFrom(PlayerState.VOTING);
	doneLoading = this.playerState.transitionFrom(PlayerState.LOADING);
	
	presence = new PlayerPresence();
	
	
	//private name = "";
	//private drawings = new Map<number, Canvas>();
	
	constructor() {
		
		super();
		
		/*this.drawingFinished.connect(round => {
			console.log(this.presence.getDrawing(round));
		});*/
		
	}
	
	isHost(): boolean {
		return this.id === 0;
	}
	
	handleDrawingDataChunk(round: number, chunk: string, done: boolean) {
		
		if (!this.playerState.is(PlayerState.LOADING)) {
			console.error("Received drawing data chunk for client in invalid state.");
			return;
		}
		
		console.log("Receiving chunk! " + chunk.length + " | " + done);
		
		this.presence.addDrawingChunk(round, chunk);
		
		if (done) {
			this.playerState.set(PlayerState.IDLE);
			console.log(this.presence.getDrawing(round));
		}
		
	}
	
	/*getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}*/
	
}

export enum GameState {
	
	NONE,
	LOBBY,
	
	DRAWING,
	VOTING
	
}

export enum PlayerState {
	
	IDLE,
	LOADING,
	DRAWING,
	VOTING,
	
}



/*const ACTIVE_STATES = [
	GameState.DRAWING,
	GameState.VOTING
];*/

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	//gameJoined = new Signal<void>();
	//gameLeft = new Signal<void>();
	
	
	
	gameState = new State(GameState.NONE);
	playerState = new State(PlayerState.IDLE);
	//gamePhase = new State(GamePhase.NONE);
	
	gameJoined = this.gameState.transition(GameState.NONE, GameState.LOBBY);
	gameLeft = this.gameState.transitionTo(GameState.NONE);
	gameStarted = this.gameState.transition(GameState.LOBBY, GameState.DRAWING); // Will probably need to change
	
	drawingStarted = this.gameState.transitionTo(GameState.DRAWING);
	drawingEnded = this.gameState.transitionFrom(GameState.DRAWING);
	votingStarted = this.gameState.transitionTo(GameState.VOTING);
	votingEnded = this.gameState.transitionFrom(GameState.VOTING);
	
	doneDrawing = this.playerState.transitionFrom(PlayerState.DRAWING);
	doneVoting = this.playerState.transitionFrom(PlayerState.VOTING);
	doneLoading = this.playerState.transitionFrom(PlayerState.LOADING);
	
	lobbyPlayerListUpdate = new Signal<void>();
	
	
	
	
	//drawingStarted = new Signal<string>();
	//drawingEnded = new Signal<void>(); // Drawing phase done, for all players
	
	
	//votingStarted = new Signal<void>();
	//votingEnded = new Signal<void>();
	
	//gameDrawingStarted = new Signal<string>();
	//gameVotingStarted = new Signal<void>();
	
	readonly presence = new PlayerPresence();
	
	private code = "";
	private round = 0;
	
	// Host only
	private loadedPeers = new Set<RemoteGameClient>();
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(RemoteGameClient, serverUrl, protocols);
		this.addServerMessages(GameSignalingMessages);
		this.addMessages(GameMessages);
		
		this.initServerMessages();
		this.initClientMessages();
		
		this.connected.connect(() => {
			if (this.isHost() && this.gameState.is(GameState.LOBBY))
				this.gameState.set(GameState.DRAWING);
		});
		
		this.drawingStarted.connect(() => {
			
			this.playerState.set(PlayerState.DRAWING);
			
			for (const peer of this.peers)
				peer.playerState.set(PlayerState.DRAWING);
			
			if (this.isHost())
				this.sendAll(DRAWING_START);
			
		});
		this.drawingEnded.connect(() => {
			
			//if (this.isHost())
			//	this.sendAll(DRAWING_END);
			
		});
		this.votingStarted.connect(() => {
			
			this.playerState.set(PlayerState.VOTING);
			
			for (const peer of this.peers)
				peer.playerState.set(PlayerState.VOTING);
			
			if (this.isHost())
				this.sendAll(VOTING_START);
			
		});
		
		
	}
	private initServerMessages() {
		
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
			//this.gameState.set(GameState.DRAWING);
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
					player.presence.setName(playerData.name);
					console.log(`Lobby Join: ${playerData.id}: ${playerData.name}`);
				}
				
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
		
	}
	private initClientMessages() {
		
		
		
		this.onMessage(LOADING_CHUNK, packet => {
			
			//console.log(packet.data.data);
			packet.peer.handleDrawingDataChunk(this.round, packet.data.data, packet.data.done);
			this.checkDoneLoading();
			
		});
		
		this.addCondition([
			ROUND_START,
			DRAWING_START,
			DRAWING_END,
			VOTING_START,
			VOTING_END
		], packet => {
			
			if (!packet.peer.isHost())
				return "Host message sent by non-host peer.";
			
		});
		
		this.addCondition([
			//DONE_DRAWING,
			DONE_LOADING
			//DONE_VOTING
		], packet => {
			
			if (!this.isHost())
				return "Host message sent to non-host peer.";
			
		});
		
		this.onMessage(ROUND_START, packet => {
			console.log(`Round Started: ${packet.data}`);
			this.round = packet.data;
		});
		this.onMessage(DRAWING_START, packet => {
			this.gameState.set(GameState.DRAWING);
		});
		this.onMessage(DRAWING_END, packet => {
			//this.gameState.set(GameState.LOADING);
			
		});
		this.onMessage(VOTING_START, packet => {
			this.gameState.set(GameState.VOTING);
		});
		this.onMessage(VOTING_END, packet => {
			
		});
		
		this.onMessage(DONE_LOADING, packet => {
			
			if (!this.gameState.any(GameState.DRAWING))
				return;
			//if (!packet.peer.playerState.is(PlayerState.LOADING))
			//	return;
			
			//packet.peer.playerState.set(PlayerState.IDLE);
			this.loadedPeers.add(packet.peer);
			//this.checkDoneLoading();
			
			if (this.isHost())
				this.checkAllDoneLoading();
			
		});
		this.doneLoading.connect(() => {
			
			console.log("Done loading");
			this.sendHost(DONE_LOADING);
			
			if (this.isHost())
				this.checkAllDoneLoading();
			
		});
		
		
		this.onMessage(DONE_DRAWING, packet => {
			
			if (!packet.peer.playerState.is(PlayerState.DRAWING))
				return;
			
			packet.peer.playerState.set(PlayerState.LOADING);
			
		});
		this.onMessage(DONE_VOTING, packet => {
			
		});
		
		this.doneDrawing.connect(() => {
			console.log("Done drawing");
			this.sendAll(DONE_DRAWING);
			this.checkDoneLoading();
		});
		this.doneVoting.connect(() => {
			this.sendAll(DONE_VOTING);
		});
		
		
		
	}
	
	isHost(): boolean {
		return this.id === 0;
	}
	getHost(): RemoteGameClient | undefined {
		return this.getPeer(0);
	}
	private sendHost<T>(message: Message<T>, data?: T): void {
		
		let host = this.getHost();
		
		if (host !== undefined)
			this.send(host, message, data);
		
	}
	
	allPeersIdle(): boolean {
		
		//if (!this.playerState.is(PlayerState.IDLE))
		//	return false;
		
		for (const peer of this.getPeers())
			if (!peer.playerState.is(PlayerState.IDLE))
				return false;
		
		return true;
		
	}
	
	/*getGameName(): string {
		return this.presence.name;
	}*/
	getRound(): number {
		return this.round;
	}
	getGameCode(): string {
		return this.code;
	}
	
	private handleJoined(id: number, name: string, code: string): void {
		
		if (!this.gameState.is(GameState.NONE))
			console.error("GameClient joined a game while already in one...");
		
		this.setID(id); // Kind of a hack
		//this.name = name;
		this.presence.setName(name);
		this.code = code;
		
		//this.inGame = true;
		//this.gameJoined.emit();
		this.gameState.set(GameState.LOBBY);
		
	}
	private handleLeft(): void {
		
		//if (!this.inGame)
		//	return;
		this.setID(-1);
		this.gameState.set(GameState.NONE);
		
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
	
	checkDoneLoading(): void {
		
		if (this.gameState.is(GameState.DRAWING) && this.playerState.is(PlayerState.LOADING))
			if (this.allPeersIdle())
				this.playerState.set(PlayerState.IDLE);
		
	}
	checkAllDoneLoading(): void {
		
		if (!this.isHost())
			return;
		
		if (!this.gameState.is(GameState.DRAWING) || !this.playerState.is(PlayerState.IDLE))
			return;
		
		if (this.loadedPeers.size >= this.getPeerCount()) {
			this.loadedPeers.clear();
			this.gameState.set(GameState.VOTING);
			console.log("All done loading");
		}
		
	}
	
	handleDoneDrawing(): void {
		
		if (this.playerState.is(PlayerState.DRAWING))
			this.playerState.set(PlayerState.LOADING);
		
		//console.error("LocalGameClient.handleDoneDrawing() when not drawing.");
		
	}
	handleDrawingData(encoded: string): void {
		
		//this.drawings.set(this.roundNumber, Canvas.fromImageData(imageData));
		//this.drawings.set(this.roundNumber, Canvas.fromImageData(imageData));
		
		/*if (!this.playerState.is(PlayerState.DRAWING)) {
			return;
		}
		
		this.playerState.set(PlayerState.LOADING);*/
		//this.drawings.set()
		this.presence.setDrawing(this.round, encoded);
		
		const MAX_CHUNK_SIZE = 16000;
		let next = 0;
		
		while (next < encoded.length) {
			
			let chunk_size = Math.min(encoded.length - next, MAX_CHUNK_SIZE);
			
			console.log("Sending chunk!");
			
			this.sendAll(LOADING_CHUNK, {
				//round: this.roundNumber,
				data: encoded.substring(next, next += chunk_size),
				done: (next >= encoded.length)
			});
			
		}
		
		
		
	}
	
	
	/*getPeerNames(): Array<string> {
		
		let peerNames = new Array<string>();
		
		for (const peer of this.peers)
			peerNames.push(peer.getName());
		
		return peerNames;
		
	}*/
	
}


