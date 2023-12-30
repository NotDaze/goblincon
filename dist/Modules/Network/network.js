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
exports.Group = exports.RemotePeer = exports.LocalMultiPeer = exports.LocalMonoPeer = exports.RemotePeerIndex = exports.MessageHandler = exports.Message = exports.MessageDomain = exports.MessageNode = exports.Packet = exports.ConnectionState = exports.TransferMode = void 0;
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
    //public raw: Uint8Array;
    //public branching = new Array<number>();
    //public branching: Array<number>;
    constructor(message, peer, data, raw = new Uint8Array()) {
        this.message = message;
        this.peer = peer;
        this.data = data;
        //this.raw = raw;
    }
}
exports.Packet = Packet;
class MessageNode {
    constructor(address) {
        this.address = address;
    }
    findMessage(stream) {
        console.error("Overwrite MessageNode.findMessage()");
        return null;
    }
    packetToRaw() {
    }
    rawToPacket() {
    }
}
exports.MessageNode = MessageNode;
class MessageDomain extends MessageNode {
    constructor(idByteCount = 2, address = new Uint8Array(), nodes = []) {
        super(address);
        this.nodes = new id_index_1.default();
        this.idByteCount = idByteCount;
        //this.nodes = Array.from(nodes);
        for (const node of nodes)
            this.nodes.add(node);
    }
    findMessage(stream) {
        let id = arg_1.default.decodeInt(stream.next(this.idByteCount));
        let next = this.nodes.get(id);
        if (next == undefined) {
            console.error("Invalid domain node ID: ", this.address, " | ", id, " | ", this.nodes.ids);
            return null;
        }
        return next.findMessage(stream);
    }
    createNodeAddress(id = this.nodes.size) {
        //let id = this.nodes.getNextID();
        //let address = new Uint8Array(this.address.length + this.idByteCount);
        //address.set(this.address, 0);
        //address.set(this.)
        return arg_1.default.joinByteArrays(this.address, arg_1.default.encodeInt(id, this.idByteCount));
    }
    //public addNode(node: MessageNode): void {}
    getIdByteCount() {
        return this.idByteCount;
    }
    newDomain(idByteCount = this.idByteCount) {
        let id = this.nodes.getNextID();
        let domain = new MessageDomain(idByteCount, this.createNodeAddress(id));
        this.nodes.add(domain);
        //console.log("New domain: ", id);
        return domain;
    }
    newMessage(arg, transferMode = TransferMode.RELIABLE) {
        let id = this.nodes.getNextID();
        let message = new Message(this.createNodeAddress(id), arg, transferMode);
        this.nodes.add(message);
        //console.log("New message: ", id);
        return message;
    }
    /*public createRaw(): Uint8Array {
        
        let messageID = this.messages.indexOf(message);
        
        if (messageID < 0)
            throw "Invalid Message.";
        
        //let encodedData = message.encodePacketData(data);
        
        let stream = new ByteOStream();
        stream.write(Arg.encodeInt(messageID, this.idByteCount));
        message.streamEncode(data, stream);
        
        /*return ByteOStream.join(
            Arg.encodeInt(messageID, this.idByteCount),
            message.streamEncode(data)
        );*/
    //return stream.bytes;
    /*let out = new Uint8Array(this.idByteCount + encodedData.length);
    
    out.set(Arg.encodeInt(messageID, this.idByteCount), 0);
    out.set(encodedData, this.idByteCount);
    
    return out;*/
    //}
    createPackets(peer, raw) {
        //console.log(raw);
        let stream = new byteistream_1.default(raw);
        let packets = new Array();
        while (!stream.complete) {
            //let messageID = Arg.decodeInt(stream.next(this.idByteCount));
            //let message = this.messages[messageID];
            let message = this.findMessage(stream);
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
}
exports.MessageDomain = MessageDomain;
class Message extends MessageNode {
    //private conditions = new Array<(packet: Packet) => boolean>;
    constructor(address, arg, transferMode = TransferMode.RELIABLE) {
        super(address);
        //console.log(address);
        this.arg = arg;
        this.transferMode = transferMode;
    }
    findMessage(stream) {
        return this;
    }
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
    streamCreateRaw(data, stream) {
        // Consider changing this - if an encoding error happens, the message address will still be written
        stream.write(this.address);
        this.streamEncode(data, stream);
    }
    createRaw(data) {
        let stream = new byteostream_1.default();
        this.streamCreateRaw(data, stream);
        return stream.bytes;
    }
}
exports.Message = Message;
class MessageHandler {
    constructor() {
        this.conditions = new Map();
        this.signals = new Map();
    }
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
        if (this.hasMessageSignal(message)) {
            this.getMessageSignal(message).disconnect(callback);
        }
    }
    addCondition(messages, condition) {
        var _a;
        for (const message of (messages instanceof Message ? [messages] : messages)) {
            if (!this.conditions.has(message))
                this.conditions.set(message, new Set());
            (_a = this.conditions.get(message)) === null || _a === void 0 ? void 0 : _a.add(condition);
        }
    }
    removeCondition(messages, condition) {
        var _a;
        for (const message of (messages instanceof Message ? [messages] : messages))
            if (this.conditions.has(message))
                (_a = this.conditions.get(message)) === null || _a === void 0 ? void 0 : _a.delete(condition);
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
MessageHandler.CONDITION_PASSED = 0;
MessageHandler.CONDITION_FAILED = 1;
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
        let status = [new Set(), new Set(), new Set()];
        for (const peer of this.peers) {
            if (peer.state.value === ConnectionState.CONNECTED)
                status[1].add(peer);
            else if (peer.state.value === ConnectionState.DISCONNECTED)
                status[2].add(peer);
            else
                status[0].add(peer);
        }
        return status;
    }
    getIDStatus() {
        let status = this.getStatus();
        let idStatus = [new Set(), new Set(), new Set()];
        for (let i = 0; i < 3; i++)
            idStatus[i] = this.getPeerIDs(status[i]);
        return idStatus;
    }
}
exports.RemotePeerIndex = RemotePeerIndex;
class Peer {
    constructor() {
        this.id = -1;
        this.state = new state_1.default(ConnectionState.NEW);
        this.connected = new signal_1.default();
        this.disconnected = new signal_1.default();
        this.connecting = new signal_1.default();
        this.connectionFailed = new signal_1.default();
        this.closed = new signal_1.default();
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
    constructor(messageRoot = new MessageDomain(2), messageHandler = new MessageHandler()) {
        super();
        this.messageRoot = messageRoot;
        this.messageHandler = messageHandler;
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
        this.handlePackets(this.messageRoot.createPackets(peer, raw));
    }
    /*public newDomain(idByteCount = ) {
        return this.messageDomain.newDomain(idByteCount);
    }*/
    /*public newMessage(arg?: any, transferMode = TransferMode.RELIABLE): Message {
        return this.messageDomain.newMessage(arg, transferMode);
    }*/
    addCondition(messages, condition) {
        this.messageHandler.addCondition(messages, condition);
    }
    removeCondition(messages, condition) {
        this.messageHandler.removeCondition(messages, condition);
    }
    addCallback(message, callback) {
        this.messageHandler.addCallback(message, callback);
    }
    removeCallback(message, callback) {
        this.messageHandler.removeCallback(message, callback);
    }
    onMessage(message, callback) {
        this.addCallback(message, callback);
    }
}
class LocalMonoPeer extends LocalPeer {
    constructor(messageRoot = new MessageDomain(2), messageHandler = new MessageHandler()) {
        super(messageRoot, messageHandler);
    }
    send(message, data) {
    }
}
exports.LocalMonoPeer = LocalMonoPeer;
class LocalMultiPeer extends LocalPeer {
    constructor() {
        super(...arguments);
        this.peerAdded = new signal_1.default();
        this.peerDropped = new signal_1.default();
        this.peerConnected = new signal_1.default();
        this.peerDisconnected = new signal_1.default();
        this.peerConnecting = new signal_1.default();
        this.peerConnectionFailed = new signal_1.default();
        this.peerIndex = new RemotePeerIndex();
        this.peerListeners = new Map();
    }
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
        var _a;
        if (this.getPeer(peer.getID()) != peer)
            console.error("Attempted to drop invalid peer.");
        if (!this.peerListeners.has(peer)) {
            console.error("Dropping peer that has no listener.");
        }
        else { // disconnect signals
            (_a = this.peerListeners.get(peer)) === null || _a === void 0 ? void 0 : _a.disconnectAll();
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
        this.sendRaw(target, message.createRaw(data), transferMode);
    }
    sendAll(message, data, transferMode = message.getTransferMode()) {
        //this.sendRawAll(this.messageDomain.createRaw(message, data), transferMode);
        this.sendRawAll(message.createRaw(data), transferMode);
    }
    sendAllExcept(exclusions, message, data, transferMode = message.getTransferMode()) {
        //this.sendRawAllExcept(exclusions, this.messageIndex.createRaw(message, data), transferMode);
        this.sendRawAllExcept(exclusions, message.createRaw(data), transferMode);
    }
}
exports.LocalMultiPeer = LocalMultiPeer;
class RemotePeer extends Peer {
    constructor() {
        super();
        this.rawReceived = new signal_1.default();
        //public localPeer: LocalMultiPeer;
        this.groups = new Set(); // weakset?
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
        for (const group of this.groups) {
            if (stratum.has(group)) {
                return group;
            }
        }
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
class Group {
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
        this.dropped = new signal_1.default();
        //public emptied = new Signal<void>();
        //public filled = new Signal<void>();
        this.peersAdded = new signal_1.default();
        this.peersRemoved = new signal_1.default();
        this.peersLeaving = new signal_1.default();
        this.peerIndex = new RemotePeerIndex(); // weakset?
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
        //let removed = peers.filter(this.has.bind(this));
        let removed = new Array();
        for (const peer of peers) {
            if (this.has(peer)) {
                removed.push(peer);
            }
        }
        this.peersLeaving.emit(removed);
        for (const peer of removed)
            this.peers.delete(peer);
        for (const peer of removed)
            peer.handleGroupExit(this);
        this.peersRemoved.emit(removed);
        return removed;
    }
    ;
    send(peers, message, data, transferMode = message.getTransferMode()) {
        this.localPeer.send(peers, message, data, transferMode);
    }
    sendAll(message, data, transferMode = message.getTransferMode()) {
        this.localPeer.send(this.peers, message, data, transferMode);
    }
    sendAllExcept(exclusions, message, data, transferMode = message.getTransferMode()) {
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
