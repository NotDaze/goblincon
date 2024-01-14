

//import "webrtc-adapter";

import Signal from "../Core/signal"
import {
	
	TransferMode,
	ConnectionState,
	
	Packet,
	Message,
	MessageHandler,
	
	//LocalMonoPeer,
	MultiPeerConnectionStatus,
	LocalMultiPeer,
	RemotePeer,
	
} from "./network"
//import Arg from "../Network/arg"


import SocketClient from "./websocket_client"

import SignalingMessages, {
	
	MESH_INITIALIZE,
	MESH_TERMINATE,
	MESH_CONNECT_PEERS,
	MESH_DISCONNECT_PEERS,
	MESH_ICE_CANDIDATE_CREATED,
	MESH_SESSION_DESCRIPTION_CREATED,
	MESH_STATUS_UPDATE,
	MESH_CLIENT_STATUS_UPDATE,
	
} from "./MessageLists/signaling"


/*export enum MeshStatus {
	
	PENDING,
	PARTIAL,
	CONNECTED,
	DISCONNECTED,
	
}*/



export class RemoteMeshClient extends RemotePeer {
	
	
	
	sessionDescriptionCreated = new Signal<RTCSessionDescriptionInit>();
	iceCandidateCreated = new Signal<RTCIceCandidateInit>();
	
	//connectionReady = new Signal<void>();
	
	//answerCreated = new Signal<RTCSessionDescription>();
	//connectionReady = new Signal<void>();
	
	private connection = new RTCPeerConnection({
		iceServers: [
			{
				urls: [ "stun:stun.l.google.com", "stun:stun1.l.google.com" ]
			}
		]
	});
	private channels = new Map<TransferMode, RTCDataChannel>(); // Overkill
	
	/*private channels = {
		TransferMode.RELIABLE:
	};*/
	//private channelReliable = );
	//private channelUnreliable = );
	//private a = this.rtcConnection.createDataChannel()
	
	constructor() {
		
		super();
		
		this.channels.set(TransferMode.RELIABLE, this.createDataChannel("reliable", {
			
			id: 0,
			negotiated: true,
			//maxPacketLifeTime: 10000,
			//maxRetransmits:
			//ordered: true,
			
		}));
		this.channels.set(TransferMode.UNRELIABLE, this.createDataChannel("unreliable", {
			
			id: 1,
			negotiated: true,
			
			maxRetransmits: 0,
			ordered: false,
			
		}));
		
		/*this.connection.ondatachannel = (ev: RTCDataChannelEvent) => {
			
			let channel = ev.channel;
			let transferMode: TransferMode;
			
			if (channel.id == 0)
				transferMode = TransferMode.RELIABLE;
			else if (channel.id == 1)
				transferMode = TransferMode.UNRELIABLE;
			else {
				console.error("Invalid channel");
				return;
			}
			
			this.initDataChannel(channel);
			this.channels.set(transferMode, channel);
			
		};*/
		
		this.connection.onconnectionstatechange = (ev: Event) => {
			
			//console.log(this.channels.get(TransferMode.RELIABLE)?.readyState);
			
			switch (this.connection.connectionState) {
				
				case "new":
					this.state.set(ConnectionState.NEW);
					break;
				
				case "connecting":
					this.state.set(ConnectionState.CONNECTING);
					break;
				case "connected":
					//this.state.set(ConnectionState.CONNECTING);
					this.checkConnected(); // Not necessarily connected, channels must be open
					break;
				
				case "disconnected":
					this.state.set(ConnectionState.DISCONNECTED);
					break;
				case "closed":
					this.state.set(ConnectionState.DISCONNECTED);
					break;
				case "failed":
					console.error("MeshPeer connection failed.");
					this.state.set(ConnectionState.DISCONNECTED);
					break;
				
			}
			
		};
		this.connection.onicegatheringstatechange = (ev: Event) => {
			// "new" | "gathering" | "complete"
			//this.checkConnected();
			//console.log("Gathering State: ", this.connection.iceGatheringState);
			
		};
		this.connection.onsignalingstatechange = (ev: Event) => {
			// "closed" | "have-local-offer" | "have-local-pranswer" | "have-remote-offer" | "have-remote-pranswer" | "stable"
			
			/*switch (this.connection.signalingState) {
				
				case "have-local-pranswer": case "have-remote-pranswer": case "stable":
					
					for (const pendingCandidate of this.pendingCandidates)
						this.addRemoteIceCandidate(pendingCandidate);
					
					this.pendingCandidates = [];
					
				
			}*/
			
			
			//console.log("Signaling State: ", this.connection.signalingState);
			
		};
		
		
		
		this.connection.onicecandidate = (ev: RTCPeerConnectionIceEvent) => {
			
			//console.log(ev.candidate);
			
			//this.iceCandidateCreated.emit(ev.candidate?.toJSON());
			
			/*if (ev.candidate && ev.candidate.candidate) {
				
				if (this.connection.canTrickleIceCandidates)
					this.iceCandidateCreated.emit(ev.candidate.toJSON());
				
			}
			else {
				
				if (!this.connection.canTrickleIceCandidates) {
					this.sessionDescriptionCreated.emit(this.connection.localDescription?.toJSON());
					console.log(this.connection.localDescription?.toJSON());
				}
				
			}*/
			
			
			if (ev.candidate && ev.candidate.candidate)
				this.iceCandidateCreated.emit(ev.candidate.toJSON());
			
			
		};
		
	}
	
	private checkConnected() {
		
		if (!this.state.is(ConnectionState.CONNECTING))
			return;
		
		if (this.connection.connectionState !== "connected")
			return;
		
		// All channels must be open
		for (const channel of this.channels.values())
			if (channel.readyState !== "open")
				return;
		
		// We're fully connected
		this.state.set(ConnectionState.CONNECTED);
		
	}
	
	public async createOffer() {
		
		if (!this.state.any(ConnectionState.NEW, ConnectionState.DISCONNECTED)) {
			console.log("Attempted to create offer for invalid peer.");
			return;
		}
		
		this.state.set(ConnectionState.CONNECTING);
		
		let offer = await this.connection.createOffer({ /* iceRestart: true, */ });
		await this.connection.setLocalDescription(offer);
		
		/*if (this.connection.canTrickleIceCandidates === true)
			this.sessionDescriptionCreated.emit(offer);
		else
			console.log("No trickling");*/
		
		//console.log("Can Trickle: ", this.connection.canTrickleIceCandidates);
		
		if (offer.sdp == undefined)
			console.error("Failed offer creation.");
		else
			this.sessionDescriptionCreated.emit(offer);
		
	}
	public async setRemoteDescription(description: RTCSessionDescriptionInit) {
		
		//type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";
		
		if (this.state.is(ConnectionState.CONNECTED)) {
			console.log("Received remote description for peer that is already connected.");
			return;
		}
		
		if (description.type === "offer" && this.state.is(ConnectionState.CONNECTING)) {
			console.log("Received remote offer for peer that is already connecting.");
			return;
		}
		
		this.state.set(ConnectionState.CONNECTING);
		
		await this.connection.setRemoteDescription(description);
		
		if (description.type === "offer") {
			let answer = await this.connection.createAnswer();
			await this.connection.setLocalDescription(answer);
			
			this.sessionDescriptionCreated.emit(answer);
		}
		
	}
	public async addRemoteIceCandidate(candidate: RTCIceCandidateInit) {
		
		if (!this.state.is(ConnectionState.CONNECTING)) {
			//console.log("Received remote ice candidate for peer that isn't connecting.");
			//console.log(candidate);
		}
		
		await this.connection.addIceCandidate(candidate);
		
	};
	
	private createDataChannel(label: string, init: RTCDataChannelInit): RTCDataChannel {
		
		let channel = this.connection.createDataChannel(label, init);
		
		this.initDataChannel(channel);
		
		return channel;
		
	}
	private initDataChannel(channel: RTCDataChannel): void {
		
		channel.onmessage = async (ev: MessageEvent) => {
			
			console.log("Message! ", ev.data);
			
			if (ev.data instanceof Blob) {
				this.handleRaw(new Uint8Array(await ev.data.arrayBuffer()));
			}
			else if (ev.data instanceof ArrayBuffer) {
				this.handleRaw(new Uint8Array(ev.data));
			}
			else {
				console.log("Invalid RTCDataChannel Message: ", ev.data);
			}
			
		};
		channel.onopen = (ev: Event) => {
			
			console.log("Channel opened!");
			
			this.checkConnected();
			
		};
		channel.onclose = (ev: Event) => {
			
			//if (this.state.is(ConnectionState.CONNECTED))
			console.log("Channel closed.");
			
		}
		
	};
	
	public sendRaw(raw: Uint8Array, transferMode = TransferMode.RELIABLE): void {
		
		if (!this.state.is(ConnectionState.CONNECTED)) {
			console.error("Attempted to send to RemoteMeshClient that is not connected.");
		}
		
		let channel = this.channels.get(transferMode);
		
		if (channel == undefined) {
			console.error("Invalid MeshClient channel.");
			return;
		}
		
		channel.send(raw);
		
	}
	
}

export default class LocalMeshClient<RemoteClientType extends RemoteMeshClient> extends LocalMultiPeer<RemoteClientType> {
	
	//statusUpdate = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>]>();
	
	//stabilized = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>]>();
	//destabilized = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>]>();
	
	serverConnected: Signal<[ConnectionState, ConnectionState]>;
	serverDisconnected: Signal<[ConnectionState, ConnectionState]>;
	serverConnectionFailed: Signal<[ConnectionState, ConnectionState]>;
	
	meshInitialized = this.state.transition(
		[ ConnectionState.NEW, ConnectionState.DISCONNECTED ],
		[ ConnectionState.CONNECTING, ConnectionState.CONNECTED ]
	);
	meshTerminated = this.state.transition(
		[ ConnectionState.CONNECTING, ConnectionState.CONNECTED ],
		[ ConnectionState.NEW, ConnectionState.DISCONNECTED ]
	);
	
	//meshJoined = new Signal<void>();
	//meshLeft = new Signal<void>();
	
	
	
	
	//serverConnecting: Signal<void>;
	
	protected socket: SocketClient;
	private clientClass: { new(): RemoteClientType };
	
	
	protected stable = false;
	
	
	private fullyConnected = false;
	
	constructor(remoteClientClass: { new(): RemoteClientType }, serverUrl: string, protocols: Array<string> = []) {
		
		super();
		
		this.clientClass = remoteClientClass;
		
		this.socket = new SocketClient(serverUrl, protocols);
		this.serverConnected = this.socket.connected;
		this.serverDisconnected = this.socket.disconnected;
		this.serverConnectionFailed = this.socket.connectionFailed;
		
		this.addServerMessages(SignalingMessages);
		
		
		
		
		//console.log(this.socket.messageRoot);
		//console.log(this.socket.messageRoot.findMessage(new ByteIStream(new Uint8Array([8, 0]))))
		
		this.serverConnected.connect(() => {
			console.log("Connected to server");
		});
		
		/*this.connected.connect(() => {
			//this.sendServer(MESH_);
		});*/
		
		this.meshInitialized.connect(() => {
			
			for (const peer of this.peers)
				this.connectPeer(peer);
			
		});
		
		
		this.peerAdded.connect((peer: RemoteClientType) => {
			
			peer.sessionDescriptionCreated.connect((description: RTCSessionDescriptionInit) => {
				this.sendServer(MESH_SESSION_DESCRIPTION_CREATED, {
					peerID: peer.getID(),
					type: description.type,
					sdp: description.sdp
				});
			});
			peer.iceCandidateCreated.connect((candidate: RTCIceCandidateInit) => {
				
				this.sendServer(MESH_ICE_CANDIDATE_CREATED, {
					peerID: peer.getID(),
					candidate: candidate.candidate,
					sdpMid: candidate.sdpMid,
					sdpMLineIndex: candidate.sdpMLineIndex,
					usernameFragment: candidate.usernameFragment
				});
				
			});
			
			if (this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
				this.connectPeer(peer);
			
		});
		
		this.peerDropped.connect((peer: RemoteClientType) => {
			
			peer.close();
			
			if (this.state.is(ConnectionState.CONNECTED))
				this.sendStatus();
			
		});
		
		this.peerConnectionFailed.connect((peer: RemoteClientType) => {
			
			//this.checkAndSendStatus();
			//this.state.set(ConnectionState.DISCONNECTED);
			//this.close();
			// TODO improve
			
		});
		this.peerConnected.connect((peer: RemoteClientType) => {
			
			//console.log("yippee")
			
			if (this.state.is(ConnectionState.CONNECTING)) {
				
				let status, [pending, connected, disconnected] = this.getIDStatus();
				//let [pending, connected, disconnected] = status;
				
				if (pending.length === 0) { // Everyone is done connecting
					
					//this.checkStatus(status);
					this.sendStatus(status);
					this.state.set(ConnectionState.CONNECTED);
					
				}
				
			}
			
			else if (this.state.is(ConnectionState.CONNECTED)) { // Late join, send updated status
				
				this.sendStatus();
				
			}
			
			
		});
		
		// Dropped vs disconnected??
		this.peerDisconnected.connect((peer: RemoteClientType) => {
			
			/*if (this.state.is(ConnectionState.CONNECTING)) {
				//console.error("Connection failed.");
				this.close();
			}*/
			
		});
		
		this.closed.connect(() => {
			
			this.state.set(ConnectionState.DISCONNECTED);
			
			// Come back to this
			for (const peer of this.getPeers())
				this.dropPeer(peer);
			
		});
		
		this.initMessageHandling();
		
	}
	
	private initMessageHandling(): void {
		
		
		this.addServerCondition( // Mesh is connecting or connected
			[
				MESH_TERMINATE,
				MESH_CONNECT_PEERS,
				MESH_DISCONNECT_PEERS,
				MESH_SESSION_DESCRIPTION_CREATED,
				MESH_ICE_CANDIDATE_CREATED,
			],
			(packet: Packet<void, any>) => {
				
				if (!this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED))
					return "Message received for mesh that is not initialized.";
				
			}
		);
		
		this.addServerCondition(
			[
				MESH_SESSION_DESCRIPTION_CREATED,
				MESH_ICE_CANDIDATE_CREATED
			],
			(packet: Packet<void, { peerID: number }>) => {
				
				let peer = this.getPeer(packet.data.peerID);
				
				if (peer === undefined) // || !peer.state.any(ConnectionState.NEW, ConnectionState.CONNECTING))
					return "Invalid SDP/ICE transport.";
				
			}
		);
		
		
		
		this.onServerMessage(MESH_INITIALIZE, packet => {
			
			if (this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED)) {
				console.error("Attempted to initialize mesh that is already connecting or connected.");
				return;
			}
			
			//console.log(packet.data.localID, packet.data.peerIDs);
			
			this.setID(packet.data.localID);
			this.createPeers(packet.data.peerIDs);
			
			this.state.set(ConnectionState.CONNECTING);
			
			//this.meshInitialized.emit();
			//this.meshJoined.emit();
			
		});
		
		
		this.onServerMessage(MESH_TERMINATE, packet => {
			
			this.setID(-1);
			this.close();
			
		});
		
		this.onServerMessage(MESH_CONNECT_PEERS, packet => {
			
			//console.log("Creating peers")
			this.createPeers(packet.data.peerIDs);
			
		});
		this.onServerMessage(MESH_DISCONNECT_PEERS, packet => {
			
			this.dropPeers(packet.data.peerIDs);
			
		});
		this.onServerMessage(MESH_SESSION_DESCRIPTION_CREATED, packet => {
			
			//console.log(packet.data);
			
			this.getPeer(packet.data.peerID)?.setRemoteDescription({
				type: packet.data.type,
				sdp: packet.data.sdp
			});
			
		});
		this.onServerMessage(MESH_ICE_CANDIDATE_CREATED, packet => {
			
			//console.log(packet.data);
			
			this.getPeer(packet.data.peerID)?.addRemoteIceCandidate({
				candidate: packet.data.candidate,
				sdpMid: packet.data.sdpMid,
				sdpMLineIndex: packet.data.sdpMLineIndex,
				usernameFragment: packet.data.usernameFragment
			});
			
		});
		
		//this.onMessage(MESH_DISCONNECT_PEERS, (packet: Packet<RemoteMeshClient>) => {
			
		//});
		
	}
	
	protected createPeers(ids: Array<number>): void {
		
		for (const id of ids)
			//if (id !== this.id && !this.ids.has(id)) // Error message?
			this.getOrCreatePeer(id);
		
	}
	protected createPeer(id: number): RemoteClientType | undefined {
		
		if (id === this.id)
			return;
		
		let peer = new this.clientClass();
		this.addPeer(peer, id);
		return peer;
		
	}
	protected getOrCreatePeer(id: number): RemoteClientType | undefined {
		
		let peer = this.getPeer(id);
		return peer === undefined ? this.createPeer(id) : peer;
		
	}
	protected connectPeer(peer: RemoteClientType): void {
		
		if (this.id > peer.id)
			peer.createOffer();
		
		if (this.state.is(ConnectionState.CONNECTED)) // Late join, tell the server about it
			this.sendStatus();
		
	}
	
	private dropPeers(ids: Iterable<number>): void {
		
		for (const id of ids) {
			
			let peer = this.getPeer(id);
			
			if (peer !== undefined)
				this.dropPeer(peer);
			
		}
		
	}
	
	
	private getPeerIDs(peers: Iterable<RemoteClientType> = this.peers): Set<number> {
		
		let out = new Set<number>();
		
		for (const peer of peers)
			out.add(peer.getID());
		
		return out;
		
	}
	
	/*private checkStatus(): [connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>] {
		
		if (this.state.is(ConnectionState.CONNECTED)) {
			let status = this.getStatus();
			this.statusUpdate.emit(status);
			return status;
		}
		
	}*/
	private sendStatus(status: MultiPeerConnectionStatus<number> = this.getIDStatus()): void {
		this.sendServer(MESH_CLIENT_STATUS_UPDATE, status);
	}
	
	public isActive(): boolean {
		return this.state.any(ConnectionState.CONNECTING, ConnectionState.CONNECTED);
	}
	public isStable(): boolean {
		return this.stable;
	}
	
	public addServerMessage(message: Message<any>): void {
		this.socket.addMessage(message);
	}
	public addServerMessages(messages: Iterable<Message<any>>): void {
		this.socket.addMessages(messages);
	}
	public onServerMessage<T>(message: Message<T>, callback: (packet: Packet<void, T>) => void): void {
		this.socket.onMessage(message, callback);
	}
	public addServerCondition<T>(messages: Iterable<Message<T>>, condition: (packet: Packet<void, T>) => string | void): void {
		this.socket.addCondition(messages, condition);
	}
	public sendServer<T>(message: Message<T>, data: T = undefined as T): void {
		this.socket.send(message, data);
	}
	
	
}





