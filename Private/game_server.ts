
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
	GAME_CREATE_REQUEST,
	GAME_CREATE_RESPONSE,
	GAME_JOIN_REQUEST
} from "../MessageLists/game_signaling";


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
	
	
	
}

export default class GameServer extends SignalingServer<GameSocket> {
	
	//games = new TwoWayMap<String, Mesh<GameSocket>>();
	
	// Maybe could merge these or use a TwoWayMap
	private games = new TwoWayMap<string, Mesh<GameSocket>>();
	
	
	constructor(wssArgs = GameServer.WSS_ARGS) {
		
		super(GameSocket, wssArgs);
		this.addMessages(GameSignalingMessages);
		
		this.meshCreated.connect((mesh: Mesh<GameSocket>) => {
			
			/*let creator: GameSocket | undefined = mesh.getPeer(0);
			
			if (creator === undefined)
				throw new Error("");
			
			let code = this.generateGameCode();
			
			this.games.set(code, mesh);
			this.send(creator, GAME_CREATE_RESPONSE, code);*/
			
		});
		
		this.meshDestroyed.connect((mesh: Mesh<GameSocket>) => {
			this.games.reverseDelete(mesh);
		});
		
		
		this.onMessage(GAME_CREATE_REQUEST, packet => {
			
			let mesh = this.createMesh(packet.peer);
			let code = this.generateGameCode();
			
			this.games.set(code, mesh);
			
			this.send(packet.peer, GAME_CREATE_RESPONSE, code);
			
		});
		
		this.onMessage(GAME_JOIN_REQUEST, packet => {
			
			if (this.getPeerMesh(packet.peer) !== undefined) { // Already has mesh
				return;
			}
			
			//let code = packet.data.code;
			let mesh = this.games.get(packet.data);
			
			
			
			if (mesh === undefined) {
				// Handle invalid join code somehow
				//this.send(packet.peer, GAME_JOIN_FAILED);
			}
			else {
				mesh.add(packet.peer);
			}
			
			//this.send(packet.peer, GAME_JOIN_RESPONSE);
			
		});
		
		
		
	}
	
	generateGameCode(length = 5): string {
		
		const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let code = "";
		
		for (let i = 0; i < length; i++)
			code += chars[Math.floor(Math.random() * chars.length)];
		
		// Retry on collision. Dumb, but it works
		if (this.games.has(code))
			return this.generateGameCode(length);
		
		return code;
		
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








