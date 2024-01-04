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
exports.RemoteGameClient = void 0;
const network_1 = require("./Network/network");
const mesh_client_1 = __importStar(require("./Network/mesh_client"));
const arg_1 = __importDefault(require("./Network/arg"));
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
exports.default = LocalGameClient;
