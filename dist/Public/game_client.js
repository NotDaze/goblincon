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
exports.GameState = exports.RemoteGameClient = void 0;
const signal_1 = __importDefault(require("../Modules/Core/signal"));
/*import {
    
    TransferMode,
    ConnectionState,
    
    Packet,
    Message,
    MessageHandler,
    
    //LocalMonoPeer,
    //LocalMultiPeer,
    //RemotePeer,
    
} from "../Modules/Network/network"*/
const mesh_client_1 = __importStar(require("../Modules/Network/mesh_client"));
//import Arg from "../Modules/Network/arg"
const state_1 = __importDefault(require("../Modules/Core/state"));
const game_signaling_1 = __importStar(require("../MessageLists/game_signaling"));
const game_1 = __importStar(require("../MessageLists/game"));
const canvas_1 = __importDefault(require("../Modules/Client/Rendering/canvas"));
//const TEST = MessageRoot.newMessage(Arg.STRING2);
// Host creates game (via server)
// Server generates a room ID thing
// Server gives room ID to host
// Clients connect to server
// 
class RemoteGameClient extends mesh_client_1.RemoteMeshClient {
    //public name: string;
    drawingFinished = new signal_1.default();
    name = "";
    drawings = new Map();
    constructor() {
        super();
    }
    isHost() {
        return this.id === 0;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
exports.RemoteGameClient = RemoteGameClient;
var GameState;
(function (GameState) {
    GameState[GameState["IDLE"] = 0] = "IDLE";
    GameState[GameState["LOBBY"] = 1] = "LOBBY";
    GameState[GameState["ACTIVE"] = 2] = "ACTIVE";
})(GameState || (exports.GameState = GameState = {}));
class LocalGameClient extends mesh_client_1.default {
    //gameJoined = new Signal<void>();
    //gameLeft = new Signal<void>();
    gameState = new state_1.default(GameState.IDLE);
    gameJoined = this.gameState.transitionTo(GameState.LOBBY);
    gameLeft = this.gameState.transitionTo(GameState.IDLE);
    gameStarted = this.gameState.transitionTo(GameState.ACTIVE);
    drawingStarted = new signal_1.default();
    drawingEnded = new signal_1.default();
    votingStarted = new signal_1.default();
    votingEnded = new signal_1.default();
    //gameDrawingStarted = new Signal<string>();
    //gameVotingStarted = new Signal<void>();
    name = "";
    code = "";
    roundNumber = 1;
    drawings = new Map();
    //private lobbyNames = new SortedArray();
    constructor(serverUrl, protocols = []) {
        super(RemoteGameClient, serverUrl, protocols);
        this.addServerMessages(game_signaling_1.default);
        this.addMessages(game_1.default);
        this.onServerMessage(game_signaling_1.GAME_JOINED, packet => {
            if (packet.data === undefined) {
                console.log("Game join failed...");
                this.handleLeft(); // Poorly named
            }
            else {
                console.log(`Game joined: ${packet.data.code}`);
                this.handleJoined(packet.data.id, packet.data.name, packet.data.code);
            }
        });
        this.onServerMessage(game_signaling_1.GAME_START, packet => {
            //if (!this.gameState.is());
            this.gameState.set(GameState.ACTIVE);
        });
        this.addServerCondition([
            game_signaling_1.GAME_LOBBY_PLAYERS_JOINED,
            game_signaling_1.GAME_LOBBY_PLAYERS_LEFT
        ], packet => {
            if (!this.gameState.is(GameState.LOBBY))
                return "Received lobby join/leave message while not in lobby.";
        });
        this.onServerMessage(game_signaling_1.GAME_LOBBY_PLAYERS_JOINED, packet => {
            for (const playerData of packet.data) {
                let player = this.getOrCreatePeer(playerData.id);
                if (player !== undefined) {
                    player.setName(playerData.name);
                    console.log(`Lobby Join: ${playerData.id}: ${playerData.name}`);
                }
            }
        });
        this.onServerMessage(game_signaling_1.GAME_LOBBY_PLAYERS_LEFT, packet => {
            for (const playerData of packet.data) {
                let player = this.getPeer(playerData.id);
                if (player)
                    this.dropPeer(player);
            }
        });
        //this.meshLeft.connect();
    }
    isHost() {
        return this.id === 0;
    }
    getGameName() {
        return this.name;
    }
    getGameCode() {
        return this.code;
    }
    handleJoined(id, name, code) {
        if (!this.gameState.is(GameState.IDLE))
            console.error("GameClient joined a game while already in one...");
        this.setID(id); // Kind of a hack
        this.name = name;
        this.code = code;
        //this.inGame = true;
        //this.gameJoined.emit();
        this.gameState.set(GameState.LOBBY);
    }
    handleLeft() {
        //if (!this.inGame)
        //	return;
        this.setID(-1);
        this.gameState.set(GameState.IDLE);
    }
    createGame(name) {
        this.sendServer(game_signaling_1.GAME_CREATE, { name });
    }
    joinGame(name, code) {
        this.sendServer(game_signaling_1.GAME_JOIN, { name, code: code.toUpperCase() });
    }
    canStartGame() {
        return this.isHost(); // && this.getPeerCount() >= 2;
    }
    startGame() {
        if (this.canStartGame())
            this.sendServer(game_signaling_1.GAME_START);
    }
    sendDrawingData(imageData) {
        this.drawings.set(this.roundNumber, canvas_1.default.fromImageData(imageData));
        const MAX_CHUNK_SIZE = 16000;
        let data = imageData.data;
        let next = 0;
        while (next < data.length) {
            let chunk_size = Math.min(data.length - next, MAX_CHUNK_SIZE);
            this.sendAll(game_1.DRAWING_DATA_CHUNK, {
                round: this.roundNumber,
                index: next,
                // This hurts my soul, but I think it's fine
                data: new Uint8Array(data.slice(next, next + chunk_size))
            });
            next += chunk_size;
        }
    }
}
exports.default = LocalGameClient;
