/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const game_client_1 = __importDefault(__webpack_require__(1));
//import Color from "../Modules/Core/color"
const canvas_1 = __importDefault(__webpack_require__(13));
const draw_pad_1 = __importDefault(__webpack_require__(14));
//import { PhysicsBody } from "../Modules/Engine/Physics/physics"
//import SortedArray from "../Modules/Core/sorted_array"
//const socket = new Socket("ws://localhost:5050", ["soap"]);
//const drawPad = new DrawPad(Canvas.createWithParent(document.body));
//drawPad.canvas.fitParentPersistent(1000, 1000);
//drawPad.
//drawPad.canvas.clear(1.0, 1.0, 1.0);
//drawPad.canvas.style.setFill(0, 0, 0);
//drawPad.canvas.fillCircle(0, 0, 50);
//drawPad.canvas.
/*drawPad.canvas.resized.connect(() => {
    drawPad.canvas.clear(1.0, 1.0, 1.0);
    drawPad.canvas.style.setFill(0, 0, 0);
    drawPad.canvas.fillCircle(400, 400, 50);
    
});*/
/*const canvas = Canvas.create(document.body);

canvas.resized.connect(() => {
    canvas.clear(1.0, 1.0, 1.0);
    canvas.style.setFill(0, 0, 0);
    canvas.fillCircle(800, 450, 50);
});*/
//canvas.fitParentPersistent(1600, 900);
//canvas.setFill(0, 0, 0);
//canvas.fitElementPersistent(document.body, 1600, 900);
//canvas.fitElementPersistent(document.body, 1600, 900);
/*canvas.clear(1.0, 1.0, 1.0);
canvas.style.setFill(0, 0, 0);
canvas.fillCircle(800, 450, 50);*/
/*let src = Canvas.create();
//src.setStretchFactor(10.0);
src.setSize(1000, 1000);
src.setStretchFactor(10.0);

let dest = Canvas.createWithParent(document.body);
dest.fitParentPersistent(100, 100);

src.wipe(1.0, 1.0, 1.0);
src.setFill(1.0, 0.0, 0.0);
src.setStroke(0.0, 0.0, 0.0);
src.ellipse(30, 30, 20);

dest.apply(src);
dest.sizeChanged.connect(() => dest.apply(src));*/
let canvas = canvas_1.default.createWithParent(document.body);
canvas.fitParentPersistent(1000, 1000);
let drawPad = new draw_pad_1.default(canvas);
const client = new game_client_1.default("ws://localhost:5050");
client.connected.connect(() => {
    console.log("connected!");
});
window.onbeforeunload = (() => {
    client.close();
});


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteGameClient = void 0;
const network_1 = __webpack_require__(2);
const mesh_client_1 = __importStar(__webpack_require__(10));
const arg_1 = __importDefault(__webpack_require__(9));
const TEST = new network_1.Message(arg_1.default.STRING2);
const MESSAGE_ROOT = new network_1.MessageDomain([
    TEST
]);
//const TEST = MessageRoot.newMessage(Arg.STRING2);
// Host creates game (via server)
// Server generates a token
// Server gives token to host
// Clients connect to server
// 
class RemoteGameClient extends mesh_client_1.RemoteMeshClient {
    constructor() {
        super();
    }
}
exports.RemoteGameClient = RemoteGameClient;
class LocalGameClient extends mesh_client_1.default {
    constructor(serverUrl, protocols = []) {
        super(MESSAGE_ROOT, RemoteGameClient, serverUrl, protocols, new network_1.MessageHandler);
        this.connected.connect(() => {
            this.sendAll(TEST, "Hello world!");
        });
        this.onMessage(TEST, (packet) => {
            console.log(packet.peer.getID(), ": ", packet.data);
        });
    }
}
exports["default"] = LocalGameClient;


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Group = exports.RemotePeer = exports.LocalMultiPeer = exports.LocalMonoPeer = exports.RemotePeerIndex = exports.MessageHandler = exports.Message = exports.MessageDomain = exports.Packet = exports.ConnectionState = exports.TransferMode = void 0;
const state_1 = __importDefault(__webpack_require__(3));
const id_index_1 = __importDefault(__webpack_require__(5));
const signal_1 = __importStar(__webpack_require__(4));
const byteistream_1 = __importDefault(__webpack_require__(7));
const byteostream_1 = __importDefault(__webpack_require__(8));
const arg_1 = __importDefault(__webpack_require__(9));
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
    constructor(message, peer, data, raw = new Uint8Array()) {
        this.message = message;
        this.peer = peer;
        this.data = data;
        //this.raw = raw;
    }
}
exports.Packet = Packet;
class MessageNode {
    //protected address: Uint8Array;
    /*constructor(address: Uint8Array) {
        this.address = address;
    }*/
    findMessage(stream) {
        console.error("Overwrite MessageNode.findMessage()");
        return undefined;
    }
}
class MessageDomain extends MessageNode {
    //private nodes: Map<;
    nodes = new Array();
    idByteCount;
    constructor(nodes, idByteCount = 1) {
        //super(address);
        super();
        this.idByteCount = idByteCount;
        //this.nodes = Array.from(nodes);
        this.nodes = Array.from(nodes);
    }
    *[Symbol.iterator]() {
        for (const node of this.nodes)
            yield node;
    }
    findMessage(stream) {
        let id = arg_1.default.decodeInt(stream.next(this.idByteCount));
        let next = this.nodes[id];
        if (next === undefined) {
            //console.error("Invalid domain node ID: ", this.address, " | ", id, " | ", this.nodes.ids);
            console.error("Invalid domain node ID: ", id);
            return undefined;
        }
        return next.findMessage(stream);
    }
    /*private createNodeAddress(id = this.nodes.size): Uint8Array {
        
        //let id = this.nodes.getNextID();
        
        //let address = new Uint8Array(this.address.length + this.idByteCount);
        //address.set(this.address, 0);
        //address.set(this.)
        
        return Arg.joinByteArrays(
            this.address,
            Arg.encodeInt(id, this.idByteCount)
        );
        
    }*/
    //public addNode(node: MessageNode): void {}
    getIdByteCount() {
        return this.idByteCount;
    }
}
exports.MessageDomain = MessageDomain;
class Message extends MessageNode {
    //static META_TIMESTAMP = symbol("META_TIMESTAMP");
    /*static fromJSON() {
        
    }*/
    //static RAW = Symbol("RAW"); // maybe
    arg;
    transferMode; // Not sure this is actually necessary, but eh
    //private conditions = new Array<(packet: Packet) => boolean>;
    constructor(arg, transferMode = TransferMode.RELIABLE) {
        super();
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
    messageRoot;
    addresses = new Map();
    messageHandler;
    constructor(messageRoot, messageHandler = new MessageHandler()) {
        super();
        this.messageRoot = messageRoot;
        this.messageHandler = messageHandler;
        this.indexAddresses(messageRoot);
    }
    indexAddresses(node, address = new Uint8Array()) {
        if (node instanceof MessageDomain) {
            let i = 0;
            for (const child of node) {
                this.indexAddresses(child, arg_1.default.joinByteArrays(address, arg_1.default.encodeInt(i, node.getIdByteCount())));
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
    createPackets(peer, raw) {
        //console.log(raw);
        let stream = new byteistream_1.default(raw);
        let packets = new Array();
        while (!stream.complete) {
            //let messageID = Arg.decodeInt(stream.next(this.idByteCount));
            //let message = this.messages[messageID];
            let message = this.messageRoot.findMessage(stream);
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
        let address = this.getMessageAddress(message);
        if (address === undefined)
            throw new Error("Invalid message for LocalPeer.streamCreateRaw()");
        stream.write(address);
        message.streamEncode(data, stream);
    }
    createRaw(message, data) {
        let stream = new byteostream_1.default();
        this.streamCreateRaw(message, data, stream);
        return stream.bytes;
    }
    hasMessage(message) {
        return this.addresses.has(message);
    }
    getMessageAddress(message) {
        return this.addresses.get(message);
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
    constructor(messageRoot, messageHandler = new MessageHandler()) {
        super(messageRoot, messageHandler);
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


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const signal_1 = __importDefault(__webpack_require__(4));
class State {
    changed = new signal_1.default();
    value;
    constructor(value) {
        this.value = value;
    }
    is(value) {
        return this.value == value;
    }
    any(...values) {
        return values.includes(this.value);
    }
    set(newValue) {
        if (newValue !== this.value) {
            let oldValue = this.value;
            this.value = newValue;
            this.changed.emit([oldValue, newValue]);
        }
    }
}
exports["default"] = State;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalListener = void 0;
;
class SignalListener {
    connections = new Map();
    register(signal, callback) {
        if (!this.connections.has(signal))
            this.connections.set(signal, new Set());
        this.connections.get(signal)?.add(callback);
    }
    unregister(signal, callback) {
        let signalCallbacks = this.connections.get(signal);
        if (signalCallbacks === undefined)
            return;
        signalCallbacks.delete(callback);
        if (signalCallbacks.size === 0)
            this.connections.delete(signal);
    }
    /*public pconnect<ArgType>(signal: Signal<ArgType>, priority: number, callback: (arg: ArgType) => void): (arg: ArgType) => void {
        this.register(signal, callback);
        return signal.pconnect(priority, cal-lback);
    }*/
    connect(signal, callback) {
        this.register(signal, callback);
        return signal.connect(callback);
    }
    disconnect(signal, callback) {
        this.unregister(signal, callback);
        signal.disconnect(callback);
    }
    disconnectAll() {
        for (const [signal, callbacks] of this.connections.entries())
            for (const callback of callbacks)
                signal.disconnect(callback);
        this.connections.clear();
    }
}
exports.SignalListener = SignalListener;
class Signal extends Set {
    static DISCONNECT = Symbol();
    //private callbacks = new PrioritySet<(arg: ArgType) => any>();
    //private callbacks: Array<(arg: ArgType) => any> = [];
    //private callbacks = new Set<(arg: ArgType) => any>;
    static fromEvent(emitter, event) {
        let newSignal = new Signal();
        newSignal.bindEvent(emitter, event);
        return newSignal;
    }
    static fromSignal(signal) {
        let newSignal = new Signal();
        newSignal.bindSignal(signal);
        return newSignal;
    }
    bindEvent(emitter, event) {
        emitter.on(event, this.emit.bind(this));
    }
    bindSignal(signal) {
        signal.connect(this.emit.bind(this));
    }
    /*private pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
        this.callbacks.add(priority, callback);
        return callback;
    }*/
    connect(callback) {
        //return this.pconnect(0, callback);
        this.add(callback);
        return callback;
    }
    disconnect(callback) {
        this.delete(callback);
    }
    disconnectAll() {
        this.clear();
    }
    emit(arg) {
        for (const callback of this) {
            //let out = callback(arg);
            callback(arg);
            /*if (out === Signal.DISCONNECT)
                this.disconnect(callback);*/
            // Gotta iterate backwards or something for this to work properly
        }
    }
}
exports["default"] = Signal;
/*export default class Signal<ArgType> implements SignalLike<ArgType> { // Maybe make this extend set..?
    
    static DISCONNECT: symbol = Symbol();
    
    //private callbacks = new PrioritySet<(arg: ArgType) => any>();
    //private callbacks: Array<(arg: ArgType) => any> = [];
    private callbacks = new Set<(arg: ArgType) => any>;
    
    static fromEvent<ArgType>(emitter: EventEmitter, event: string): Signal<ArgType> {
        let newSignal = new Signal<ArgType>();
        newSignal.bindEvent(emitter, event);
        return newSignal;
    }
    static fromSignal<ArgType>(signal: Signal<ArgType>) {
        let newSignal = new Signal<ArgType>();
        newSignal.bindSignal(signal);
        return newSignal;
    }
    
    
    
    public bindEvent(emitter: EventEmitter, event: string): void {
        emitter.on(event, this.emit.bind(this));
    }
    public bindSignal(signal: Signal<ArgType>): void {
        signal.connect(this.emit.bind(this));
    }
    
    //private pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
    //	this.callbacks.add(priority, callback);
    //	return callback;
    //}
    public connect(callback: (arg: ArgType) => void): (arg: ArgType) => void {
        //return this.pconnect(0, callback);
        this.callbacks.add(callback);
        return callback;
    }
    public disconnect(callback: (arg: ArgType) => void): void {
        this.callbacks.delete(callback);
    }
    public disconnectAll(): void {
        this.callbacks.clear();
    }
    
    public emit(arg: ArgType): void {
        
        for (const callback of this.callbacks) {
            
            //let out = callback(arg);
            callback(arg);
            
            //if (out === Signal.DISCONNECT)
            //	this.disconnect(callback);
            // Gotta iterate backwards or something for this to work properly
            
        }
        
    }
    
}*/


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sorted_array_1 = __importDefault(__webpack_require__(6));
class IDIndex {
    map = new Map();
    ids = new Set();
    values = new Set();
    highestID = -1;
    freeIDs = new Array();
    *[Symbol.iterator]() {
        for (const value of this.map.values())
            yield value;
    }
    get size() {
        return this.values.size;
    }
    trim() {
        while (this.highestID >= 0) {
            // If highest freed id is our highest id, trim and continue
            if (this.freeIDs.at(-1) === this.highestID) {
                this.freeIDs.pop();
                this.highestID--;
            }
            else {
                return;
            }
        }
    }
    freeID(id) {
        if (id === this.highestID) { // Trim
            this.highestID--;
            this.trim();
        }
        else {
            sorted_array_1.default.insert(this.freeIDs, id);
        }
    }
    reserveID(id) {
        if (id > this.highestID) {
            // Add intervening free ids. If old highest is 0, and new is 2, 1 is now free
            for (let i = this.highestID + 1; i < id; i++)
                this.freeIDs.push(i);
            this.highestID = id;
        }
        else { // Using a free ID, from the array
            let index = this.freeIDs.indexOf(id);
            if (index >= 0)
                this.freeIDs.splice(index, 1);
            else
                console.error("Index duplicate ID error.");
        }
    }
    getNextID() {
        // Use lowest freed ID, if we have any
        if (this.freeIDs.length > 0)
            return this.freeIDs[0];
        return this.highestID + 1;
    }
    has(id) {
        return this.map.has(id);
    }
    get(id) {
        return this.map.get(id);
    }
    hasValue(value) {
        return this.values.has(value);
    }
    add(value, id = this.getNextID()) {
        if (this.ids.has(id))
            console.error("Index ID collision");
        this.map.set(id, value);
        this.values.add(value);
        this.ids.add(id);
        this.reserveID(id);
        return id;
    }
    remove(id) {
        let value = this.map.get(id);
        if (value === undefined) {
            console.error("Removing value from ID index that isn't there.");
            return;
        }
        this.map.delete(id);
        this.values.delete(value);
        this.ids.delete(id);
        this.freeID(id);
    }
}
exports["default"] = IDIndex;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function defaultCompare(lhs, rhs) {
    if (lhs === rhs)
        return 0;
    else if (lhs < rhs)
        return -1;
    else
        return 1;
}
function binarySearch(array, value, compare, insert = false, left = 0, right = array.length - 1) {
    if (left > right)
        return insert ? left : -1;
    let mid = Math.floor((left + right) / 2);
    let cmp = compare(value, array[mid]);
    if (left === right) {
        if (insert) {
            if (cmp <= 0)
                return mid; // Insert before
            else
                return mid + 1; // Insert after
        }
        else {
            if (cmp === 0)
                return mid;
            else
                return -1;
        }
    }
    if (cmp === 0)
        return mid;
    else if (cmp < 0)
        return binarySearch(array, value, compare, insert, left, mid - 1);
    else
        return binarySearch(array, value, compare, insert, mid + 1, right);
}
/*function binaryFindSearch<T>(array: Array<T>, value: T, compare: (lhs: T, rhs: T) => number = defaultCompare): number {
    return binarySearch(array, value, compare, false);
}*/
function binaryInsertSearch(array, value, compare = defaultCompare) {
    return binarySearch(array, value, compare, true);
}
class SortedArray extends Array {
    static insert(array, value, compare = defaultCompare) {
        let index = binaryInsertSearch(array, value, compare);
        array.splice(index, 0, value);
        return index;
    }
    static remove(array, value, compare = defaultCompare) {
        let index = binarySearch(array, value, compare);
        /*if (index >= array.length)
            return -1; // Value not in array, and greater than the rightmost value
        if (compare(value, array[index]) !== 0)
            return -1; // Value not in array, and would fall somewhere in the middle*/
        if (index >= 0)
            array.splice(index, 1);
        return index;
    }
}
exports["default"] = SortedArray;
;
/*let test: Array<number> = [];

for (let i = 0; i < 30; i++) {
    SortedArray.insert(test, Math.pow(i, 2) % 11);
}

console.log(test, " ", test.length);

for (let i = 0; i < 10; i++) {
    SortedArray.remove(test, test[0]);
    console.log(test, " ", test.length);
    SortedArray.remove(test, test[test.length - 1]);
    console.log(test, " ", test.length);
}*/


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ByteIStream {
    bytes;
    index = 0;
    constructor(bytes) {
        this.bytes = bytes;
        //this.index = 0;
    }
    get complete() {
        return this.index >= this.bytes.length;
    }
    get exactComplete() {
        return this.index === this.bytes.length;
    }
    *next(count) {
        //console.log(this.bytes.slice(this.index, this.index + count));
        //return this.bytes.slice(this.index, this.index += count);
        let start = this.index;
        let end = (this.index += count); // Store this so that outside changes can't screw anything up
        if (end > this.bytes.length) {
            console.error("ByteIStream length exceeded.");
            end = this.bytes.length;
        }
        for (let i = start; i < end; i++)
            yield this.bytes[i];
    }
    nextArray(count) {
        return this.bytes.slice(this.index, this.index += count);
    }
    /*public *next(count: number): Uint8Array {
        
    }*/
    verifyExactComplete() {
        if (!this.exactComplete) {
            console.error("ByteIStream Error");
            console.error(this.bytes);
            console.error(this.index);
        }
    }
}
exports["default"] = ByteIStream;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ByteOStream {
    static join(...byteArrays) {
        if (byteArrays.length === 0)
            return new Uint8Array();
        if (byteArrays.length === 1)
            return byteArrays[0].slice();
        let totalLength = 0;
        for (const byteArray of byteArrays)
            totalLength += byteArray.length;
        let out = new Uint8Array(totalLength);
        let index = 0;
        for (const byteArray of byteArrays) {
            out.set(byteArray, index);
            index += byteArray.length;
        }
        return out;
    }
    segments;
    constructor(...segments) {
        this.segments = segments.slice();
    }
    write(bytes) {
        this.segments.push(bytes);
    }
    clear() {
        this.segments = [];
    }
    get bytes() {
        if (this.segments.length !== 1)
            this.segments = [ByteOStream.join(...this.segments)]; // Compress segments into one
        return this.segments[0];
    }
}
exports["default"] = ByteOStream;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


//const ByteStream = require("../Core/bytestream");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const byteistream_1 = __importDefault(__webpack_require__(7));
const byteostream_1 = __importDefault(__webpack_require__(8));
const LOG256 = Math.log(256);
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
;
//import { joinByteArrays, ByteOStream, ByteIStream } from "../Core/byteistream"
class HeaderFootprint {
    iterations;
    bytes;
    constructor(iterations, bytes) {
        this.iterations = iterations;
        this.bytes = bytes;
    }
}
class Arg {
    static safe = true;
    static setSafe(newSafe) {
        this.safe = newSafe;
    }
    static calculateByteCount(choiceCount) {
        //return Math.max(1, );
        return Math.ceil(Math.log(choiceCount) / LOG256);
    }
    static calculateChoiceCount(byteCount) {
        return 1 << (8 * byteCount);
    }
    static joinByteArrays(...byteArrays) {
        return byteostream_1.default.join(...byteArrays);
    }
    static encodeInt(value, byteCount) {
        byteCount = (byteCount !== undefined ? byteCount : Arg.calculateByteCount(value));
        let out = new Uint8Array(byteCount);
        for (let i = 0; i < byteCount; i++) {
            out[i] = (value & 255);
            value = value >> 8;
        }
        return out;
    }
    /*static decodeInt(bytes: Uint8Array): number {
        
        let out = 0;
        
        for (let i = 0; i < bytes.length; i++) {
            out += (bytes[i] << i * 8);
        }
        
        return out;
        
    }*/
    static decodeInt(bytes) {
        let out = 0;
        let i = 0;
        for (const byte of bytes) {
            if (i >= 4)
                continue;
            out += byte << (8 * (i++));
        }
        return out;
    }
    static encodeFloat(value, min, precision, byteCount) {
        return this.encodeInt(Math.round((value - min) / precision), byteCount);
    }
    static decodeFloat(bytes, min, precision) {
        return min + this.decodeInt(bytes) * precision;
    }
    static encodeStr(str) {
        return TEXT_ENCODER.encode(str);
    }
    static decodeStr(bytes) {
        return TEXT_DECODER.decode(Uint8Array.from(bytes));
    }
    /*static decodeStrArray(bytes: Uint8Array): string {
        return TEXT_DECODER.decode(bytes);
    }*/
    static createHeader(footprint, byteCount) {
        if (footprint.iterations <= 0)
            return new Uint8Array();
        let segments = new Array;
        for (let i = 0; i < footprint.iterations; i++) {
            let lengthToEncode = (i == 0 ? byteCount : segments[0].length);
            let newSegmentLength = Arg.calculateByteCount(lengthToEncode);
            if (i === footprint.iterations - 1) { // last iteration
                if (footprint.bytes < newSegmentLength)
                    throw "Length header too small to encode value";
                newSegmentLength = footprint.bytes;
            }
            segments.unshift(this.encodeInt(lengthToEncode, newSegmentLength));
        }
        return Arg.joinByteArrays(...segments);
    }
    static withHeader(footprint, bytes) {
        return Arg.joinByteArrays(this.createHeader(footprint, bytes.length), bytes);
    }
    static resolveHeader(stream, footprint) {
        let byteCount = footprint.bytes;
        for (let i = 0; i < footprint.iterations; i++) {
            byteCount = this.decodeInt(stream.next(byteCount));
        }
        return byteCount;
    }
    static matches(arg, value) {
        if (arg == null) {
            return value == null;
        }
        else if (arg instanceof Arg) {
            return arg.matches(value);
        }
        else if (Array.isArray(arg)) {
            if (!Array.isArray(value) || arg.length !== value.length)
                return false;
            for (let i = 0; i < arg.length; i++) {
                if (!this.matches(arg[i], value[i]))
                    return false;
            }
            return true;
        }
        else {
            for (const key in arg) {
                if (!this.matches(arg[key], (key in value) ? value[key] : null))
                    return false;
            }
            return true;
        }
    }
    static matchesAll(arg, values) {
        for (const value of values) {
            if (!Arg.matches(arg, value))
                return false;
        }
        return true;
    }
    static streamEncodeAll(arg, values, stream) {
        for (const value of values) {
            Arg.streamEncode(arg, value, stream);
        }
    }
    static streamDecodeAll(arg, count, stream) {
        let out = new Array();
        for (let i = 0; i < count; i++) {
            out.push(Arg.streamDecode(arg, stream));
        }
        return out;
    }
    static encode(arg, value) {
        if (!this.matches(arg, value))
            console.error("Arg/Value Mismatch | ", value, " | ", arg);
        let stream = new byteostream_1.default();
        this.streamEncode(arg, value, stream);
        return stream.bytes;
    }
    static streamEncode(arg, value, stream) {
        if (arg == null) {
            if (value != null)
                console.error("Invalid null arg footprint.");
        }
        else if (arg instanceof Arg) {
            arg.streamEncode(value, stream);
        }
        else if (Array.isArray(arg)) {
            for (let i = 0; i < arg.length; i++)
                this.streamEncode(arg[i], value[i], stream);
        }
        else {
            for (const key in arg) {
                this.streamEncode(arg[key], value[key], stream);
            }
        } // TODO: improve error handling
    }
    static decode(arg, bytes) {
        return this.streamDecode(arg, new byteistream_1.default(bytes));
    }
    static streamDecodeSafe(arg, stream) {
        let decoded = this.streamDecode(arg, stream);
        stream.verifyExactComplete();
        return decoded;
    }
    static streamDecode(arg, stream) {
        if (arg == null) {
            return null;
        }
        else if (arg instanceof Arg) {
            return arg.streamDecode(stream);
        }
        else if (arg instanceof Array) {
            let decoded = new Array();
            for (const subarg of arg)
                decoded.push(this.streamDecode(subarg, stream));
            return decoded;
        }
        else {
            let decoded = {};
            for (const key in arg)
                decoded[key] = this.streamDecode(arg[key], stream);
            return decoded;
        }
    }
    static test(arg, value) {
        let encoded = Arg.encode(arg, value);
        let decoded = Arg.decode(arg, encoded);
        //console.log("Arg test failed!");
        console.log(value);
        console.log(decoded);
        console.log(encoded);
    }
    static int(byteCount, min) {
        return new IntArg(byteCount, min);
    }
    static float(min, max, precision = 0.01) {
        return new FloatArg(min, max, precision);
    }
    static str(iterCount = 1, byteCount = 2) {
        return new StrArg(iterCount, byteCount);
    }
    static choice(...choices) {
        return new ChoiceArg(...choices);
    }
    static array(arg, byteCount = 2) {
        return new ArrayArg(arg, byteCount);
    }
    static branch(...paths) {
        return new BranchArg(paths);
    }
    static const(value) {
        return new ConstArg(value, true);
    }
    static auto(value) {
        return new ConstArg(value, false);
    }
    static default(arg, fallback) {
        return new BranchArg([new ConstArg(fallback, false), arg]);
    }
    static optional(arg) {
        return Arg.default(arg, null);
    }
    headerFootprint;
    constructor(headerFootprint) {
        this.headerFootprint = headerFootprint;
    }
    matches(value) {
        console.error("Override Arg.matches");
        return false;
    }
    encode(value) {
        console.error("Override Arg.encode");
        return new Uint8Array();
    }
    streamEncode(value, stream) {
        stream.write(this.encode(value));
    }
    decode(bytes) {
        console.error("Override Arg.decode");
    }
    streamDecode(stream) {
        let byteCount = Arg.resolveHeader(stream, this.headerFootprint);
        let bytes = stream.next(byteCount);
        return this.decode(bytes);
    }
    /*static UINT1 = this.int(1, 0);
    static UINT2 = this.int(2, 0);
    static UINT4 = this.int(4, 0);
    static UINT6 = this.int(6, 0);
    
    static INT1 = this.int(1, -128);
    static INT2 = this.int(2, -32768);
    static INT4 = this.int(4, -2147483648);
    static INT6 = this.int(6, -281474976710656);
    
    static CHAR = this.str(0, 1);
    static STRING1 = this.str(1, 1);
    static STRING2 = this.str(2, 1);
    
    static BOOL = this.choice(false, true);*/
    static UINT1;
    static UINT2;
    static UINT4;
    static UINT6;
    static INT1;
    static INT2;
    static INT4;
    static INT6;
    static CHAR;
    static STRING1;
    static STRING2;
    static BOOL;
}
exports["default"] = Arg;
class ChoiceArg extends Arg {
    choices;
    constructor(...choices) {
        super(new HeaderFootprint(0, Arg.calculateByteCount(choices.length)));
        this.choices = choices;
    }
    matches(value) {
        return this.choices.includes(value);
    }
    encode(value) {
        let index = this.choices.indexOf(value);
        if (index < 0)
            console.error("Invalid ChoiceArg choice: ", value, " | ", this.choices);
        return Arg.encodeInt(index, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return this.choices[Arg.decodeInt(bytes)];
    }
}
class IntArg extends Arg {
    min;
    max; // not inclusive
    constructor(byteCount, min = 0) {
        super(new HeaderFootprint(0, byteCount));
        this.min = min;
        this.max = min + Arg.calculateChoiceCount(byteCount);
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return Number.isInteger(value) && value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeInt(value - this.min, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeInt(bytes) + this.min;
    }
}
class FloatArg extends Arg {
    min;
    max; // exclusive
    precision;
    constructor(min, max, precision) {
        if (precision === undefined)
            precision = 0.01;
        super(new HeaderFootprint(0, Arg.calculateByteCount((max - min) / precision)));
        this.min = (min === undefined ? 0 : min);
        this.max = this.min + precision * Arg.calculateChoiceCount(this.headerFootprint.bytes);
        this.precision = precision;
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeFloat(value, this.min, this.precision, this.headerFootprint.bytes);
    }
    decode(bytes) {
        return Arg.decodeFloat(bytes, this.min, this.precision);
    }
}
class StrArg extends Arg {
    constructor(iterations, bytes) {
        super(new HeaderFootprint(iterations, bytes));
    }
    matches(value) {
        if (typeof value != "string")
            return false;
        return true; // TODO: should probably length check
    }
    encode(value) {
        return Arg.withHeader(this.headerFootprint, Arg.encodeStr(value));
    }
    decode(bytes) {
        return Arg.decodeStr(bytes);
    }
}
class ArrayArg extends Arg {
    arg;
    constructor(arg, byteCount = 2) {
        // special length header that tells how many copies of the sublist you get
        // also, this is certified black magic
        super(new HeaderFootprint(1, byteCount));
        this.arg = arg;
    }
    matches(values) {
        if (!Array.isArray(values) && !(values instanceof Set))
            return false;
        return Arg.matchesAll(this.arg, values);
    }
    /*public encode(values: Array<any>): Uint8Array {
        
        return Arg.joinByteArrays(
            Arg.createHeader(this.headerFootprint, values.length), // header
            ...(values.map(value => { return Arg.encode(this.arg, value) })) // encoded values
        );
        
        //return Arg.joinByteArrays([ header, encoded ]);
        
    }*/
    streamEncode(values, stream) {
        stream.write(Arg.createHeader(this.headerFootprint, Array.isArray(values) ? values.length : values.size));
        //for (const value of values)
        //	Arg.streamEncode(this.arg, value, stream);
        Arg.streamEncodeAll(this.arg, values, stream);
    }
    streamDecode(stream) {
        return Arg.streamDecodeAll(this.arg, Arg.resolveHeader(stream, this.headerFootprint), stream);
        /*let decoded = new Array<any>();
        
        for (let i = 0; i < valueCount; i++) {
            decoded.push(Arg.streamDecode(this.arg, stream));
        }
        
        
        return decoded;*/
    }
}
class DictArg extends Arg {
    keyArg;
    valueArg;
    constructor(keyArg, valueArg, byteCount = 2) {
        super(new HeaderFootprint(1, byteCount));
        this.keyArg = keyArg;
        this.valueArg = valueArg;
    }
    matches(obj) {
        if (obj instanceof Map)
            return Arg.matchesAll(this.keyArg, obj.keys()) && Arg.matchesAll(this.valueArg, obj.values());
        else if (typeof obj == "object" && Object.getPrototypeOf(obj) === Object.prototype)
            return Arg.matchesAll(this.keyArg, Object.keys(obj)) && Arg.matchesAll(this.valueArg, Object.values(obj));
        else
            return false;
    }
    streamEncode(obj, stream) {
        if (obj instanceof Map) {
            stream.write(Arg.createHeader(this.headerFootprint, obj.size));
            for (const [key, value] of obj) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, value, stream);
            }
        }
        else { // Generic object, probably a literal
            let keys = Object.keys(obj);
            stream.write(Arg.createHeader(this.headerFootprint, keys.length));
            for (const key of keys) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, obj[key], stream);
            }
        }
    }
    streamDecode(stream) {
        let valueCount = Arg.resolveHeader(stream, this.headerFootprint);
        let decoded = {};
        for (let i = 0; i < valueCount; i++) {
            let key = Arg.streamDecode(this.keyArg, stream);
            let value = Arg.streamDecode(this.valueArg, stream);
            decoded[key] = value;
        }
        return decoded;
    }
}
class BranchArg extends Arg {
    paths;
    constructor(paths, byteCount = 1) {
        super(new HeaderFootprint(1, byteCount));
        this.paths = Array.from(paths);
    }
    matches(value) {
        for (const path of this.paths) {
            if (Arg.matches(path, value))
                return true;
        }
        return false;
    }
    streamEncode(value, stream) {
        for (let i = 0; i < this.paths.length; i++) {
            //console.log(i)
            if (Arg.matches(this.paths[i], value)) { // Use first matching path
                stream.write(Arg.encodeInt(i, this.headerFootprint.bytes));
                Arg.streamEncode(this.paths[i], value, stream);
                return;
            }
        }
        console.error("No match found for BranchArg.");
    }
    streamDecode(stream) {
        let path = Arg.resolveHeader(stream, this.headerFootprint);
        return Arg.streamDecode(// Header tells us which path to use
        this.paths[path], stream);
    }
}
class ConstArg extends Arg {
    value;
    mandatory;
    constructor(value, mandatory = true) {
        super(new HeaderFootprint(0, 0));
        this.value = value;
        this.mandatory = mandatory;
    }
    matches(value) {
        if (value === this.value)
            return true;
        else if (value == null)
            return !this.mandatory;
        else
            return false;
    }
    streamEncode(value, stream) {
        if (value == null) {
            if (this.mandatory) {
                console.error("Invalid value for mandatory constArg");
            }
        }
        else if (value != this.value) {
            console.error("Invalid value for ConstArg");
        }
    }
    streamDecode(stream) {
        return this.value;
    }
}
Arg.UINT1 = Arg.int(1, 0);
Arg.UINT2 = Arg.int(2, 0);
Arg.UINT4 = Arg.int(4, 0);
Arg.UINT6 = Arg.int(6, 0);
Arg.INT1 = Arg.int(1, -128);
Arg.INT2 = Arg.int(2, -32768);
Arg.INT4 = Arg.int(4, -2147483648);
Arg.INT6 = Arg.int(6, -281474976710656);
Arg.CHAR = Arg.str(0, 1);
Arg.STRING1 = Arg.str(1, 1);
Arg.STRING2 = Arg.str(1, 2);
Arg.BOOL = Arg.choice(false, true);
/*let arg = {
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMLineIndex: Arg.INT2,
    sdpMid: Arg.STRING2,
    usernameFragment: Arg.STRING2
};*/
/*let encoded = Arg.encode(arg, {
    peerID: 2,
    candidate: "candidate",
    sdpMLineIndex: 12,
    sdpMid: "yeah",
    usernameFragment: "yeah"
})*/
//let encoded = Arg.encode(arg, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
/*let arg = Arg.STRING2;

let encoded = new Uint8Array([ 7, 0, 0, 0, 0, 0, 1, 0, 48, 0, 128, 8, 0, 99, 51, 52, 51, 50, 55, 98, 52 ]);


console.log(Arg.decode({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, encoded))

Arg.test({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
//console.log(encoded, Arg.decode(arg, encoded))*/
//console.log(Arg.decode(Arg.INT1, Arg.encode(Arg.INT1, 120)));
//console.log(Arg.encode(arg, 1));
/*let arg = Arg.UINT1;
let argList = [ arg, Arg.array([ arg, arg ]), { a: [ arg, arg ], b: arg } ];


let encoded = Arg.encode(argList, [0, [[1, 2], [3, 4], [5, 7]], { a: [ 55, 77 ], b: 66 }]);

console.log(encoded);

let decoded = Arg.decode(argList, encoded);

console.log(decoded);*/
/*let arg = Arg.branch(
    Arg.array(Arg.UINT1),
    Arg.array(Arg.STRING2),
    Arg.array(Arg.array(Arg.CHAR)),
    { x: Arg.UINT1, y: Arg.UINT1 },
    [ Arg.UINT2, Arg.UINT2 ],
    null
);

//console.log(Arg.encode(arg, [ 1, 2 ]));

let encoded = Arg.encode(arg, { x: 2, y: 10 });
//let encoded = Arg.encode(arg, null);
//let encoded = Arg.encode(arg, [ 1, 2, 255, 33, 85 ]);
//let encoded = Arg.encode(arg, [ ["a", "b"], ["c"] ]);
//let encoded = Arg.encode(arg, [ "w", "heeee" ]);

console.log(encoded);
console.log(Arg.decode(arg, encoded));*/
//console.log(Arg.encodeInt(0));


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


//import "webrtc-adapter";
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteMeshClient = void 0;
const signal_1 = __importDefault(__webpack_require__(4));
const network_1 = __webpack_require__(2);
//import Arg from "../Network/arg"
const websocket_client_1 = __importDefault(__webpack_require__(11));
const signaling_1 = __importStar(__webpack_require__(12));
/*export enum MeshStatus {
    
    PENDING,
    PARTIAL,
    CONNECTED,
    DISCONNECTED,
    
}*/
class RemoteMeshClient extends network_1.RemotePeer {
    sessionDescriptionCreated = new signal_1.default();
    iceCandidateCreated = new signal_1.default();
    //connectionReady = new Signal<void>();
    //answerCreated = new Signal<RTCSessionDescription>();
    //connectionReady = new Signal<void>();
    connection = new RTCPeerConnection({
        iceServers: [
            {
                urls: ["stun:stun.l.google.com:19302"]
            }
        ]
    });
    channels = new Map; // Overkill
    //private channelReliable = );
    //private channelUnreliable = );
    //private a = this.rtcConnection.createDataChannel()
    constructor() {
        super();
        this.channels.set(network_1.TransferMode.RELIABLE, this.createDataChannel("reliable", {
            id: 0,
            negotiated: true,
            //maxPacketLifeTime: 10000,
            //maxRetransmits:
            //ordered: true,
        }));
        this.channels.set(network_1.TransferMode.UNRELIABLE, this.createDataChannel("unreliable", {
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
        this.connection.onconnectionstatechange = (ev) => {
            //console.log(this.channels.get(TransferMode.RELIABLE)?.readyState);
            switch (this.connection.connectionState) {
                case "new":
                    this.state.set(network_1.ConnectionState.NEW);
                    break;
                case "connecting":
                    this.state.set(network_1.ConnectionState.CONNECTING);
                    break;
                case "connected":
                    //this.state.set(ConnectionState.CONNECTING);
                    this.checkConnected(); // Not necessarily connected, channels must be open
                    break;
                case "disconnected":
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
                case "closed":
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
                case "failed":
                    console.error("MeshPeer connection failed.");
                    this.state.set(network_1.ConnectionState.DISCONNECTED);
                    break;
            }
        };
        this.connection.onicegatheringstatechange = (ev) => {
            // "new" | "gathering" | "complete"
            //this.checkConnected();
            //console.log("Gathering State: ", this.connection.iceGatheringState);
        };
        this.connection.onsignalingstatechange = (ev) => {
            // "closed" | "have-local-offer" | "have-local-pranswer" | "have-remote-offer" | "have-remote-pranswer" | "stable"
            /*switch (this.connection.signalingState) {
                
                case "have-local-pranswer": case "have-remote-pranswer": case "stable":
                    
                    for (const pendingCandidate of this.pendingCandidates)
                        this.addRemoteIceCandidate(pendingCandidate);
                    
                    this.pendingCandidates = [];
                    
                
            }*/
            //console.log("Signaling State: ", this.connection.signalingState);
        };
        this.connection.onicecandidate = (ev) => {
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
    checkConnected() {
        if (!this.state.is(network_1.ConnectionState.CONNECTING))
            return;
        if (this.connection.connectionState !== "connected")
            return;
        // All channels must be open
        for (const channel of this.channels.values()) {
            if (channel.readyState !== "open")
                return;
        }
        // We're fully connected
        this.state.set(network_1.ConnectionState.CONNECTED);
    }
    async createOffer() {
        if (!this.state.any(network_1.ConnectionState.NEW, network_1.ConnectionState.DISCONNECTED)) {
            console.log("Attempted to create offer for invalid peer.");
            return;
        }
        this.state.set(network_1.ConnectionState.CONNECTING);
        let offer = await this.connection.createOffer({ /* iceRestart: true, */});
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
    async setRemoteDescription(description) {
        //type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";
        if (this.state.is(network_1.ConnectionState.CONNECTED)) {
            console.log("Received remote description for peer that is already connected.");
            return;
        }
        if (description.type === "offer" && this.state.is(network_1.ConnectionState.CONNECTING)) {
            console.log("Received remote offer for peer that is already connecting.");
            return;
        }
        this.state.set(network_1.ConnectionState.CONNECTING);
        await this.connection.setRemoteDescription(description);
        if (description.type === "offer") {
            let answer = await this.connection.createAnswer();
            await this.connection.setLocalDescription(answer);
            this.sessionDescriptionCreated.emit(answer);
        }
    }
    async addRemoteIceCandidate(candidate) {
        if (!this.state.is(network_1.ConnectionState.CONNECTING)) {
            //console.log("Received remote ice candidate for peer that isn't connecting.");
            //console.log(candidate);
        }
        await this.connection.addIceCandidate(candidate);
    }
    ;
    createDataChannel(label, init) {
        let channel = this.connection.createDataChannel(label, init);
        this.initDataChannel(channel);
        return channel;
    }
    initDataChannel(channel) {
        channel.onmessage = async (ev) => {
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
        channel.onopen = (ev) => {
            console.log("Channel opened!");
            this.checkConnected();
        };
        channel.onclose = (ev) => {
            //if (this.state.is(ConnectionState.CONNECTED))
            console.log("Channel closed.");
        };
    }
    ;
    sendRaw(raw, transferMode = network_1.TransferMode.RELIABLE) {
        if (!this.state.is(network_1.ConnectionState.CONNECTED)) {
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
exports.RemoteMeshClient = RemoteMeshClient;
class LocalMeshClient extends network_1.LocalMultiPeer {
    //statusUpdate = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>]>();
    //stabilized = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>]>();
    //destabilized = new Signal<[connected: Set<RemoteClientType>, disconnected: Set<RemoteClientType>, pending: Set<RemoteClientType>]>();
    socket;
    clientClass;
    stable = false;
    fullyConnected = false;
    constructor(messageRoot, remoteClientClass, serverUrl, protocols = [], messageHandler = new network_1.MessageHandler()) {
        super(messageRoot, messageHandler);
        this.socket = new websocket_client_1.default(signaling_1.default, serverUrl, protocols);
        this.clientClass = remoteClientClass;
        //console.log(this.socket.messageRoot);
        //console.log(this.socket.messageRoot.findMessage(new ByteIStream(new Uint8Array([8, 0]))))
        this.socket.connected.connect(() => {
            console.log("Connected to server");
        });
        this.connected.connect(() => {
            //this.sendServer(MESH_);
        });
        this.peerAdded.connect((peer) => {
            peer.sessionDescriptionCreated.connect((description) => {
                this.sendServer(signaling_1.MESH_SESSION_DESCRIPTION_CREATED, {
                    peerID: peer.getID(),
                    type: description.type,
                    sdp: description.sdp
                });
            });
            peer.iceCandidateCreated.connect((candidate) => {
                this.sendServer(signaling_1.MESH_ICE_CANDIDATE_CREATED, {
                    peerID: peer.getID(),
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                    usernameFragment: candidate.usernameFragment
                });
            });
            if (this.id > peer.id)
                peer.createOffer();
            if (this.state.is(network_1.ConnectionState.CONNECTED)) // Late join, tell the server about it
                this.sendStatus();
        });
        this.peerDropped.connect((peer) => {
            peer.close();
            if (this.state.is(network_1.ConnectionState.CONNECTED))
                this.sendStatus();
        });
        this.peerConnectionFailed.connect((peer) => {
            //this.checkAndSendStatus();
            //this.state.set(ConnectionState.DISCONNECTED);
            this.close();
            // TODO improve
        });
        this.peerConnected.connect((peer) => {
            //console.log("yippee")
            if (this.state.is(network_1.ConnectionState.CONNECTING)) {
                let status, [pending, connected, disconnected] = this.getIDStatus();
                //let [pending, connected, disconnected] = status;
                if (pending.size === 0) { // Everyone is done connecting
                    //this.checkStatus(status);
                    this.sendStatus(status);
                    this.state.set(network_1.ConnectionState.CONNECTED);
                }
            }
            else if (this.state.is(network_1.ConnectionState.CONNECTED)) { // Late join, send updated status
                this.sendStatus();
            }
        });
        this.peerDisconnected.connect((peer) => {
            if (this.state.is(network_1.ConnectionState.CONNECTING)) {
                //console.error("Connection failed.");
                this.close();
            }
        });
        this.closed.connect(() => {
            this.state.set(network_1.ConnectionState.DISCONNECTED);
            for (const peer of this.getPeers())
                this.dropPeer(peer);
        });
        this.initMessageHandling();
    }
    initMessageHandling() {
        this.addCondition(// Mesh is connecting or connected
        [
            signaling_1.MESH_TERMINATE,
            signaling_1.MESH_CONNECT_PEERS,
            signaling_1.MESH_DISCONNECT_PEERS,
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED,
        ], (packet) => {
            if (!this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED))
                return "Message received for mesh that is not initialized.";
        });
        this.addCondition([
            signaling_1.MESH_SESSION_DESCRIPTION_CREATED,
            signaling_1.MESH_ICE_CANDIDATE_CREATED
        ], (packet) => {
            let peer = this.getPeer(packet.data.peerID);
            if (peer == undefined || !peer.state.is(network_1.ConnectionState.CONNECTING))
                return "Invalid SDP/ICE transport.";
        });
        this.socket.onMessage(signaling_1.MESH_INITIALIZE, (packet) => {
            if (this.state.any(network_1.ConnectionState.CONNECTING, network_1.ConnectionState.CONNECTED)) {
                console.error("Attempted to initialize mesh that is already initialized.");
                return;
            }
            //console.log(packet.data.localID, packet.data.peerIDs);
            this.state.set(network_1.ConnectionState.CONNECTING);
            this.setID(packet.data.localID);
            this.createPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_TERMINATE, (packet) => {
            this.close();
        });
        this.socket.onMessage(signaling_1.MESH_CONNECT_PEERS, (packet) => {
            this.createPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_DISCONNECT_PEERS, (packet) => {
            this.dropPeers(packet.data.peerIDs);
        });
        this.socket.onMessage(signaling_1.MESH_SESSION_DESCRIPTION_CREATED, (packet) => {
            //console.log(packet.data);
            this.getPeer(packet.data.peerID)?.setRemoteDescription({
                type: packet.data.type,
                sdp: packet.data.sdp
            });
        });
        this.socket.onMessage(signaling_1.MESH_ICE_CANDIDATE_CREATED, (packet) => {
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
    createPeers(ids) {
        for (const id of ids) {
            if (id !== this.id && !this.ids.has(id)) // Error message?
                this.addPeer(new this.clientClass(), id);
        }
    }
    dropPeers(ids) {
        for (const id of ids) {
            let peer = this.getPeer(id);
            if (peer !== undefined)
                this.dropPeer(peer);
        }
    }
    getPeerIDs(peers = this.peers) {
        let out = new Set();
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
    sendStatus(status = this.getIDStatus()) {
        this.sendServer(signaling_1.MESH_CLIENT_STATUS_UPDATE, status);
    }
    isStable() {
        return this.stable;
    }
    sendServer(message, data) {
        this.socket.send(message, data);
    }
}
exports["default"] = LocalMeshClient;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const signal_1 = __importDefault(__webpack_require__(4));
const network_1 = __webpack_require__(2);
class Socket extends network_1.LocalMonoPeer {
    closed = new signal_1.default();
    //public error = new Signal<void>();
    ws;
    constructor(messageRoot, url, protocols, messageHandler = new network_1.MessageHandler()) {
        super(messageRoot, messageHandler);
        this.ws = new WebSocket(url, protocols);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = (e) => { this.state.set(network_1.ConnectionState.CONNECTED); };
        this.ws.onclose = (e) => { this.close(); };
        this.ws.onerror = (e) => { this.close(); };
        this.ws.onmessage = (e) => { this.handleRaw(undefined, new Uint8Array(e.data)); };
    }
    send(message, data) {
        //this.ws.send(this.messageRoot.createRaw(message, data));
        this.ws.send(this.createRaw(message, data));
    }
}
exports["default"] = Socket;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MESH_CLIENT_STATUS_UPDATE = exports.MESH_STATUS_UPDATE = exports.MESH_ICE_CANDIDATE_CREATED = exports.MESH_SESSION_DESCRIPTION_CREATED = exports.MESH_STABILIZED = exports.MESH_DISCONNECT_PEERS = exports.MESH_CONNECT_PEERS = exports.MESH_TERMINATE = exports.MESH_INITIALIZE = void 0;
const arg_1 = __importDefault(__webpack_require__(9));
const network_1 = __webpack_require__(2);
//const MESSAGE_ROOT = new MessageDomain();
/*export type StatusUpdate = {
    [ConnectionState.CONNECTING]: Array<number>,
    [ConnectionState.CONNECTED]: Array<number>,
    [ConnectionState.DISCONNECTED]: Array<number>,
};*/
//const STUN = new Message(Message.RAW);
exports.MESH_INITIALIZE = new network_1.Message({
    localID: arg_1.default.UINT2,
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_TERMINATE = new network_1.Message();
exports.MESH_CONNECT_PEERS = new network_1.Message({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_DISCONNECT_PEERS = new network_1.Message({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
//const MESH_CREATION_COMPLETED = new Message();
exports.MESH_STABILIZED = new network_1.Message();
//const MESH_DESTABILIZED = new Message();
exports.MESH_SESSION_DESCRIPTION_CREATED = new network_1.Message({
    peerID: arg_1.default.UINT2,
    type: arg_1.default.choice("offer", "answer"),
    sdp: arg_1.default.STRING2
});
exports.MESH_ICE_CANDIDATE_CREATED = new network_1.Message({
    peerID: arg_1.default.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: arg_1.default.STRING2,
    sdpMid: arg_1.default.STRING2,
    sdpMLineIndex: arg_1.default.UINT2,
    usernameFragment: arg_1.default.STRING2
});
exports.MESH_STATUS_UPDATE = new network_1.Message();
/*export const MESH_CLIENT_STATUS_UPDATE = new Message([{
    pendingIDs: Arg.array(Arg.UINT2),
    connectedIDs: Arg.array(Arg.UINT2),
    disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
exports.MESH_CLIENT_STATUS_UPDATE = new network_1.Message([
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2)
]);
/*console.log(
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array())),
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array([1, 0])))
);*/
const MESSAGE_ROOT = new network_1.MessageDomain([
    exports.MESH_INITIALIZE,
    exports.MESH_TERMINATE,
    exports.MESH_CONNECT_PEERS,
    exports.MESH_DISCONNECT_PEERS,
    exports.MESH_STABILIZED,
    exports.MESH_SESSION_DESCRIPTION_CREATED,
    exports.MESH_ICE_CANDIDATE_CREATED,
    exports.MESH_STATUS_UPDATE,
    exports.MESH_CLIENT_STATUS_UPDATE
]);
exports["default"] = MESSAGE_ROOT;


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const signal_1 = __importDefault(__webpack_require__(4));
class Canvas {
    sizeChanged = new signal_1.default();
    ctx;
    stretchFactor = 1.0;
    get element() { return this.ctx.canvas; }
    get left() {
        return 0;
    }
    get right() {
        return this.element.width / this.stretchFactor;
    }
    get top() {
        return 0;
    }
    get bottom() {
        return this.element.height / this.stretchFactor;
    }
    get width() {
        return this.right - this.left;
    }
    get height() {
        return this.bottom - this.top;
    }
    // Constructors and related methods
    static getCanvasElementContext(canvasElement) {
        let ctx = canvasElement.getContext("2d");
        if (ctx == null)
            throw new Error("Couldn't get 2d canvas context.");
        else
            return ctx;
    }
    static createElement(parent) {
        let canvasElement = document.createElement("canvas");
        canvasElement.style.display = "block";
        canvasElement.style.margin = "auto";
        canvasElement.textContent = "You don't have canvas support! Try switching to a different browser.";
        if (parent !== undefined)
            parent.appendChild(canvasElement);
        return canvasElement;
    }
    static fromElement(canvasElement) {
        return new Canvas(this.getCanvasElementContext(canvasElement));
    }
    static create() {
        return Canvas.fromElement(Canvas.createElement());
    }
    static createWithParent(parent) {
        return Canvas.fromElement(Canvas.createElement(parent));
    }
    constructor(ctx) {
        this.ctx = ctx;
        //this.element = ctx.canvas;
        //this.width = this.element.width;
        //this.height = this.element.height;
        //this.element.addEventListener("keydown", (ev: KeyboardEvent) => this.keyDown.emit(ev.key.toLowerCase()));
        //this.element.addEventListener("keyup", (ev: KeyboardEvent) => this.keyUp.emit(ev.key.toLowerCase()));
        //this.keyDown.connect((key: string) => this.pressedKeys.add(key));
        //this.keyUp.connect((key: string) => this.pressedKeys.delete(key));
    }
    // Stretch and sizing
    getStretchFactor() {
        return this.stretchFactor;
    }
    setStretchFactor(factor) {
        this.scale(factor / this.stretchFactor);
        this.stretchFactor = factor;
    }
    setSize(width, height) {
        //let transform = this.ctx.getTransform();
        this.element.width = width;
        this.element.height = height;
        //this.ctx.setTransform(transform);
        this.sizeChanged.emit();
    }
    fitResize(width, height, stretchFactor) {
        this.setStretchFactor(stretchFactor);
        this.setSize(width, height);
    }
    fit(boundWidth, boundHeight, width, height) {
        //this.width = width;
        //this.height = height;
        // document.documentElement.clientWidth & clientHeight as backup?
        let aspect = width / height;
        let boundAspect = boundWidth / boundHeight;
        if (aspect > boundAspect) {
            // canvas is shorter than the viewport, max out width
            this.fitResize(boundWidth, boundWidth / aspect, boundWidth / width);
        }
        else {
            // canvas is narrower than the viewport, max out height
            this.fitResize(boundHeight * aspect, boundHeight, boundHeight / height);
        }
    }
    fitWindow(width, height) {
        this.fit(window.innerWidth, window.innerHeight, width, height);
    }
    fitWindowPersistent(width, height) {
        this.fitWindow(width, height);
        window.addEventListener("resize", () => this.fitWindow(width, height));
        // Wants a way to clear this event listener
    }
    fitElement(element, width, height) {
        this.fit(element.clientWidth, element.clientHeight, width, height);
    }
    fitParent(width, height) {
        if (this.element.parentElement !== null)
            this.fitElement(this.element.parentElement, width, height);
    }
    fitElementPersistent(element, width, height) {
        //let el = WeakRef(element);
        this.fitElement(element, width, height);
        //if (this.resizeObserver !== undefined)
        //	this.resizeObserver.disconnect();
        //this.resizeObserver = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
        let resizeObserver = new ResizeObserver((entries) => {
            if (entries.length !== 1)
                throw new Error();
            this.fit(entries[0].contentRect.width, entries[0].contentRect.height, width, height);
        });
        //this.resizeObserver.observe(element);
        resizeObserver.observe(element);
    }
    fitParentPersistent(width, height) {
        if (this.element.parentElement === null)
            return;
        this.fitElementPersistent(this.element.parentElement, width, height);
    }
    // 
    apply(...canvases) {
        this.clear();
        for (const canvas of canvases)
            this.ctx.drawImage(canvas.element, 0, 0, this.element.width, this.element.height);
    }
    // Transform
    scale(x, y = x) {
        this.ctx.scale(x, y);
    }
    resetTransform() {
        //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        //this.scale(this.stretch);
        this.ctx.setTransform(this.stretchFactor, 0, 0, this.stretchFactor, 0, 0);
    }
    // Color
    static rgbaToStyle(r, g, b, a = 1) {
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 255)})`;
    }
    setFill(r, g, b, a = 1) {
        this.setFillStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    setFillStyle(style) {
        this.ctx.fillStyle = style;
    }
    setStroke(r, g, b, a = 1) {
        this.setStrokeStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    setStrokeStyle(style) {
        this.ctx.strokeStyle = style;
    }
    setLineWidth(width) {
        this.ctx.lineWidth = width;
    }
    setLineCap(cap) {
        this.ctx.lineCap = cap;
    }
    clear() {
        this.clearRect(0, 0, this.width, this.height);
    }
    wipe(r, g, b, a = 1.0) {
        this.wipeStyle(Canvas.rgbaToStyle(r, g, b, a));
    }
    wipeStyle(style) {
        this.setFillStyle(style);
        this.fillRect(0, 0, this.width, this.height);
        // Maybe reset fillStyle to what it was before
    }
    // Shapes
    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);
    }
    fillRect(x, y, w, h) {
        //this.ctx.fillStyle = "rgb(0,0,0)";
        //this.ctx.fillStyle = "blue";
        //this.useFill();
        this.ctx.fillRect(x, y, w, h);
    }
    strokeRect(x, y, w, h) {
        //this.useStroke();
        this.ctx.strokeRect(x, y, w, h);
    }
    fillStrokeRect(x, y, w, h) {
        this.fillRect(x, y, w, h);
        this.strokeRect(x, y, w, h);
    }
    pathEllipse(x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, w, h, 0, 0, 6.3); // 6.3 = a bit over 2pi
    }
    fillEllipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.fill();
    }
    strokeEllipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.stroke();
    }
    ellipse(x, y, w, h = w) {
        this.pathEllipse(x, y, w, h);
        this.ctx.fill();
        this.ctx.stroke();
    }
    /*fillCircle(x: number, y: number, r: number): void {
        this.fillEllipse(x, y, r, r);
    }
    strokeCircle(x: number, y: number, r: number): void {
        this.strokeEllipse(x, y, r, r);
    }
    circle(x: number, y: number, r: number): void {
        this.ellipse(x, y, r, r);
    }*/
    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}
exports["default"] = Canvas;
/*export class LayeredCanvas extends Canvas {
    
    private layers = new Array<Canvas>();
    
    protected static fromElement(canvasElement: HTMLCanvasElement): LayeredCanvas {
        return new LayeredCanvas(this.getCanvasElementContext(canvasElement));
    }
    static create(): LayeredCanvas {
        return this.fromElement(this.createElement(undefined));
    }
    static createWithParent(parent: HTMLElement): LayeredCanvas {
        return this.fromElement(this.createElement(parent));
    }
    constructor(ctx: CanvasRenderingContext2D) {
        
        super(ctx);
        
    }
    
    
}

export class SourcedCanvas extends Canvas {
    
    //private source?: Canvas;
    source: Canvas;
    
    static create(source: Canvas): SourcedCanvas {
        
        
        
    }
    
    constructor(source: Canvas, ctx: CanvasRenderingContext2D) {
        
        super(ctx);
        
        this.source = source;
        
    }
    
    fit(boundWidth: number, boundHeight: number, width: number, height: number): void {
        
        //this.width = width;
        //this.height = height;
        
        // document.documentElement.clientWidth & clientHeight as backup?
        
        let aspect = width / height;
        let boundAspect = boundWidth / boundHeight;
        
        if (aspect > boundAspect) {
            // canvas is shorter than the viewport, max out width
            //this.setStretch(fitWidth / width); // scale BEFORE resizing, for signal reasons
            this.resize(boundWidth, boundWidth / aspect, boundWidth / width);
        }
        else {
            // canvas is narrower than the viewport, max out height
            //this.setStretch(fitHeight / height);
            this.resize(boundHeight * aspect, boundHeight, boundHeight / height);
        }
        
    }
    fitWindow(width: number, height: number) {
        
        // clunky for now, probably wants to be generalized to fitElement and use a ResizeObserver
        this.fit(window.innerWidth, window.innerHeight, width, height);
        //window.addEventListener("resize", (ev: UIEvent) => { this.fit(width, height); });
        
    }
    fitWindowPersistent(width: number, height: number) {
        
        this.fitWindow(width, height);
        window.addEventListener("resize", () => this.fitWindow(width, height));
        
    }
    fitElement(element: HTMLElement, width: number, height: number): void {
        this.fit(element.clientWidth, element.clientHeight, width, height);
    }
    fitParent(width: number, height: number): void {
        if (this.element.parentElement !== null)
            this.fitElement(this.element.parentElement, width, height);
    }
    fitElementPersistent(element: HTMLElement, width: number, height: number): void {
        
        //let el = WeakRef(element);
        
        this.fitElement(element, width, height);
        
        if (this.resizeObserver !== undefined)
            this.resizeObserver.disconnect();
        
        this.resizeObserver = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
            
            if (entries.length !== 1)
                throw new Error();
            
            this.fit(entries[0].contentRect.width, entries[0].contentRect.height, width, height);
            
        });
        
        this.resizeObserver.observe(element);
        
    }
    fitParentPersistent(width: number, height: number): void {
        
        if (this.element.parentElement === null)
            return;
        
        this.fitElementPersistent(this.element.parentElement, width, height);
        
    }
    
    clearPersistentFit(): void {
        
    }
    
    
}*/


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
//import Color from "./Core/color";
const canvas_1 = __importDefault(__webpack_require__(13));
class DrawPad {
    canvas;
    source = canvas_1.default.create();
    isDrawing = false;
    constructor(canvas) {
        this.canvas = canvas;
        this.source.setSize(this.canvas.width, this.canvas.height);
        this.canvas.element.addEventListener("mousedown", (ev) => {
            this.startDraw();
            this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY);
        });
        this.canvas.element.addEventListener("mouseup", (ev) => this.stopDraw());
        this.canvas.element.addEventListener("mouseleave", (ev) => this.stopDraw());
        this.canvas.element.addEventListener("mousemove", (ev) => {
            this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY);
        });
        this.canvas.sizeChanged.connect(() => this.updateCanvas());
        this.source.wipe(1, 1, 1);
        this.source.setLineWidth(5);
        this.source.setLineCap("round");
    }
    updateCanvas() {
        this.canvas.apply(this.source);
    }
    startDraw() {
        if (this.isDrawing)
            return;
        this.isDrawing = true;
        //this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY)
    }
    stopDraw() {
        if (!this.isDrawing)
            return;
        this.isDrawing = false;
    }
    draw(fromX, fromY, toX, toY) {
        if (!this.isDrawing)
            return;
        //if (!this.activeLayer)
        //	return;
        //let stretch = this.canvas.getStretch();
        /*this.activeLayer.style.setStrokeColor(this.color);
        this.activeLayer.line(
            fromX * stretch, fromY * stretch,
            toX * stretch, toY * stretch
        );*/
        //let stretch = this.source.getStretchFactor();
        let stretch = this.canvas.getStretchFactor();
        this.source.line(fromX / stretch, fromY / stretch, toX / stretch, toY / stretch);
        this.updateCanvas();
    }
}
exports["default"] = DrawPad;
/*export default class DrawPad {
    
    private layers = new Array<Canvas>();
    private activeLayerIndex: number = NaN;
    
    //private canvas: HTMLCanvasElement;
    private canvas: HTMLCanvasElement;
    
    constructor(canvas: HTMLCanvasElement) {
        
        this.canvas = new Canvas(canvas);
        
        this.createLayer();
        this.setActiveLayer(0);
        
    }
    
    private get activeLayer() {
        return this.layers[this.activeLayerIndex];
    }
    
    createLayer(): number {
        
        this.layers.push(Canvas.create());
        return this.layers.length - 1;
        
    }
    
    setActiveLayer(layer: number): void {
        this.activeLayerIndex = layer;
    }
    draw(startX: number, startY: number, endX: number, endY: number): void {
        this.activeLayer.line(startX, startY, endX, endY);
    }
    
    undo(): void {
        
    }
    redo(): void {
        
    }
    
    
    
    
    
    
}*/
/*export default class DrawPad {
    
    canvas: Canvas;
    
    private layers = new Array<Canvas>();
    private activeLayer?: Canvas;
    
    private color = new Color(0, 0, 0);
    private isDrawing: boolean = false;
    
    constructor(canvas: Canvas, ...layerWeights: Array<number>) {
        
        this.canvas = canvas;
        
        this.canvas.element.addEventListener("mousemove", (ev: MouseEvent) => {
            this.draw(ev.offsetX - ev.movementX, ev.offsetY - ev.movementY, ev.offsetX, ev.offsetY);
        });
        this.canvas.element.addEventListener("mousedown", (ev: MouseEvent) => this.startDraw());
        this.canvas.element.addEventListener("mouseup", (ev: MouseEvent) => this.stopDraw());
        this.canvas.element.addEventListener("mouseleave", (ev: MouseEvent) => this.stopDraw());
        
        for (const weight of layerWeights)
            this.createLayer(weight);
        
        this.setActiveLayer(0);
        
    }
    
    private createLayer(weight: number): void {
        
        let layer = Canvas.create();
        
        layer.resize(this.canvas.width, this.canvas.height);
        //layer.fitElementPersistent(this.canvas.element, this.canvas.width, this.canvas.height);
        
        this.layers.push(layer);
        
        
    }
    setActiveLayer(index: number): void {
        
        this.stopDraw();
        this.activeLayer = this.layers[index];
        
    }
    
    private startDraw(): void {
        
        if (this.isDrawing)
            return;
        
        this.isDrawing = true;
        
    }
    private stopDraw(): void {
        
        if (!this.isDrawing)
            return;
        
        this.isDrawing = false;
        
    }
    private draw(fromX: number, fromY: number, toX: number, toY: number): void {
        
        if (!this.isDrawing)
            return;
        if (!this.activeLayer)
            return;
        
        let stretch = this.canvas.getStretch();
        
        this.activeLayer.style.setStrokeColor(this.color);
        this.activeLayer.line(
            fromX * stretch, fromY * stretch,
            toX * stretch, toY * stretch
        );
        
        this.updateCanvas();
        
    }
    private updateCanvas(): void {
        
        this.canvas.clear();
        
        for (const layer of this.layers)
            this.canvas.ctx.drawImage(layer.element, 0, 0, this.canvas.width, this.canvas.height);
        
    }
    
    setColor(color: Color): void {
        this.color = color;
    }
    setRGB(r: number, g: number, b: number, a = 1): void {
        this.color = new Color(r, g, b, a);
    }
    
}*/


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;