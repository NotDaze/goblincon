"use strict";
//import Signal from "../Modules/Core/signal";
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
exports.GameSocket = void 0;
const two_way_map_1 = __importDefault(require("../Modules/Core/two_way_map"));
const signaling_server_1 = __importStar(require("../Modules/Network/signaling_server"));
const game_signaling_1 = __importStar(require("../MessageLists/game_signaling"));
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
class GameSocket extends signaling_server_1.SignalingSocket {
}
exports.GameSocket = GameSocket;
class GameServer extends signaling_server_1.default {
    //games = new TwoWayMap<String, Mesh<GameSocket>>();
    // Maybe could merge these or use a TwoWayMap
    games = new two_way_map_1.default();
    constructor(wssArgs = GameServer.WSS_ARGS) {
        super(GameSocket, wssArgs);
        this.addMessages(game_signaling_1.default);
        this.meshCreated.connect((mesh) => {
            /*let creator: GameSocket | undefined = mesh.getPeer(0);
            
            if (creator === undefined)
                throw new Error("");
            
            let code = this.generateGameCode();
            
            this.games.set(code, mesh);
            this.send(creator, GAME_CREATE_RESPONSE, code);*/
        });
        this.meshDestroyed.connect((mesh) => {
            this.games.reverseDelete(mesh);
        });
        this.onMessage(game_signaling_1.GAME_CREATE_REQUEST, packet => {
            let mesh = this.createMesh(packet.peer);
            let code = this.generateGameCode();
            this.games.set(code, mesh);
            this.send(packet.peer, game_signaling_1.GAME_CREATE_RESPONSE, code);
        });
        this.onMessage(game_signaling_1.GAME_JOIN_REQUEST, packet => {
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
    generateGameCode(length = 5) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < length; i++)
            code += chars[Math.floor(Math.random() * chars.length)];
        // Retry on collision. Dumb, but it works
        if (this.games.has(code))
            return this.generateGameCode(length);
        return code;
    }
}
exports.default = GameServer;
/*export class GameSocket extends SignalingSocket {
    
    
    
}

export default class GameServer extends SignalingServer {
    
    
    
    
}*/
