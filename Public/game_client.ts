

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
import { Message, Packet } from "../Modules/Network/network"

import GameSignalingMessages, {
	
	GAME_CREATE,
	GAME_JOIN,
	GAME_JOINED,
	
	GAME_LOBBY_PLAYERS_JOINED,
	GAME_LOBBY_PLAYERS_LEFT,
	
	GAME_START,
	
	
	MIN_PLAYER_COUNT,
	//MAX_PLAYER_COUNT,
	
	
} from "../MessageLists/game_signaling"
import GameMessages, {
	
	ROUND_START,
	
	DRAWING_START,
	DRAWING_TIMEOUT,
	//DRAWING_END,
	DONE_DRAWING,
	
	LOADING_CHUNK,
	DONE_LOADING,
	
	VOTING_START,
	//VOTING_END,
	VOTING_CHOICE,
	DONE_VOTING,
	
	SCORING_START,
	
	//VOTING_RESULTS,
} from "../MessageLists/game"

import CreatureNames from "./creature_names"

//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 

export enum GameState {
	
	NONE,
	LOBBY,
	
	DRAWING,
	VOTING,
	SCORING,
	
}

export enum PlayerState {
	
	IDLE,
	LOADING,
	DRAWING,
	VOTING
	
}

class PlayerPresence {
	
	
	private name = "<PlayerName>";
	private drawings = new Array<string>(); // round number -> data url
	private votes = new Array<number>();
	
	getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}
	
	hasDrawing(round: number): boolean {
		return this.drawings[round] !== undefined;
	}
	getDrawing(round: number): string | undefined {
		return this.drawings[round];
	}
	setDrawing(round: number, data: string): void {
		this.drawings[round] = data;
	}
	
	hasVote(round: number): boolean {
		return this.votes[round] !== undefined;
	}
	getVote(round: number): number | undefined {
		return this.votes[round];
	}
	setVote(round: number, id: number): void {
		this.votes[round] = id;
	}
	
	/*getCompletedDrawingCount(): number {
		return this.drawings.length - 1;
	}
	hasCompletedDrawing(round: number): boolean {
		return round <= this.getCompletedDrawingCount();
	}*/
	
}

export class RemoteGameClient extends RemoteMeshClient {
	
	playerState = new State(PlayerState.IDLE);
	
	doneDrawing = this.playerState.transitionFrom(PlayerState.DRAWING);
	doneVoting = this.playerState.transitionFrom(PlayerState.VOTING);
	doneLoading = this.playerState.transitionFrom(PlayerState.LOADING);
	
	presence = new PlayerPresence();
	
	
	//private name = "";
	//private drawings = new Map<number, Canvas>();
	
	private currentDrawingRound = 0;
	private currentDrawing: Array<string> = [];
	
	constructor(config?: RTCConfiguration) {
		
		super(config);
		
		/*this.drawingFinished.connect(round => {
			console.log(this.presence.getDrawing(round));
		});*/
		
	}
	
	isHost(): boolean {
		return this.id === 0;
	}
	
	handleDrawingDataChunk(round: number, index: number, count: number, chunk: string) {
		
		if (round !== this.currentDrawingRound) {
			console.error("Received drawing data chunk for drawing from an invalid round.");
			return;
		}
		if (!this.playerState.any(PlayerState.DRAWING, PlayerState.LOADING, PlayerState.IDLE)) {
			console.error("Received drawing data chunk from client in invalid state.");
			return;
		}
		
		console.log(`Receiving chunk! ${index+1}/${count} (${chunk.length})`);
		this.currentDrawing[index] = chunk;
		
		for (let i = 0; i < count; i++) {
			if (this.currentDrawing[i] === undefined)
				return;
		}
		
		// We have the entire drawing
		let stitched = this.currentDrawing[0];
		
		for (let i = 1; i < count; i++)
			stitched += this.currentDrawing[i];
		
		this.presence.setDrawing(round, stitched);
		
		this.currentDrawing = [];
		this.currentDrawingRound++;
		
		
	}
	
	/*getName(): string {
		return this.name;
	}
	setName(name: string): void {
		this.name = name;
	}*/
	
}





/*const ACTIVE_STATES = [
	GameState.DRAWING,
	GameState.VOTING
];*/

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	//gameJoined = new Signal<void>();
	//gameLeft = new Signal<void>();
	
	static DRAWING_TIME = 60e3;
	static LOADING_TIME = 5e3;
	static VOTING_TIME = 10e3;
	static SCORING_TIME = 5e3;
	
	gameState = new State(GameState.NONE);
	playerState = new State(PlayerState.IDLE);
	//gamePhase = new State(GamePhase.NONE);
	
	gameJoined = this.gameState.transition(GameState.NONE, GameState.LOBBY);
	gameLeft = this.gameState.transitionTo(GameState.NONE);
	gameStarted = this.gameState.transition(GameState.LOBBY, GameState.DRAWING); // Will probably need to change
	
	drawingStarted = this.gameState.transitionTo(GameState.DRAWING);
	//drawingEnded = this.gameState.transitionFrom(GameState.DRAWING);
	votingStarted = this.gameState.transitionTo(GameState.VOTING);
	//votingEnded = this.gameState.transitionFrom(GameState.VOTING);
	scoringStarted = this.gameState.transitionTo(GameState.SCORING);
	
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
	
	private creatureNames = new Array<string>();
	
	private phaseTimerTimeout?: NodeJS.Timeout;
	
	constructor(serverUrl: string, protocols: Array<string> = [], rtcConfig = RemoteMeshClient.DEFAULT_CONFIG) {
		
		super(RemoteGameClient, serverUrl, protocols, rtcConfig);
		this.addServerMessages(GameSignalingMessages);
		this.addMessages(GameMessages);
		
		this.initServerMessages();
		this.initClientMessages();
		this.initNonHostMessages();
		this.initHostMessages();
		this.initSignals();
		
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
			packet.peer.handleDrawingDataChunk(this.round, packet.data.index, packet.data.count, packet.data.data);
			this.checkDoneLoading();
			
		});
		
		
		this.onMessage(DONE_DRAWING, packet => {
			
			if (!packet.peer.playerState.is(PlayerState.DRAWING))
				return;
			
			packet.peer.playerState.set(PlayerState.LOADING);
			
		});
		this.onMessage(DONE_LOADING, packet => {
			
			if (!packet.peer.playerState.is(PlayerState.LOADING))
				return;
			
			packet.peer.playerState.set(PlayerState.IDLE);
			
			if (this.isHost())
				this.checkAllDoneLoading();
			
		});
		this.onMessage(DONE_VOTING, packet => {
			
			if (!packet.peer.playerState.is(PlayerState.VOTING))
				return;
			
			packet.peer.playerState.set(PlayerState.IDLE);
			
		});
		
		
		
		
		
		
	}
	private initNonHostMessages() {
		
		this.addCondition([
			ROUND_START,
			DRAWING_START,
			VOTING_START,
			SCORING_START
		], (packet: Packet<RemoteGameClient, any>) => {
			
			if (!packet.peer.isHost())
				return "Host message sent by non-host peer.";
			
		});
		
		this.onMessage(ROUND_START, packet => {
			console.log(`Round Started: ${packet.data}`);
			this.round = packet.data;
		});
		this.onMessage(DRAWING_START, packet => {
			this.setCreatureName(this.round, packet.data);
			this.gameState.set(GameState.DRAWING);
		});
		this.onMessage(DRAWING_TIMEOUT, packet => {
			this.playerState.set(PlayerState.LOADING);
		});
		this.onMessage(VOTING_START, packet => {
			this.gameState.set(GameState.VOTING);
		});
		this.onMessage(SCORING_START, packet => {
			
			//console.log(packet.data);
			
			for (const [peer, vote] of packet.data)
				this.getPeer(peer)?.presence.setVote(this.round, vote);
			
			this.gameState.set(GameState.SCORING);
			
		});
		
	}
	private initHostMessages() {
		
		this.addCondition([
			//DONE_DRAWING,
			//DONE_LOADING,
			//DONE_VOTING,
			VOTING_CHOICE,
		], packet => {
			
			if (!this.isHost())
				return "Host message sent to non-host peer.";
			
		});
		
		this.onMessage(VOTING_CHOICE, packet => {
			
			//if (!packet.peer.)
			
			console.log(`${packet.peer.getID()} voted for ${packet.data}`);
			packet.peer.presence.setVote(this.round, packet.data);
			
			this.checkAllDoneVoting();
			
		});
		
	}
	private initSignals() {
		
		this.connected.connect(() => {
			if (this.isHost() && this.gameState.is(GameState.LOBBY))
				this.gameState.set(GameState.DRAWING);
		});
		
		this.drawingStarted.connect(() => {
			
			this.setAllPlayerStates(PlayerState.DRAWING);
			
			if (this.isHost()) {
				
				let creatureName = this.pickCreatureName();
				this.setCreatureName(this.round, creatureName);
				this.sendAll(DRAWING_START, creatureName);
				
				this.setPhaseTimer(LocalGameClient.DRAWING_TIME, () => {
					// should consider stopping people from submitting after this
					this.sendAll(DRAWING_TIMEOUT);
					this.playerState.set(PlayerState.LOADING);
					
					this.setPhaseTimer(LocalGameClient.LOADING_TIME, () => {
						this.gameState.set(GameState.VOTING);
					});
					
				});
				
			}
			
		});
		this.votingStarted.connect(() => {
			
			this.setAllPlayerStates(PlayerState.VOTING);
			
			if (this.isHost()) {
				this.sendAll(VOTING_START);
				
				this.setPhaseTimer(
					LocalGameClient.VOTING_TIME,
					() => this.gameState.set(GameState.SCORING)
				);
				
			}
			
		});
		this.scoringStarted.connect(() => {
			
			this.setAllPlayerStates(PlayerState.IDLE);
			
			if (this.isHost()) {
				
				this.clearPhaseTimer();
				this.sendAll(SCORING_START, this.getVoteResults());
				
				this.setPhaseTimer(
					LocalGameClient.SCORING_TIME,
					() => {
						this.sendAll(ROUND_START, ++this.round);
						this.gameState.set(GameState.DRAWING);
					}
				);
				
			}
			
		});
		
		this.doneDrawing.connect(() => {
			
			console.log("Done drawing");
			this.sendAll(DONE_DRAWING);
			
			 // May have already received all drawing data
			this.checkDoneLoading();
			
		});
		this.doneLoading.connect(() => {
			
			console.log("Done loading");
			this.sendAll(DONE_LOADING);
			
			if (this.isHost())
				this.checkAllDoneLoading();
			
		});
		this.doneVoting.connect(() => {
			
			console.log("Done voting");
			this.sendAll(DONE_VOTING);
			
			if (this.isHost())
				this.checkAllDoneVoting();
			
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
	private sendAllExceptHost<T>(message: Message<T>, data?: T): void {
		
		let host = this.getHost();
		
		if (host === undefined)
			this.sendAll(message, data);
		else
			this.sendAllExcept(host, message, data);
		
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
	/**getPresences(): Iterable<PlayerPresence> {
		
		yield this.presence;
		
		for (const peer of this.getPeers())
			yield peer.presence;
		
	}*/
	*getPresences(): Iterable<[id: number, presence: PlayerPresence]> {
		
		yield [this.getID(), this.presence];
		
		for (const peer of this.peers)
			yield [peer.getID(), peer.presence];
		
	}
	getPresence(id: number): PlayerPresence | undefined {
		
		if (id === this.id)
			return this.presence;
		
		return this.getPeer(id)?.presence;
		
	}
	
	setAllPlayerStates(newState: PlayerState): void {
		
		this.playerState.set(newState);
		
		for (const peer of this.getPeers())
			peer.playerState.set(newState);
		
	}
	allPeersIdle(): boolean {
		
		//if (!this.playerState.is(PlayerState.IDLE))
		//	return false;
		
		for (const peer of this.getPeers())
			if (!peer.playerState.is(PlayerState.IDLE))
				return false;
		
		return true;
		
	}
	
	hasAllDrawings(): boolean {
		
		for (const peer of this.getPeers())
			if (!peer.presence.hasDrawing(this.round))
				return false;
		
		return true;
		
	}
	
	pickCreatureName(): string {
		return CreatureNames[Math.floor(Math.random() * CreatureNames.length)];
	}
	setCreatureName(round: number, name: string): void {
		this.creatureNames[round] = name;
	}
	getCreatureName(round = this.round): string {
		return this.creatureNames[round] === undefined ? "Jeremy" : this.creatureNames[round];
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
	
	requestCreate(name: string): void {
		this.sendServer(GAME_CREATE, { name });
	}
	requestJoin(name: string, code: string): void {
		this.sendServer(GAME_JOIN, { name, code: code.toUpperCase() });
	}
	
	canStartGame(): boolean {
		
		if (!this.isHost())
			return false;
		
		return this.isHost() && (this.getPeerCount() + 1) >= MIN_PLAYER_COUNT;
		
	}
	startGame(): void {
		
		if (this.canStartGame())
			this.sendServer(GAME_START);
		
	}
	
	setPhaseTimer(ms: number, callback: () => void): void {
		
		this.clearPhaseTimer();
		this.phaseTimerTimeout = setTimeout(callback, ms);
		
	}
	clearPhaseTimer(): void {
		clearInterval(this.phaseTimerTimeout);
	}
	
	checkDoneLoading(): void {
		
		if (this.gameState.is(GameState.DRAWING) && this.playerState.is(PlayerState.LOADING))
			if (this.hasAllDrawings())
				this.playerState.set(PlayerState.IDLE);
		
	}
	checkAllDoneLoading(): void {
		
		if (!this.isHost())
			return;
		
		if (!this.gameState.is(GameState.DRAWING) || !this.playerState.is(PlayerState.IDLE))
			return;
		
		if (this.allPeersIdle()) {
			this.gameState.set(GameState.VOTING)
			console.log("All done loading");
		}
		
	}
	checkAllDoneVoting(): void {
		
		if (!this.isHost())
			return;
		
		if (!this.gameState.is(GameState.VOTING))
			return;
		
		for (const [,presence] of this.getPresences())
			if (!presence.hasVote(this.round))
				return;
		
		// Has all votes
		this.gameState.set(GameState.SCORING);
		console.log("All done voting");
		
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
		const CHUNK_COUNT = Math.ceil(encoded.length/MAX_CHUNK_SIZE);
		
		for (let i = 0; i < CHUNK_COUNT; i++) {
			
			let data = encoded.substring(
				i * MAX_CHUNK_SIZE,
				(i + 1) * MAX_CHUNK_SIZE
			); 
			
			this.sendAll(LOADING_CHUNK, {
				data: data,
				index: i,
				count: CHUNK_COUNT
			});
			
		}
		
		/*while (index < ch) {
			
			let chunk_size = Math.min(encoded.length - next, MAX_CHUNK_SIZE);
			
			console.log("Sending chunk!");
			
			this.sendAll(LOADING_CHUNK, {
				//round: this.roundNumber,
				data: encoded.substring(next, next += chunk_size),
				index: (next >= encoded.length)
			});
			
		}*/
		
		
		
	}
	
	submitVote(playerID: number): void {
		
		if (!this.playerState.is(PlayerState.VOTING)) {
			console.error("Player voted while in invalid state.");
			return;
		}
		
		if (!this.hasPeerID(playerID)) {
			console.error("Player submitted invalid vote.");
			return;
		}
		
		this.presence.setVote(this.round, playerID);
		
		this.playerState.set(PlayerState.IDLE);
		this.sendHost(VOTING_CHOICE, playerID);
		
	}
	
	getVoteResults(round = this.round): Map<number, number> {
		
		let results = new Map<number, number>();
		
		for (const [id, presence] of this.getPresences()) {
			
			let vote = presence.getVote(round);
			
			if (vote === undefined) // May want an error message, but probably not
				continue;
			
			results.set(id, vote);
			
		}
		
		return results;
		
	}
	getVoteCount(id: number, round = this.round): number {
		
		let count = 0;
		
		for (const [,presence] of this.getPresences())
			if (presence.getVote(round) === id)
				count++;
		
		return count;
		
	}
	/*getVoteCounts(round = this.round): Map<number, number> {
		
		for (const [id, presence] of this.getPresences()) {
			
			if (presence.hasVote(this.round)) {
			
			}
		}
		
		
	}*/
	
	/*getPeerNames(): Array<string> {
		
		let peerNames = new Array<string>();
		
		for (const peer of this.peers)
			peerNames.push(peer.getName());
		
		return peerNames;
		
	}*/
	
}


