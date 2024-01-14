




import State from "../Core/state"
import IDIndex from "../Core/id_index"
import Signal, { SignalListener } from "../Core/signal"
import Deferrable from "../Core/deferrable"
import ByteIStream from "../Core/byteistream"
import ByteOStream from "../Core/byteostream"


import Arg, { ArgLike } from "./arg"

export enum TransferMode {
	RELIABLE,
	ORDERED,
	UNRELIABLE
}

export enum ConnectionState {
	
	NEW,
	CONNECTING,
	CONNECTED,
	DISCONNECTED,
	//CLOSED, // maybe
	
}

export class Packet<PeerType extends RemotePeer | void, DataType> {
	
	public message: Message<DataType>;
	public peer: PeerType;
	public data: DataType;
	//public raw: Uint8Array;
	//public branching = new Array<number>();
	//public branching: Array<number>;
	
	constructor(message: Message<DataType>, peer: PeerType, data: DataType) {
		
		this.message = message;
		this.peer = peer;
		this.data = data;
		//this.raw = raw;
		
	}
	
}

export class Message<T = undefined> {
	
	//static META_TIMESTAMP = symbol("META_TIMESTAMP");
	
	/*static fromJSON() {
		
	}*/
	//static RAW = Symbol("RAW"); // maybe
	
	//type ArgT = T extends undefined ? undefined : ArgLike<T>;
	
	private arg: ArgLike<T>;
	private transferMode: TransferMode; // Not sure this is actually necessary, but eh
	//private conditions = new Array<(packet: Packet) => boolean>;
	
	constructor(arg: ArgLike<T> = Arg.NONE as ArgLike<T>, transferMode = TransferMode.RELIABLE) {
		
		this.arg = arg;
		this.transferMode = transferMode;
		
	}
	
	/*public findMessage(stream: ByteIStream): Message | undefined {
		return this;
	}*/
	
	public getTransferMode(): TransferMode {
		return this.transferMode;
	}
	
	public encode(data: T): Uint8Array {
		return Arg.encode(this.arg, data);
	}
	public streamEncode(data: T, stream: ByteOStream): void {
		Arg.streamEncode(this.arg, data, stream);
	}
	public decode(raw: Uint8Array): T {
		return Arg.decode(this.arg, raw);
	}
	public streamDecode(stream: ByteIStream): T {
		return Arg.streamDecode(this.arg, stream);
	}
	
	/*public streamCreateRaw(data: any, stream: ByteOStream): void {
		
		// Consider changing this - if an encoding error happens, the message address will still be written
		stream.write(this.address);
		this.streamEncode(data, stream);
		
	}*/
	/*public createRaw(data: any): Uint8Array {
		
		let stream = new ByteOStream();
		this.streamCreateRaw(data, stream);
		return stream.bytes;
		
	}*/
	
}

export class MessageHandler<RemotePeerType extends RemotePeer | void> {
	
	static CONDITION_PASSED = 0;
	static CONDITION_FAILED = 1;
	
	//private messageRoot: MessageDomain;
	
	//private addresses = new Map<Message, Uint8Array>();
	
	private conditions = new Map<Message<any>, Set<(packet: Packet<RemotePeerType, any>) => string | void>>();
	private signals = new Map<Message<any>, Signal<Packet<RemotePeerType, any>>>();
	
	/*constructor(messageRoot: MessageDomain) {
		
		this.messageRoot = messageRoot;
		this.indexAddresses(messageRoot);
		
	}
	
	private indexAddresses(node: MessageNode, address = new Uint8Array()): void {
		
		if (node instanceof MessageDomain) {
			
			let i = 0;
			
			for (const child of node) {
				
				this.indexAddresses(child, Arg.joinByteArrays(address, Arg.encodeInt(i, node.getIdByteCount())));
				i++;
				
			}
			
		}
		else if (node instanceof Message) {
			this.addresses.set(node, address);
		}
		else {
			// Throw?
		}
		
	}
	
	createPackets(peer: RemotePeerType, raw: Uint8Array): Array<Packet<RemotePeerType>> {
		
		//console.log(raw);
		let stream = new ByteIStream(raw);
		let packets = new Array<Packet<RemotePeerType>>();
		
		while (!stream.complete) {
			
			//let messageID = Arg.decodeInt(stream.next(this.idByteCount));
			//let message = this.messages[messageID];
			
			let message = this.messageRoot.findMessage(stream);
			
			if (!message) {
				console.error("Unrecognized Message | ", raw);
				break;
			}
			
			//packets.push(message.createPacket(stream));
			
			packets.push(
				new Packet<RemotePeerType>(message, peer, message.streamDecode(stream))
			);
			
		}
		
		stream.verifyExactComplete();
		return packets;
		
	}
	createRaw(message: Message, data: any, stream: ByteOStream): void {
		
		
		
	}
	
	hasMessage(message: Message): boolean {
		return this.addresses.has(message);
	}
	getMessageAddress(message: Message): Uint8Array | undefined {
		return this.addresses.get(message);
	}*/
	
	hasMessageSignal<T>(message: Message<T>): boolean {
		return this.signals.has(message);
	}
	getMessageSignal<T>(message: Message<T>): Signal<Packet<RemotePeerType, T>> {
		
		let signal = this.signals.get(message);
		
		if (!signal) {
			signal = new Signal<Packet<RemotePeerType, T>>();
			this.signals.set(message, signal);
		}
		
		return signal;
		
	}
	
	addCallback<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void): void {
		this.getMessageSignal<T>(message).connect(callback);
	}
	removeCallback<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void): void {
		if (this.hasMessageSignal(message))
			this.getMessageSignal<T>(message).disconnect(callback);
	}
	
	onMessage<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void): void {
		this.addCallback(message, callback);
	}
	subscribeMessage<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void, chain?: () => void): () => void {
		return this.getMessageSignal(message).subscribe(callback, chain);
	}
	
	addCondition<T>(messages: Message<T> | Iterable<Message<T>>, condition: (packet: Packet<RemotePeerType, T>) => string | void): void {
		
		for (const message of (messages instanceof Message ? [messages] : messages)) {
			if (!this.conditions.has(message))
				this.conditions.set(message, new Set());
			
			this.conditions.get(message)?.add(condition);
		}
		
	}
	removeCondition<T>(messages: Message<T> | Iterable<Message<T>>, condition: (packet: Packet<RemotePeerType, T>) => string | void): void {
		
		for (const message of (messages instanceof Message ? [messages] : messages))
			if (this.conditions.has(message))
				this.conditions.get(message)?.delete(condition);
		
	}
	
	
	handlePacket(packet: Packet<RemotePeerType, any>): void {
		
		if (this.hasMessageSignal(packet.message)) {
			
			let conditions = this.conditions.get(packet.message);
			
			if (conditions) {
				for (const condition of conditions) {
					
					let out = condition(packet);
					
					if (out !== undefined) {
						
						if (out !== "") {
							console.error("Network Condition Failed: ", out);
						}
						
						return;
						
					}
				}
			}
			
			this.getMessageSignal(packet.message).emit(packet);
			
		}
		
	}
	handlePackets(packets: Iterable<Packet<RemotePeerType, any>>): void {
		
		for (const packet of packets)
			this.handlePacket(packet);
		
	}
	
}

export type MultiPeerConnectionStatus<PeerType> = [ pending: Array<PeerType>, connected: Array<PeerType>, disconnected: Array<PeerType> ];

export class RemotePeerIndex<PeerType extends RemotePeer> extends IDIndex<PeerType> {
	
	get peers(): Set<PeerType> {
		return this.values;
	}
	
	*stateFilter(...states: Array<ConnectionState>): IterableIterator<PeerType> {
		
		/*let peers = new Set<PeerType>();
		
		for (const peer of this.values)
			if (peer.state.any(...states))
				peers.add(peer);
		
		return peers;*/
		
		for (const peer of this.values)
			if (peer.state.any(...states))
				yield peer;
		
	}
	
	hasPeer(id: number): boolean {
		return this.map.has(id);
	}
	getPeer(id: number): PeerType | undefined {
		return this.map.get(id);
	}
	
	getPeers(ids: Iterable<number>): Set<PeerType> {
		
		if (ids == undefined)
			return this.peers;
		
		let out = new Set<PeerType>();
		
		for (const id of ids) {
			
			let peer = this.getPeer(id);
			
			if (peer !== undefined) // error message?
				out.add(peer);
			
		}
		
		return out;
		
	}
	getPeerIDs(peers: Iterable<PeerType>): Set<number> {
		
		let out = new Set<number>();
		
		for (const peer of peers)
			out.add(peer.getID());
		
		return out;
		
	}
	
	getStatus(): MultiPeerConnectionStatus<PeerType> {
		
		let status: MultiPeerConnectionStatus<PeerType> = [ new Array(), new Array(), new Array() ];
		
		for (const peer of this.peers) {
			
			if (peer.state.value === ConnectionState.CONNECTED)
				status[1].push(peer);
			else if (peer.state.value === ConnectionState.DISCONNECTED)
				status[2].push(peer);
			else
				status[0].push(peer);
			
		}
		
		return status;
		
	}
	getIDStatus(): MultiPeerConnectionStatus<number> {
		
		let status = this.getStatus();
		let idStatus: MultiPeerConnectionStatus<number> = [ [], [], [] ];
		
		for (let i = 0; i < 3; i++)
			idStatus[i] = Array.from(this.getPeerIDs(status[i]))
		
		return idStatus;
		
	}
	
	/*hasID(id: number): boolean {
		return this.index.has(id);
	}*/
	
	/*hasPeer(peer: PeerType): boolean {
		return this.peers.has(peer);
	}*/
	
	
	
	
	
}

class Peer {
	
	public id = -1;
	public state = new State(ConnectionState.NEW);
	
	public connected = this.state.transitionTo(ConnectionState.CONNECTED);
	public disconnected = this.state.transition(ConnectionState.CONNECTED, ConnectionState.DISCONNECTED);
	
	//public connecting = this.state.transition([ ConnectionState.NEW, ConnectionState.DISCONNECTED ], ConnectionState.CONNECTING);
	public connecting = this.state.transitionTo(ConnectionState.CONNECTING);
	public connectionFailed = this.state.transition(ConnectionState.CONNECTING, ConnectionState.DISCONNECTED);
	// Maybe should also see NEW -> DISCONNECTED
	
	/*public connected = new Signal<void>();
	public disconnected = new Signal<void>();
	
	public connecting = new Signal<void>();
	public connectionFailed = new Signal<void>();*/
	
	public closed = new Signal<void>();
	
	
	constructor() {
		
		/*this.state.changed.connect(([oldState, newState]): void => {
			
			switch (newState) {
				
				case ConnectionState.NEW:
					break;
				
				case ConnectionState.CONNECTING:
					this.connecting.emit();
					break;
				
				case ConnectionState.CONNECTED:
					this.connected.emit();
					break;
				
				case ConnectionState.DISCONNECTED:
					
					if (oldState == ConnectionState.CONNECTED)
						this.disconnected.emit();
					else
						this.connectionFailed.emit();
					
					break;
				
			}
			
		});*/
		
	}
	
	public hasID(): boolean {
		return this.id >= 0;
	}
	public getID(): number {
		return this.id;
	}
	public setID(newID: number): void {
		this.id = newID;
	}
	
	public close() {
		
		this.closed.emit();
		this.state.set(ConnectionState.DISCONNECTED);
		//this.closed.emit();
		
	}
	
	/*public getState(): ConnectionState {
		return this.state.value;
	}
	public setState(newState: ConnectionState) {
		this.state.set(newState);
	}*/
	
}


class LocalPeer<RemotePeerType extends RemotePeer | void> extends Peer {
	
	protected messages = new Array<Message<any>>();
	protected messageHandler: MessageHandler<RemotePeerType>;
	
	constructor() {
		
		super();
		
		//this.messageRoot = messageRoot;
		//this.messageHandler = messageHandler;
		
		this.messageHandler = new MessageHandler();
		
		//this.indexAddresses(messageRoot);
		
	}
	
	/*private indexAddresses(node: MessageNode, address = new Uint8Array()): void {
		
		if (node instanceof MessageDomain) {
			
			let i = 0;
			
			for (const child of node) {
				
				this.indexAddresses(child, Arg.joinByteArrays(address, Arg.encodeInt(i, node.getIdByteCount())));
				i++;
				
			}
			
		}
		else if (node instanceof Message) {
			this.addresses.set(node, address);
		}
		else {
			// Throw?
		}
		
	}*/
	
	get idByteCount() {
		return Arg.calculateByteCount(this.messages.length);
	}
	
	hasMessage(message: Message<any>): boolean {
		return this.messages.includes(message);
	}
	getMessageID(message: Message<any>): number {
		return this.messages.indexOf(message);
	}
	addMessage(message: Message<any>): void {
		this.messages.push(message);
	}
	addMessages(messages: Iterable<Message<any>>): void {
		for (const message of messages)
			this.addMessage(message);
	}
	
	protected createPackets(peer: RemotePeerType, raw: Uint8Array): Array<Packet<RemotePeerType, any>> {
		
		//console.log(raw);
		let stream = new ByteIStream(raw);
		let packets = new Array<Packet<RemotePeerType, any>>();
		
		while (!stream.complete) {
			
			//let messageID = Arg.decodeInt(stream.next(this.idByteCount));
			//let message = this.messages[messageID];
			
			let id = Arg.decodeInt(stream.next(this.idByteCount));
			let message = this.messages[id];
			
			if (!message) {
				console.error("Unrecognized Message | ", raw);
				break;
			}
			
			//packets.push(message.createPacket(stream));
			
			packets.push(
				new Packet<RemotePeerType, any>(message, peer, message.streamDecode(stream))
			);
			
		}
		
		stream.verifyExactComplete();
		return packets;
		
	}
	protected streamCreateRaw(message: Message<any>, data: any, stream: ByteOStream): void {
		
		//let address = this.getMessageAddress(message);
		
		let id = this.getMessageID(message);
		
		if (id < 0)
			throw new Error("Invalid message for LocalPeer.streamCreateRaw()");
		
		stream.write(Arg.encodeInt(id, this.idByteCount));
		message.streamEncode(data, stream);
		
	}
	protected createRaw(message: Message<any>, data: any): Uint8Array {
		
		let stream = new ByteOStream();
		this.streamCreateRaw(message, data, stream);
		return stream.bytes;
		
	}
	
	
	//private handleRaw(peer: RemotePeer, raw: Uint8Array): void {
	//	this.handlePackets(this.messageIndex.createPackets(peer, raw));
	//}
	protected handlePackets(packets: Iterable<Packet<RemotePeerType, any>>): void {
		for (const packet of packets)
			this.handlePacket(packet);
	}
	protected handlePacket(packet: Packet<RemotePeerType, any>): void {
		this.messageHandler.handlePacket(packet);
	}
	protected handleRaw(peer: RemotePeerType, raw: Uint8Array): void {
		this.handlePackets(this.createPackets(peer, raw));
	}
	
	/*public newDomain(idByteCount = ) {
		return this.messageDomain.newDomain(idByteCount);
	}*/
	/*public newMessage(arg?: any, transferMode = TransferMode.RELIABLE): Message {
		return this.messageDomain.newMessage(arg, transferMode);
	}*/
	
	private verifyHasMessages(messages: Message<any> | Iterable<Message<any>>): void {
		
		if (messages instanceof Message) {
			if (!this.hasMessage(messages))
				throw new Error("Invalid LocalPeer message.");
		}
		else {
			for (const message of messages)
				if (!this.hasMessage(message))
					throw new Error("Invalid LocalPeer message.");
		}
		
	}
	
	// Conditions should maybe only take an iterable, since they're meant for multiple messages anyway
	public addCondition<T>(messages: Message<T> | Iterable<Message<T>>, condition: (packet: Packet<RemotePeerType, T>) => string | void): void {
		this.verifyHasMessages(messages);
		this.messageHandler.addCondition(messages, condition);
	}
	public removeCondition<T>(messages: Message<T> | Iterable<Message<T>>, condition: (packet: Packet<RemotePeerType, T>) => string | void): void {
		this.verifyHasMessages(messages);
		this.messageHandler.removeCondition(messages, condition);
	}
	public addCallback<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, any>) => void): void {
		this.verifyHasMessages(message);
		this.messageHandler.addCallback(message, callback);
	}
	public removeCallback<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void): void {
		this.verifyHasMessages(message);
		this.messageHandler.removeCallback(message, callback);
	}
	public onMessage<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void): void {
		this.addCallback(message, callback);
	}
	public subscribeMessage<T>(message: Message<T>, callback: (packet: Packet<RemotePeerType, T>) => void, chain?: () => void): () => void {
		this.verifyHasMessages(message);
		return this.messageHandler.subscribeMessage(message, callback, chain);
	}
	
}
export class LocalMonoPeer extends LocalPeer<void> {
	
	
	constructor() {
		
		super();
		
	}
	
	public send<T>(message: Message<T>, data: T): void { // virtual
		
	}
	
	
}
export class LocalMultiPeer<RemotePeerType extends RemotePeer> extends LocalPeer<RemotePeerType> {
	
	public peerAdded = new Signal<RemotePeerType>();
	public peerDropped = new Signal<RemotePeerType>();
	
	public peerConnected = new Signal<RemotePeerType>();
	public peerDisconnected = new Signal<RemotePeerType>();
	public peerConnecting = new Signal<RemotePeerType>();
	public peerConnectionFailed = new Signal<RemotePeerType>();
	
	protected peerIndex = new RemotePeerIndex<RemotePeerType>();
	
	private peerListeners = new Map<RemotePeerType, SignalListener>();
	
	
	protected get peers() {
		return this.peerIndex.peers;
	}
	protected get ids() {
		return this.peerIndex.ids;
	}
	
	//private messageIndex: MessageIndex;
	//private messageHandler: MessageHandler;
	
	// Peer Management
	/*public hasPeerID(id: number): boolean {
		return this.ids.has(id);
	}
	public hasPeer(peer: RemotePeerType): boolean {
		return this.peers.has(peer);
	}*/
	
	public hasPeer(id: number): boolean {
		return this.peerIndex.hasPeer(id);
	}
	public getPeer(id: number): RemotePeerType | undefined {
		return this.peerIndex.getPeer(id);
	}
	
	public getPeers(): Set<RemotePeerType> {
		return this.peers;
	}
	
	
	public addPeer(peer: RemotePeerType, id: number = this.peerIndex.getNextID()): void {
		
		let listener = new SignalListener();
		this.peerListeners.set(peer, listener);
		
		listener.connect(peer.rawReceived, (raw: Uint8Array) => { this.handleRaw(peer, raw); });
		listener.connect(peer.connected, () => { this.peerConnected.emit(peer); });
		listener.connect(peer.disconnected, () => { this.peerDisconnected.emit(peer); });
		listener.connect(peer.connecting, () => { this.peerConnecting.emit(peer); });
		listener.connect(peer.connectionFailed, () => { this.peerConnectionFailed.emit(peer); });
		
		this.peerIndex.add(peer, id);
		peer.setID(id);
		//peer.setLocalPeer(this);
		
		this.peerAdded.emit(peer);
		
		switch (peer.state.value) {
			
			case ConnectionState.CONNECTED:
				this.peerConnected.emit(peer);
				break;
			
			case ConnectionState.CONNECTING:
				this.peerConnecting.emit(peer);
				break;
			
			case ConnectionState.DISCONNECTED:
				this.peerConnectionFailed.emit(peer);
				break;
			
		}
		
	}
	/*public disconnectPeer(peer: RemotePeerType) {
		peer.state.set(ConnectionState.DISCONNECTED);
	}*/
	
	public dropPeer(peer: RemotePeerType) {
		
		//if (peer.state.is(ConnectionState.CONNECTED))
		//	peer.state.set(ConnectionState.DISCONNECTED);
		peer.close();
		//this.disconnectPeer(peer);
		
		if (this.getPeer(peer.getID()) !== peer)
			console.error("Attempted to drop invalid peer.");
		
		if (!this.peerListeners.has(peer)) {
			console.error("Dropping peer that has no listener.");
		}
		else { // disconnect signals
			this.peerListeners.get(peer)?.disconnectAll();
			this.peerListeners.delete(peer);
		}
		
		this.peerIndex.remove(peer.getID());
		this.peerDropped.emit(peer);
		
	}
	//public disconnectPeer(): void {
	//	
	//}
	
	public getStatus(): MultiPeerConnectionStatus<RemotePeerType> {
		return this.peerIndex.getStatus();
	}
	public getIDStatus(): MultiPeerConnectionStatus<number> {
		return this.peerIndex.getIDStatus();
	}
	
	// Inbound Messages
	
	
	// Outbound Messages
	private sendSafe(peers: Set<RemotePeerType>, raw: Uint8Array, transferMode: TransferMode) {
		
		for (const peer of peers) {
			
			if (!this.peers.has(peer))
				console.error("Attempted to send to invalid peer.");
			else
				peer.sendRaw(raw, transferMode);
			
		}
		
	}
	
	
	public sendRaw(peers: RemotePeerType | Iterable<RemotePeerType>, raw: Uint8Array, transferMode = TransferMode.RELIABLE): void {
		this.sendSafe(new Set(peers instanceof RemotePeer ? [peers] : peers), raw, transferMode);
	}
	public sendRawAll(raw: Uint8Array, transferMode = TransferMode.RELIABLE): void {
		this.sendSafe(this.peers, raw, transferMode);
	}
	public sendRawAllExcept(exclusions: RemotePeerType | Iterable<RemotePeerType>, raw: Uint8Array, transferMode = TransferMode.RELIABLE): void {
		
		let peers = new Set(this.peers);
		
		for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
			peers.delete(peer);
		
		this.sendSafe(peers, raw, transferMode);
		
	}
	
	public send<T>(target: RemotePeerType | Iterable<RemotePeerType>, message: Message<T>, data?: T, transferMode = message.getTransferMode()): void {
		//this.sendRaw(target, this.messageIndex.createRaw(message, data), transferMode);
		this.sendRaw(target, this.createRaw(message, data), transferMode);
	}
	public sendAll<T>(message: Message<T>, data?: T, transferMode = message.getTransferMode()): void {
		//this.sendRawAll(this.messageDomain.createRaw(message, data), transferMode);
		this.sendRawAll(this.createRaw(message, data), transferMode);
	}
	public sendAllExcept<T>(exclusions: RemotePeerType | Iterable<RemotePeerType>, message: Message<T>, data?: T, transferMode = message.getTransferMode()): void {
		//this.sendRawAllExcept(exclusions, this.messageIndex.createRaw(message, data), transferMode);
		this.sendRawAllExcept(exclusions, this.createRaw(message, data), transferMode);
	}
	
	
}
export class RemotePeer extends Peer {
	
	public rawReceived = new Signal<Uint8Array>();
	
	//public localPeer: LocalMultiPeer;
	private groups = new Set<Group<any>>(); // weakset?
	
	
	
	constructor() {
		
		super();
		
		this.closed.connect(() => {
			for (const group of new Set(this.groups)) {
				group.remove(this);
			}
		})
		
	}
	
	/*public setLocalPeer(peer: LocalMultiPeer): void {
		this.localPeer = peer;
	}
	public getLocalPeer(): LocalMultiPeer | undefined {
		return this.localPeer;
	}*/
	
	// Group Management
	public hasGroup(group: Group<any>): boolean {
		return this.groups.has(group);
	}
	public hasStratumGroup(stratum: Set<Group<any>>): boolean {
		return this.getStratumGroup(stratum) !== undefined;
	}
	public getStratumGroup<GroupType extends Group<any>>(stratum: Set<GroupType>): GroupType | undefined {
		
		for (const group of this.groups)
			if (stratum.has(group as GroupType))
				return group as GroupType;
		
		return undefined;
		
	}
	public handleGroupEntry(group: Group<any>) {
		
		if (this.hasGroup(group))
			console.error("Attempted to add RemotePeer to duplicate group.");
		if (group.hasStratum() && this.hasStratumGroup(group.getStratum() as Set<Group<any>>))
			console.error("Added RemotePeer to more than one group in a given stratum.");
		
		this.groups.add(group);
		
	}
	public handleGroupExit(group: Group<any>) {
		
		if(!this.hasGroup(group))
			console.error("Attempted to remove RemotePeer from group it isn't in.");
		
		this.groups.delete(group);
		
	}
	
	// Inbound Messages
	protected handleRaw(raw: Uint8Array): void {
		this.rawReceived.emit(raw);
	}
	
	// Outbound Messages
	public sendRaw(raw: Uint8Array, transferMode = TransferMode.RELIABLE): void {
		
	}
	
}

//export type GroupStratum<PeerType extends RemotePeer, GroupType extends Group<PeerType>> = Set<GroupType>;
export class Group<PeerType extends RemotePeer> {
	
	public dropped = new Signal<void>();
	
	//public emptied = new Signal<void>();
	//public filled = new Signal<void>();
	
	public peersAdded = new Signal<Array<PeerType>>();
	public peersLeaving = new Signal<Array<PeerType>>();
	public peersRemoved = new Signal<Array<PeerType>>();
	
	//public peerAdded = new Signal<
	
	//protected stratum?: GroupStratum;
	protected stratum?: Set<Group<PeerType>>;
	protected capacity?: number;
	
	protected localPeer: LocalMultiPeer<PeerType>;
	protected peerIndex = new RemotePeerIndex<PeerType>(); // weakset?
	//protected nextID = 0; // probably convert to an array of freed IDs
	
	
	//private tags = new Set<Symbol>();
	
	/*[Symbol.iterator] (): Iterator<PeerType> {
		for (const peer of this.peerIndex.values()) {
			yield(peer);
		}
	}*/
	
	protected get peers() {
		return this.peerIndex.peers;
	}
	protected get ids() {
		return this.peerIndex.ids;
	}
	
	constructor(localPeer: LocalMultiPeer<PeerType>, stratum?: Set<Group<PeerType>>) {
		
		this.localPeer = localPeer;
		this.stratum = stratum;
		
	}
	
	
	
	public hasStratum(): boolean {
		return this.stratum !== undefined;
	}
	public getStratum(): Set<Group<PeerType>> | undefined {
		return this.stratum;
	}
	
	public getPeers(): Set<PeerType> {
		return this.peers;
	}
	public getPeerCount(): number {
		return this.peers.size;
	}
	
	public isEmpty(): boolean {
		return this.getPeerCount() == 0;
	}
	public isFull(): boolean {
		return this.capacity != undefined && this.getPeerCount() >= this.capacity;
	}
	
	public hasCapacity(): boolean {
		return this.capacity != undefined;
	}
	public getCapacity(): number {
		return this.capacity == undefined ? -1 : this.capacity;
	}
	public getRemainingCapacity(): number {
		return this.capacity == undefined ? -1 : (this.capacity - this.getPeerCount());
	}
	
	public has(...peers: Array<PeerType>): boolean {
		
		for (const peer of peers) {
			if (!this.peers.has(peer))
				return false;
		}
		
		return true;
	}
	public add(...peers: Array<PeerType>): Array<PeerType> {
		
		let added = new Array<PeerType>();
		
		for (const peer of peers) {
			
			if (!this.has(peer)) {
				added.push(peer);
			}
			
			if (this.isFull()) {
				//this.filled.emit();
				break;
			}
			
		}
		
		if (added.length > 0) {
			
			for (const peer of added)
				this.peers.add(peer);
			for (const peer of added)
				peer.handleGroupEntry(this);
			
			this.peersAdded.emit(added);
		
		}
		
		return added;
		
	};
	public remove(...peers: Array<PeerType>): Array<PeerType> {
		
		// Could probably stand to be optimized
		
		//let removed = peers.filter(this.has.bind(this));
		let removed = new Array<PeerType>();
		
		for (const peer of peers)
			if (this.has(peer))
				removed.push(peer);
		
		if (removed.length > 0) {
			
			this.peersLeaving.emit(removed);
			
			for (const peer of removed)
				this.peers.delete(peer);
			for (const peer of removed)
				peer.handleGroupExit(this);
			
			this.peersRemoved.emit(removed);
			
		}
		
		return removed;
		
	};
	
	public send<T>(peers: PeerType | Iterable<PeerType>, message: Message<T>, data: T = undefined as T, transferMode = message.getTransferMode()): void {
		this.localPeer.send(peers, message, data, transferMode);
	}
	public sendAll<T>(message: Message<T>, data: T = undefined as T, transferMode = message.getTransferMode()): void {
		this.localPeer.send(this.peers, message, data, transferMode);
	}
	public sendAllExcept<T>(exclusions: PeerType | Iterable<PeerType>, message: Message<T>, data: T = undefined as T, transferMode = message.getTransferMode()): void {
		
		let peers = new Set(this.peers);
		
		for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
			peers.delete(peer);
		
		this.localPeer.send(peers, message, data, transferMode);
		
	}
	
	public kill(): void {
		
		this.remove(...this.getPeers());
		//this.killed.emit();
		
	}
	
	//public getID(peer: Peer) {
	//	return peer.roomID;
	//}
	
}



/*export class Acknowledgement extends Deferrable<Array<Packet>> {
	
	//static ACCEPT = Symbol();
	//static REJECT = Symbol();
	
	
	
	
	
	private localPeer: LocalPeer;
	private message: Message;
	
	private peers = new Set<RemotePeer>();
	private packets = new Array<Packet>();
	
	// Internals
	private onMessage: (packet: Packet) => void;
	
	private condition?: ((packet: Packet) => boolean);
	private timeout?: NodeJS.Timeout;
	
	constructor(localPeer: LocalPeer, message: Message, peers: RemotePeer | Iterable<RemotePeer>) {
		
		super();
		
		this.localPeer = localPeer;
		this.message = message;
		
		this.peers = new Set<RemotePeer>(peers instanceof RemotePeer ? [peers] : peers);
		
		this.onMessage = ((packet: Packet) => {
			
			if (this.peers.has(packet.peer)) {
				
				if (this.condition == null || this.condition(packet) == true) {
					
					this.peers.delete(packet.peer);
					this.packets.push(packet);
					
					if (this.peers.size == 0)
						this.resolve(this.packets);
					
				}
				
			}
			
		});
		
		this.server.onMessage(message, this.onMessage);
		
	}
	
	private cleanup() {
		
		if (this.server != null && this.message != null)
			this.server.removeCallback(this.message, this.onMessage);
		
		if (this.timeout)
			clearTimeout(this.timeout);
		
	}
	
	public resolve(packets: Array<Packet> | PromiseLike<Array<Packet>>): void {
		
		this.cleanup();
		super.resolve(packets);
		
	}
	public reject(reason?: any): void {
		
		this.cleanup();
		super.resolve(reason);
		
	}
	
	public withCondition(condition: (packet: Packet) => boolean): Acknowledgement {
		this.condition = condition;
		return this;
	}
	public withTimeout(timeSec: number): Acknowledgement {
		
		if (this.timeout)
			clearTimeout(this.timeout);
		
		this.timeout = setTimeout((): void => {
			this.reject("Acknowledgement timed out.");
		}, timeSec * 1000);
		
		return this;
	}
	
}*/


/*let i = new IDIndex<string>();

i.add("hello");
i.add("world");
i.add("helloagain")
i.remove(1);
i.add("worldagain");
console.log(i.getValue(0));
console.log(i.getValue(1));
console.log(i.getValue(2));
console.log(i.values, i.ids, i.getNextID());*/

