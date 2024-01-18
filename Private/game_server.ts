
//import Signal from "../Modules/Core/signal";

import Arg from "../Modules/Network/arg";
import {
	
	ConnectionState,
	
	//Message,
	//MessageDomain,
	//MessageHandler,
	Packet,
	Message,
	
	RemotePeerIndex,
	//LocalMultiPeer,
	//RemotePeer,
	
	Group,
	MultiPeerConnectionStatus,
	
} from "../Modules/Network/network"

import TwoWayMap from '../Modules/Core/two_way_map';
import SignalingServer, { SignalingSocket, Mesh } from "../Modules/Network/signaling_server";
import GameSignalingMessages, {
	
	GAME_INIT_ERROR,
	
	GAME_CREATE,
	GAME_JOIN,
	GAME_JOINED,
	
	GAME_LOBBY_PLAYERS_JOINED,
	GAME_LOBBY_PLAYERS_LEFT,
	
	GAME_START,
	
} from "../MessageLists/game_signaling";
import {
	MIN_PLAYER_COUNT,
	MAX_PLAYER_COUNT,
	MIN_NAME_LENGTH,
	MAX_NAME_LENGTH,
	CODE_LENGTH
} from "../MessageLists/game_signaling"


/*export class Game { // We do not actually even need this wrapper, do we
	
	private mesh: Mesh<GameSocket>;
	private code: string;
	
	constructor(mesh: Mesh<GameSocket>, code = Game.generateCode()) {
		
		this.mesh = mesh;
		this.code = code;
		
	}
	
	static generateCode(length = 5): string {
		
		// 
		const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let code = "";
		
		for (let i = 0; i < length; i++)
			code += chars[Math.floor(Math.random() * chars.length)];
		
		return code;
		
	}
	
	public getCode(): string {
		return this.code;
	}
	
	
}*/

export class GameSocket extends SignalingSocket {
	
	private name = "";
	
	getName(): string {
		return this.name;
	}
	setName(name: string): void {
		
		name = name.trim();
		
		if (name.length < MIN_NAME_LENGTH)
			this.name = "Player";
		else
			this.name = name.substring(0, MAX_NAME_LENGTH);
		
	}
	
	isHost(): boolean {
		return this.meshID === 0;
	}
	
}

export default class GameServer extends SignalingServer<GameSocket> {
	
	//games = new TwoWayMap<String, Mesh<GameSocket>>();
	
	// Maybe could merge these or use a TwoWayMap
	private games = new TwoWayMap<Mesh<GameSocket>, string>();
	//private hosts = new Map<Mesh<GameSocket>, GameSocket>();
	
	
	constructor(wssArgs = GameServer.WSS_ARGS) {
		
		super(GameSocket, wssArgs);
		this.addMessages(GameSignalingMessages);
		
		this.meshCreated.connect((mesh: Mesh<GameSocket>) => {
			
			mesh.peersAdded.connect(peers => {
				
				if (!mesh.state.is(ConnectionState.NEW)) {
					console.log("Player attempted to join lobby after game start.");
					return;
				}
				
				for (const peer of peers)
					this.send(peer, GAME_JOINED, { id: peer.getMeshID(), name: peer.getName(), code: this.games.get(mesh) });
				
				// Tell new peer about existing ones, and tell existing peers about the new one
				let joinData = new Array<{ id: number, name: string }>();
				let existingPeerData = new Array<{ id: number, name: string }>();
				
				for (const peer of peers)
					joinData.push({ id: peer.getMeshID(), name: peer.getName() });
				
				for (const peer of mesh.getPeers()) {
					
					existingPeerData.push({ id: peer.getMeshID(), name: peer.getName() });
					
					if (!peers.includes(peer))
						this.send(peer, GAME_LOBBY_PLAYERS_JOINED, joinData);
					
				}
				
				this.send(peers, GAME_LOBBY_PLAYERS_JOINED, existingPeerData);
				
			});
			
			mesh.peersLeaving.connect(peers => {
				
				if (mesh.state.is(ConnectionState.NEW)) {
					
					let leaveData = new Array<{id: number}>();
					
					for (const peer of peers)
						leaveData.push({ id: peer.getMeshID() });
					for (const peer of mesh.getPeers())
						this.send(peer, GAME_LOBBY_PLAYERS_LEFT, leaveData);
					
				}
				
			});
			
		});
		
		this.meshDestroyed.connect((mesh: Mesh<GameSocket>) => {
			this.games.delete(mesh);
		});
		
		/*this.peerAdded.connect(peer => {
			
		});
		this.peerDisconnected.connect(peer => {
			
		});
		this.peerDropped.connect(peer => {
			
		});*/
		
		this.addCondition([
			GAME_CREATE,
			GAME_JOIN
		], packet => {
			
			if (this.getPeerMesh(packet.peer) !== undefined) {
				this.send(packet.peer, GAME_INIT_ERROR, "Already in a game");
				return "Peer that is in a mesh attempted to create or join another.";
			}
			
		});
		
		
		this.onMessage(GAME_CREATE, packet => {
			
			let mesh = this.createMesh();
			let code = this.generateGameCode();
			
			this.games.set(mesh, code);
			this.lobbyJoin(mesh, packet.peer, packet.data.name);
			
		});
		
		this.onMessage(GAME_JOIN, packet => {
			
			//let code = packet.data.code;
			let mesh = this.games.reverseGet(packet.data.code);
			
			if (mesh === undefined || !mesh.state.is(ConnectionState.NEW))
				this.send(packet.peer, GAME_INIT_ERROR, "Invalid join code");
			else if (mesh.getPeerCount() >= MAX_PLAYER_COUNT)
				this.send(packet.peer, GAME_INIT_ERROR, "Game full");
			else
				this.lobbyJoin(mesh, packet.peer, packet.data.name);
			
		});
		
		this.onMessage(GAME_START, packet => {
			
			let mesh = this.getPeerMesh(packet.peer);
			
			if (mesh !== undefined && packet.peer.isHost() && mesh.state.is(ConnectionState.NEW)) {
				
				if (mesh.getPeerCount() >= MIN_PLAYER_COUNT) {
					mesh.attemptInitialize();
					mesh.sendAll(GAME_START);
				}
				/*else {
					this.send(packet.peer, GAME_INIT_ERROR, "");
				}*/
				
			}
			
		});
		
	}
	
	lobbyJoin(mesh: Mesh<GameSocket>, peer: GameSocket, name: string): void {
		
		//this.send(peer, GAME_JOINED, { id: peer.getMeshID(), name, code });
		peer.setName(name);
		mesh.add(peer);
		
	}
	lobbyLeave(mesh: Mesh<GameSocket>, peer: GameSocket): void {
		
		mesh.remove(peer);
		//this.send(peer, GAME_DISCONNECT);
		
		const leaveData = [ { id: peer.getMeshID() } ];
		
		for (const peer of mesh.getPeers())
			this.send(peer, GAME_LOBBY_PLAYERS_LEFT, leaveData);
		
	}
	
	generateGameCode(length = CODE_LENGTH): string {
		
		const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let code = "";
		
		for (let i = 0; i < length; i++)
			code += chars[Math.floor(Math.random() * chars.length)];
		
		// Retry on collision. Dumb, but it works
		if (this.games.reverseHas(code))
			return this.generateGameCode(length);
		
		return code;
		
	}
	
	getMeshHost(mesh: Mesh<GameSocket>): GameSocket {
		
		let host = mesh.getPeer(0);
		
		if (!host)
			throw new Error("Invalid Mesh host.");
		
		return host;
		
	}
	
	/*meshFromCode(code: string): Mesh<GameSocket> | undefined {
		return this.games.get(code);
	}
	codeFromMesh(mesh: Mesh<GameSocket>): string | undefined {
		return this.games.reverseGet(mesh);
	}*/
	
	
	
}


/*export class GameSocket extends SignalingSocket {
	
	
	
}

export default class GameServer extends SignalingServer {
	
	
	
	
}*/








