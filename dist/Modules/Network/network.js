"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.RemotePeer = exports.LocalMultiPeer = exports.LocalMonoPeer = exports.RemotePeerIndex = exports.MessageHandler = exports.Message = exports.Packet = exports.ConnectionState = exports.TransferMode = void 0;
const state_1 = __importDefault(require("../Core/state"));
const id_index_1 = __importDefault(require("../Core/id_index"));
const signal_1 = __importStar(require("../Core/signal"));
const byteistream_1 = __importDefault(require("../Core/byteistream"));
const byteostream_1 = __importDefault(require("../Core/byteostream"));
const arg_1 = __importDefault(require("./arg"));
var TransferMode;
(function (TransferMode) {
    TransferMode[TransferMode["RELIABLE"] = 0] = "RELIABLE";
    TransferMode[TransferMode["ORDERED"] = 1] = "ORDERED";
    TransferMode[TransferMode["UNRELIABLE"] = 2] = "UNRELIABLE";
})(TransferMode || (exports.TransferMode = TransferMode = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["NEW"] = 0] = "NEW";
    ConnectionState[ConnectionState["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState[ConnectionState["CONNECTED"] = 2] = "CONNECTED";
    ConnectionState[ConnectionState["DISCONNECTED"] = 3] = "DISCONNECTED";
    //CLOSED, // maybe
})(ConnectionState || (exports.ConnectionState = ConnectionState = {}));
class Packet {
    message;
    peer;
    data;
    //public raw: Uint8Array;
    //public branching = new Array<number>();
    //public branching: Array<number>;
    constructor(message, peer, data) {
        this.message = message;
        this.peer = peer;
        this.data = data;
        //this.raw = raw;
    }
}
exports.Packet = Packet;
class Message {
    //static META_TIMESTAMP = symbol("META_TIMESTAMP");
    /*static fromJSON() {
        
    }*/
    //static RAW = Symbol("RAW"); // maybe
    //type ArgT = T extends undefined ? undefined : ArgLike<T>;
    arg;
    transferMode; // Not sure this is actually necessary, but eh
    //private conditions = new Array<(packet: Packet) => boolean>;
    constructor(arg, transferMode = TransferMode.RELIABLE) {
        //super();
        this.arg = arg;
        this.transferMode = transferMode;
    }
    /*public findMessage(stream: ByteIStream): Message | undefined {
        return this;
    }*/
    getTransferMode() {
        return this.transferMode;
    }
    encode(data) {
        return arg_1.default.encode(this.arg, data);
    }
    streamEncode(data, stream) {
        arg_1.default.streamEncode(this.arg, data, stream);
    }
    decode(raw) {
        return arg_1.default.decode(this.arg, raw);
    }
    streamDecode(stream) {
        return arg_1.default.streamDecode(this.arg, stream);
    }
}
exports.Message = Message;
class MessageHandler {
    static CONDITION_PASSED = 0;
    static CONDITION_FAILED = 1;
    //private messageRoot: MessageDomain;
    //private addresses = new Map<Message, Uint8Array>();
    conditions = new Map();
    signals = new Map();
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
    hasMessageSignal(message) {
        return this.signals.has(message);
    }
    getMessageSignal(message) {
        let signal = this.signals.get(message);
        if (!signal) {
            signal = new signal_1.default();
            this.signals.set(message, signal);
        }
        return signal;
    }
    addCallback(message, callback) {
        this.getMessageSignal(message).connect(callback);
    }
    removeCallback(message, callback) {
        if (this.hasMessageSignal(message))
            this.getMessageSignal(message).disconnect(callback);
    }
    addCondition(messages, condition) {
        for (const message of (messages instanceof Message ? [messages] : messages)) {
            if (!this.conditions.has(message))
                this.conditions.set(message, new Set());
            this.conditions.get(message)?.add(condition);
        }
    }
    removeCondition(messages, condition) {
        for (const message of (messages instanceof Message ? [messages] : messages))
            if (this.conditions.has(message))
                this.conditions.get(message)?.delete(condition);
    }
    onMessage(message, callback) {
        this.addCallback(message, callback);
    }
    handlePacket(packet) {
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
    handlePackets(packets) {
        for (const packet of packets)
            this.handlePacket(packet);
    }
}
exports.MessageHandler = MessageHandler;
class RemotePeerIndex extends id_index_1.default {
    get peers() {
        return this.values;
    }
    *stateFilter(...states) {
        /*let peers = new Set<PeerType>();
        
        for (const peer of this.values)
            if (peer.state.any(...states))
                peers.add(peer);
        
        return peers;*/
        for (const peer of this.values)
            if (peer.state.any(...states))
                yield peer;
    }
    hasPeer(id) {
        return this.map.has(id);
    }
    getPeer(id) {
        return this.map.get(id);
    }
    getPeers(ids) {
        if (ids == undefined)
            return this.peers;
        let out = new Set();
        for (const id of ids) {
            let peer = this.getPeer(id);
            if (peer !== undefined) // error message?
                out.add(peer);
        }
        return out;
    }
    getPeerIDs(peers) {
        let out = new Set();
        for (const peer of peers)
            out.add(peer.getID());
        return out;
    }
    getStatus() {
        let status = [new Array(), new Array(), new Array()];
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
    getIDStatus() {
        let status = this.getStatus();
        let idStatus = [[], [], []];
        for (let i = 0; i < 3; i++)
            idStatus[i] = Array.from(this.getPeerIDs(status[i]));
        return idStatus;
    }
}
exports.RemotePeerIndex = RemotePeerIndex;
class Peer {
    id = -1;
    state = new state_1.default(ConnectionState.NEW);
    connected = new signal_1.default();
    disconnected = new signal_1.default();
    connecting = new signal_1.default();
    connectionFailed = new signal_1.default();
    closed = new signal_1.default();
    constructor() {
        this.state.changed.connect(([oldState, newState]) => {
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
        });
    }
    hasID() {
        return this.id >= 0;
    }
    getID() {
        return this.id;
    }
    setID(newID) {
        this.id = newID;
    }
    close() {
        this.state.set(ConnectionState.DISCONNECTED);
        this.closed.emit();
    }
}
class LocalPeer extends Peer {
    messages = new Array();
    messageHandler;
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
        return arg_1.default.calculateByteCount(this.messages.length);
    }
    hasMessage(message) {
        return this.messages.includes(message);
    }
    getMessageID(message) {
        return this.messages.indexOf(message);
    }
    addMessage(message) {
        this.messages.push(message);
    }
    addMessages(messages) {
        for (const message of messages)
            this.addMessage(message);
    }
    createPackets(peer, raw) {
        //console.log(raw);
        let stream = new byteistream_1.default(raw);
        let packets = new Array();
        while (!stream.complete) {
            //let messageID = Arg.decodeInt(stream.next(this.idByteCount));
            //let message = this.messages[messageID];
            let id = arg_1.default.decodeInt(stream.next(this.idByteCount));
            let message = this.messages[id];
            if (!message) {
                console.error("Unrecognized Message | ", raw);
                break;
            }
            //packets.push(message.createPacket(stream));
            packets.push(new Packet(message, peer, message.streamDecode(stream)));
        }
        stream.verifyExactComplete();
        return packets;
    }
    streamCreateRaw(message, data, stream) {
        //let address = this.getMessageAddress(message);
        let id = this.getMessageID(message);
        if (id < 0)
            throw new Error("Invalid message for LocalPeer.streamCreateRaw()");
        stream.write(arg_1.default.encodeInt(id, this.idByteCount));
        message.streamEncode(data, stream);
    }
    createRaw(message, data) {
        let stream = new byteostream_1.default();
        this.streamCreateRaw(message, data, stream);
        return stream.bytes;
    }
    //private handleRaw(peer: RemotePeer, raw: Uint8Array): void {
    //	this.handlePackets(this.messageIndex.createPackets(peer, raw));
    //}
    handlePackets(packets) {
        for (const packet of packets)
            this.handlePacket(packet);
    }
    handlePacket(packet) {
        this.messageHandler.handlePacket(packet);
    }
    handleRaw(peer, raw) {
        this.handlePackets(this.createPackets(peer, raw));
    }
    /*public newDomain(idByteCount = ) {
        return this.messageDomain.newDomain(idByteCount);
    }*/
    /*public newMessage(arg?: any, transferMode = TransferMode.RELIABLE): Message {
        return this.messageDomain.newMessage(arg, transferMode);
    }*/
    verifyHasMessages(messages) {
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
    addCondition(messages, condition) {
        this.verifyHasMessages(messages);
        this.messageHandler.addCondition(messages, condition);
    }
    removeCondition(messages, condition) {
        this.verifyHasMessages(messages);
        this.messageHandler.removeCondition(messages, condition);
    }
    addCallback(message, callback) {
        this.verifyHasMessages(message);
        this.messageHandler.addCallback(message, callback);
    }
    removeCallback(message, callback) {
        this.verifyHasMessages(message);
        this.messageHandler.removeCallback(message, callback);
    }
    onMessage(message, callback) {
        this.addCallback(message, callback);
    }
}
class LocalMonoPeer extends LocalPeer {
    constructor() {
        super();
    }
    send(message, data) {
    }
}
exports.LocalMonoPeer = LocalMonoPeer;
class LocalMultiPeer extends LocalPeer {
    peerAdded = new signal_1.default();
    peerDropped = new signal_1.default();
    peerConnected = new signal_1.default();
    peerDisconnected = new signal_1.default();
    peerConnecting = new signal_1.default();
    peerConnectionFailed = new signal_1.default();
    peerIndex = new RemotePeerIndex();
    peerListeners = new Map();
    get peers() {
        return this.peerIndex.peers;
    }
    get ids() {
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
    hasPeer(id) {
        return this.peerIndex.hasPeer(id);
    }
    getPeer(id) {
        return this.peerIndex.getPeer(id);
    }
    getPeers() {
        return this.peers;
    }
    addPeer(peer, id = this.peerIndex.getNextID()) {
        let listener = new signal_1.SignalListener();
        this.peerListeners.set(peer, listener);
        listener.connect(peer.rawReceived, (raw) => { this.handleRaw(peer, raw); });
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
    dropPeer(peer) {
        if (this.getPeer(peer.getID()) != peer)
            console.error("Attempted to drop invalid peer.");
        if (!this.peerListeners.has(peer)) {
            console.error("Dropping peer that has no listener.");
        }
        else { // disconnect signals
            this.peerListeners.get(peer)?.disconnectAll();
            this.peerListeners.delete(peer);
        }
        this.peerIndex.remove(peer.getID());
        //peer.close();
        this.peerDropped.emit(peer);
    }
    getStatus() {
        return this.peerIndex.getStatus();
    }
    getIDStatus() {
        return this.peerIndex.getIDStatus();
    }
    // Inbound Messages
    // Outbound Messages
    sendSafe(peers, raw, transferMode) {
        for (const peer of peers) {
            if (!this.peers.has(peer))
                console.error("Attempted to send to invalid peer.");
            else
                peer.sendRaw(raw, transferMode);
        }
    }
    sendRaw(peers, raw, transferMode = TransferMode.RELIABLE) {
        this.sendSafe(new Set(peers instanceof RemotePeer ? [peers] : peers), raw, transferMode);
    }
    sendRawAll(raw, transferMode = TransferMode.RELIABLE) {
        this.sendSafe(this.peers, raw, transferMode);
    }
    sendRawAllExcept(exclusions, raw, transferMode = TransferMode.RELIABLE) {
        let peers = new Set(this.peers);
        for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
            peers.delete(peer);
        this.sendSafe(peers, raw, transferMode);
    }
    send(target, message, data, transferMode = message.getTransferMode()) {
        //this.sendRaw(target, this.messageIndex.createRaw(message, data), transferMode);
        this.sendRaw(target, this.createRaw(message, data), transferMode);
    }
    sendAll(message, data, transferMode = message.getTransferMode()) {
        //this.sendRawAll(this.messageDomain.createRaw(message, data), transferMode);
        this.sendRawAll(this.createRaw(message, data), transferMode);
    }
    sendAllExcept(exclusions, message, data, transferMode = message.getTransferMode()) {
        //this.sendRawAllExcept(exclusions, this.messageIndex.createRaw(message, data), transferMode);
        this.sendRawAllExcept(exclusions, this.createRaw(message, data), transferMode);
    }
}
exports.LocalMultiPeer = LocalMultiPeer;
class RemotePeer extends Peer {
    rawReceived = new signal_1.default();
    //public localPeer: LocalMultiPeer;
    groups = new Set(); // weakset?
    constructor() {
        super();
        this.closed.connect(() => {
            for (const group of new Set(this.groups)) {
                group.remove(this);
            }
        });
    }
    /*public setLocalPeer(peer: LocalMultiPeer): void {
        this.localPeer = peer;
    }
    public getLocalPeer(): LocalMultiPeer | undefined {
        return this.localPeer;
    }*/
    // Group Management
    hasGroup(group) {
        return this.groups.has(group);
    }
    hasStratumGroup(stratum) {
        return this.getStratumGroup(stratum) !== undefined;
    }
    getStratumGroup(stratum) {
        for (const group of this.groups)
            if (stratum.has(group))
                return group;
        return undefined;
    }
    handleGroupEntry(group) {
        if (this.hasGroup(group))
            console.error("Attempted to add RemotePeer to duplicate group.");
        if (group.hasStratum() && this.hasStratumGroup(group.getStratum()))
            console.error("Added RemotePeer to more than one group in a given stratum.");
        this.groups.add(group);
    }
    handleGroupExit(group) {
        if (!this.hasGroup(group))
            console.error("Attempted to remove RemotePeer from group it isn't in.");
        this.groups.delete(group);
    }
    // Inbound Messages
    handleRaw(raw) {
        this.rawReceived.emit(raw);
    }
    // Outbound Messages
    sendRaw(raw, transferMode = TransferMode.RELIABLE) {
    }
}
exports.RemotePeer = RemotePeer;
//export type GroupStratum<PeerType extends RemotePeer, GroupType extends Group<PeerType>> = Set<GroupType>;
class Group {
    dropped = new signal_1.default();
    //public emptied = new Signal<void>();
    //public filled = new Signal<void>();
    peersAdded = new signal_1.default();
    peersRemoved = new signal_1.default();
    peersLeaving = new signal_1.default();
    //protected stratum?: GroupStratum;
    stratum;
    capacity;
    localPeer;
    peerIndex = new RemotePeerIndex(); // weakset?
    //protected nextID = 0; // probably convert to an array of freed IDs
    //private tags = new Set<Symbol>();
    /*[Symbol.iterator] (): Iterator<PeerType> {
        for (const peer of this.peerIndex.values()) {
            yield(peer);
        }
    }*/
    get peers() {
        return this.peerIndex.peers;
    }
    get ids() {
        return this.peerIndex.ids;
    }
    constructor(localPeer, stratum) {
        this.localPeer = localPeer;
        this.stratum = stratum;
    }
    hasStratum() {
        return this.stratum !== undefined;
    }
    getStratum() {
        return this.stratum;
    }
    getPeers() {
        return this.peers;
    }
    getPeerCount() {
        return this.peers.size;
    }
    isEmpty() {
        return this.getPeerCount() == 0;
    }
    isFull() {
        return this.capacity != undefined && this.getPeerCount() >= this.capacity;
    }
    hasCapacity() {
        return this.capacity != undefined;
    }
    getCapacity() {
        return this.capacity == undefined ? -1 : this.capacity;
    }
    getRemainingCapacity() {
        return this.capacity == undefined ? -1 : (this.capacity - this.getPeerCount());
    }
    has(...peers) {
        for (const peer of peers) {
            if (!this.peers.has(peer))
                return false;
        }
        return true;
    }
    add(...peers) {
        let added = new Array();
        for (const peer of peers) {
            if (!this.has(peer)) {
                added.push(peer);
            }
            if (this.isFull()) {
                //this.filled.emit();
                break;
            }
        }
        for (const peer of added)
            this.peers.add(peer);
        for (const peer of added)
            peer.handleGroupEntry(this);
        this.peersAdded.emit(added);
        return added;
    }
    ;
    remove(...peers) {
        // Could probably stand to be optimized
        //let removed = peers.filter(this.has.bind(this));
        let removed = new Array();
        for (const peer of peers)
            if (this.has(peer))
                removed.push(peer);
        this.peersLeaving.emit(removed);
        for (const peer of removed)
            this.peers.delete(peer);
        for (const peer of removed)
            peer.handleGroupExit(this);
        this.peersRemoved.emit(removed);
        return removed;
    }
    ;
    send(peers, message, data = undefined, transferMode = message.getTransferMode()) {
        this.localPeer.send(peers, message, data, transferMode);
    }
    sendAll(message, data = undefined, transferMode = message.getTransferMode()) {
        this.localPeer.send(this.peers, message, data, transferMode);
    }
    sendAllExcept(exclusions, message, data = undefined, transferMode = message.getTransferMode()) {
        let peers = new Set(this.peers);
        for (const peer of (exclusions instanceof RemotePeer ? [exclusions] : exclusions))
            peers.delete(peer);
        this.localPeer.send(peers, message, data, transferMode);
    }
    kill() {
        this.remove(...this.getPeers());
        //this.killed.emit();
    }
}
exports.Group = Group;
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
