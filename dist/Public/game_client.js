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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteGameClient = void 0;
const mesh_client_1 = __importStar(require("../Modules/Network/mesh_client"));
const game_signaling_1 = __importStar(require("../MessageLists/game_signaling"));
//const TEST = MessageRoot.newMessage(Arg.STRING2);
// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
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
        super(RemoteGameClient, serverUrl, protocols);
        this.addServerMessages(game_signaling_1.default);
        this.onServerMessage(game_signaling_1.GAME_CREATE_RESPONSE, packet => {
            console.log(`Game created: ${packet.data}`);
            //this.joinGame(packet.data);
        });
    }
    createGame() {
        this.sendServer(game_signaling_1.GAME_CREATE_REQUEST);
    }
    joinGame(code) {
        this.sendServer(game_signaling_1.GAME_JOIN_REQUEST, code);
    }
}
exports.default = LocalGameClient;
