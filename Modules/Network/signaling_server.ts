


import State from "../Core/state"
import Signal, { SignalListener } from "../Core/signal"

import { WebSocket } from "ws"
//import Arg from "./arg"

import {
	
	ConnectionState,
	
	//Message,
	//MessageDomain,
	//MessageHandler,
	Packet,
	
	RemotePeerIndex,
	//LocalMultiPeer,
	//RemotePeer,
	
	Group,
	MultiPeerConnectionStatus,
	
} from "./network"
import {
	Socket,
	SocketServer,
} from "./websocket_server"

import SignalingMessages, {
	
	MESH_INITIALIZE,
	MESH_TERMINATE,
	MESH_CONNECT_PEERS,
	MESH_DISCONNECT_PEERS,
	MESH_STABILIZED,
	MESH_ICE_CANDIDATE_CREATED,
	MESH_SESSION_DESCRIPTION_CREATED,
	MESH_STATUS_UPDATE,
	MESH_CLIENT_STATUS_UPDATE
	
} from "./MessageLists/signaling"


export class Mesh<SocketType extends SignalingSocket> extends Group<SocketType> {
	
	stabilized = new Signal<void>();
	destabilized = new Signal<void>();
	
	disconnected = new Signal<void>();
	
	public state = new State(ConnectionState.NEW);
	
	protected peerIndex = new RemotePeerIndex<SocketType>();
	
	private stable = false;
	
	constructor(stratum: Set<Mesh<SocketType>>, server: SignalingServer<SocketType>) {
		
		super(stratum, server);
		
		this.capacity = 4;
		
		this.peersAdded.connect((peers: Array<SocketType>): void => {
			
			for (const peer of peers) {
				
				let id = this.peerIndex.getNextID();
				this.peerIndex.add(peer, id);
				peer.setMeshID(id);
				
			}
			
			for (const socket of peers) {
				
				this.createSocketConnections(socket);
				
				console.log(`Socket joined: ${socket.getMeshID()}/${socket.getID()}`);
				
			}
			
			//this.attemptInitialize();
			this.checkStability();
			
		});
		this.peersLeaving.connect((peers: Array<SocketType>): void => {
			
			for (const socket of peers) {
				
				this.destroySocketConnections(socket);
				console.log(`Socket left: ${socket.getMeshID()}/${socket.getID()}`);
				
			}
			
		});
		this.peersRemoved.connect((peers: Array<SocketType>): void => {
			
			for (const peer of peers) {
				this.peerIndex.remove(peer.getMeshID());
				peer.clearMeshID();
			}
			
			this.checkStability();
			
			if (this.isEmpty() && !this.state.is(ConnectionState.DISCONNECTED))
				this.destroy();
			
		});
		
		this.stabilized.connect((): void => {
			
			this.sendAll(MESH_STABILIZED);
			console.log("Stabilized!");
			
		});
		this.destabilized.connect((): void => {
			
			console.log("Destabilized!");
			
		});
		
	}
	
	private calculateStability(): boolean {
		
		if (!this.isActive())
			return false;
		
		if (this.isEmpty())
			return false;
		
		for (const socket of this.getPeers()) {
			
			if (!socket.isStable())
				return false;
			
		}
		
		return true;
		
	}
	private setStability(newStable: boolean): void {
		
		if (this.stable != newStable) {
			this.stable = newStable;
			
			if (newStable) {
				
				if (this.state.is(ConnectionState.CONNECTING))
					this.state.set(ConnectionState.CONNECTED);
				
				this.stabilized.emit();
			}
			else {
				this.destabilized.emit();
			}
			
		}
		
	}
	private checkStability(): void {
		this.setStability(this.calculateStability());
	}
	
	private createSocketConnections(newSocket: SocketType): void {
		
		if (!this.isActive())
			return; // if new or disconnected, don't make connections
		
		this.send(newSocket, MESH_INITIALIZE, {
			localID: newSocket.getMeshID(),
			peerIDs: Array.from(this.ids)
		});
		
		this.sendAllExcept(newSocket, MESH_CONNECT_PEERS, {
			peerIDs: [newSocket.getMeshID()]
		});
		
	}
	private destroySocketConnections(exitingSocket: SocketType): void {
		
		this.send(exitingSocket, MESH_TERMINATE);
		
		if (this.isActive()) {
			// if new nothing needs to disconnect
			// if disconnected everything is terminating already
			this.sendAllExcept(exitingSocket, MESH_DISCONNECT_PEERS, {
				peerIDs: [ exitingSocket.getMeshID() ]
			});
		}
		
		/*this.send(exitingSockets, MESH_TERMINATE);
		
		if (!this.state.is(ConnectionState.DISCONNECTED)) {
			// if disconnected everything is terminating already
			
			this.sendAllExcept(exitingSockets, MESH_DISCONNECT_PEERS, {
				peerIDs: [ get]
			});
		}*/
		
	}
	
	public isActive(): boolean {
		return this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED);
	}
	public isJoinable(): boolean {
		return this.state.any(ConnectionState.NEW, ConnectionState.CONNECTING, ConnectionState.CONNECTED) && !this.isFull();
	}
	
	public canInitialize(): boolean {
		return this.state.is(ConnectionState.NEW);// && this.getPeerCount() >= 2; // && this.getPeerCount() >= this.startThreshold;
	}
	public initialize(): void {
		
		this.state.set(ConnectionState.CONNECTING);
		
		for (const socket of this.getPeers()) {
			
			this.send(socket, MESH_INITIALIZE, {
				localID: socket.getMeshID(),
				peerIDs: Array.from(this.ids)
			});
			
		}
		
		console.log("Mesh initialized!");
		
	}
	public attemptInitialize(): void {
		if (this.canInitialize())
			this.initialize();
	}
	
	public add(...sockets: Array<SocketType>): Array<SocketType> {
		
		if (this.state.is(ConnectionState.DISCONNECTED)) {
			console.error("Mesh attempted to add sockets while disconnected.");
			return new Array<SocketType>();
		}
		
		return super.add(...sockets);
		
	}
	public remove(...sockets: Array<SocketType>): Array<SocketType> {
		return super.remove(...sockets);
	}
	
	public destroy(): void {
		
		if (this.state.is(ConnectionState.DISCONNECTED)) {
			console.error("Mesh destroyed while already disconnected.");
			return;
		}
		else {
			
			this.state.set(ConnectionState.DISCONNECTED);
			//this.remove(...this.getSockets());
			super.destroy();
			
			console.log("Mesh terminated.");
			
		}
		
	}
	
	private setPairConnectionState(localSocket: SocketType, remoteSocket: SocketType, state: ConnectionState): void {
		
	}
	private setPairConnectionStates(localSocket: SocketType, remoteIDs: Iterable<number>, state: ConnectionState): void {
		
		for (const id of remoteIDs) {
			
			let peer = this.getPeer(id);
			
			if (peer != undefined && peer !== localSocket)
				localSocket.setPeerConnectionState(peer, state);
			
		}
		
		localSocket.checkStability();
		
	}
	public handleConnectionStatusUpdate(localSocket: SocketType, [pendingIDs, connectedIDs, disconnectedIDs]: MultiPeerConnectionStatus<number>): void {
		
		//console.log(localSocket.getMeshID(), " <-> ", connectedIDs);
		
		
		this.setPairConnectionStates(localSocket, pendingIDs, ConnectionState.CONNECTING);
		this.setPairConnectionStates(localSocket, connectedIDs, ConnectionState.CONNECTED);
		this.setPairConnectionStates(localSocket, disconnectedIDs, ConnectionState.DISCONNECTED);
		
		localSocket.checkStability();
		
		/*for (const remoteSocket of this.getPeers()) {
			
			if (remoteSocket === localSocket)
				continue;
			
			let state: ConnectionState;
			
			if (connectedIDs.includes(remoteSocket.getMeshID()))
				state = ConnectionState.CONNECTED;
			else
				state = ConnectionState.DISCONNECTED;
			
			localSocket.setConnectionState(remoteSocket, state);
			
			
			let otherState = remoteSocket.getConnectionState(localSocket);
			
			if (otherState != ConnectionState.CONNECTING && otherState != state) {
				// something strange happened...
				// TODO handle this
			}
			
		}
		
		this.checkStability();*/
		
		this.checkStability();
		
		// maybe verify that the match has all the provided IDs
		
	}
	
}


export class SignalingSocket extends Socket {
	
	protected meshID = -1;
	protected stable = false;
	
	protected connectionStates = new Map<SignalingSocket, ConnectionState>();
	
	constructor(ws: WebSocket) {
		super(ws);
	}
	
	public hasMeshID(): boolean {
		return this.meshID >= 0;
	}
	public getMeshID(): number {
		return this.meshID;
	}
	
	public setMeshID(newID: number): void {
		this.meshID = newID;
	}
	public clearMeshID(): void {
		this.setMeshID(-1);
	}
	
	private calculateStability(): boolean {
		
		for (const connectionState of this.connectionStates.values()) {
			
			if (connectionState != ConnectionState.CONNECTED)
				return false;
			
		}
		
		return true;
		
	}
	private setStability(newStable: boolean): void {
		if (this.stable != newStable) {
			this.stable = newStable;
		}
	}
	public checkStability() {
		this.setStability(this.calculateStability());
	}
	public isStable(): boolean {
		return this.stable;
	}
	
	public setPeerConnectionState(node: SignalingSocket, state: ConnectionState): void {
		
		if (node == this)
			return;
		
		this.connectionStates.set(node, state);
		//console.log(this.getRoomID(), " -> ", node.getRoomID(), ": ", state);
		//this.checkStability();
		
	}
	public clearConnectionState(node: SignalingSocket): void {
		this.connectionStates.delete(node);
		//this.checkStability();
	}
	
	public hasConnectionState(node: SignalingSocket): boolean {
		return this.connectionStates.has(node);
	}
	public getConnectionState(node: SignalingSocket): ConnectionState {
		
		let state = this.connectionStates.get(node);
		return state !== undefined ? state : ConnectionState.CONNECTING;
		
	}
	
}

export default class SignalingServer<SocketType extends SignalingSocket> extends SocketServer<SocketType> {
	
	meshCreated = new Signal<Mesh<SocketType>>();
	meshDestroyed = new Signal<Mesh<SocketType>>();
	
	protected meshes = new Set<Mesh<SocketType>>();
	
	//private meshClass: { new(...peers: Array<SocketType>): MeshType };
	private meshListeners = new Map<Mesh<SocketType>, SignalListener>();
	
	constructor(socketClass: { new(ws: WebSocket): SocketType }, wssArgs = SocketServer.WSS_ARGS) {
		
		super(socketClass, wssArgs);
		this.addMessages(SignalingMessages);
		
		this.initMessageHandling();
	
	}
	private initMessageHandling() {
		this.addCondition( // Has active mesh
			[
				MESH_CLIENT_STATUS_UPDATE,
				MESH_SESSION_DESCRIPTION_CREATED,
				MESH_ICE_CANDIDATE_CREATED
			],
			(packet: Packet<SocketType, any>) => {
				
				let mesh = this.getPeerMesh(packet.peer);
				
				if (mesh === undefined || !mesh.isActive())
					return "No active mesh.";
				
			}
		);
		
		this.onMessage(MESH_CLIENT_STATUS_UPDATE, packet => {
			
			this.getPeerMesh(packet.peer)?.handleConnectionStatusUpdate(
				packet.peer,
				packet.data as MultiPeerConnectionStatus<number>
			);
			
		});
		
		
		this.onMessage(MESH_SESSION_DESCRIPTION_CREATED, packet => {
			
			let target = this.getPeerMesh(packet.peer)?.getPeer(packet.data.peerID);
			
			if (target === undefined)
				console.error("Invalid session description forward");
			else
				this.send(target, MESH_SESSION_DESCRIPTION_CREATED, {
					peerID: packet.peer.getMeshID(),
					type: packet.data.type,
					sdp: packet.data.sdp
				});
			
		});
		this.onMessage(MESH_ICE_CANDIDATE_CREATED, packet => {
			
			// Maybe verify that the peers are not already connected?
			let target = this.getPeerMesh(packet.peer)?.getPeer(packet.data.peerID);
			
			if (target === undefined)
				console.error("Invalid ICE candidate forward");
			else
				this.send(target, MESH_ICE_CANDIDATE_CREATED, {
					peerID: packet.peer.getMeshID(),
					candidate: packet.data.candidate,
					sdpMid: packet.data.sdpMid,
					sdpMLineIndex: packet.data.sdpMLineIndex,
					usernameFragment: packet.data.usernameFragment
				});
			
		});
		
	}
	
	public createMesh(...peers: Array<SocketType>): Mesh<SocketType> {
		
		let mesh = new Mesh<SocketType>(this.meshes, this);
		this.meshes.add(mesh);
		
		let listener = new SignalListener();
		this.meshListeners.set(mesh, listener);
		
		listener.connect(mesh.disconnected, () => {
			mesh.destroy();
			console.log("Mesh disconnected");
		});
		listener.connect(mesh.destroyed, () => {
			
			// Clean up signals
			this.meshListeners.get(mesh)?.disconnectAll();
			this.meshListeners.delete(mesh);
			
			this.meshes.delete(mesh);
			this.meshDestroyed.emit(mesh);
			
		});
		
		mesh.add(...peers);
		
		this.meshCreated.emit(mesh);
		console.log("Mesh created");
		
		return mesh;
		
	}
	public destroyMesh(mesh: Mesh<SocketType>) {
		
		if (!this.meshes.has(mesh))
			throw new Error("Attempted to destroy mesh that does not belong to this SignalingServer");
		
		mesh.destroy();
		
	}
	
	protected createSocket(ws: WebSocket): SignalingSocket {
		return new SignalingSocket(ws);
	}
	public peerHasMesh(socket: SignalingSocket): boolean {
		return this.getPeerMesh(socket) !== undefined;
	}
	public getPeerMesh(socket: SignalingSocket): Mesh<SocketType> | undefined {
		return socket.getStratumGroup(this.meshes);
	}
	
}
