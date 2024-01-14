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
const network_1 = require("../Modules/Network/network");
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
    name = "";
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
}
exports.GameSocket = GameSocket;
class GameServer extends signaling_server_1.default {
    //games = new TwoWayMap<String, Mesh<GameSocket>>();
    // Maybe could merge these or use a TwoWayMap
    games = new two_way_map_1.default();
    //private hosts = new Map<Mesh<GameSocket>, GameSocket>();
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
            /*mesh.peersAdded.connect(peers => {
                
                
            });*/
            mesh.peersAdded.connect(peers => {
                for (const peer of peers)
                    this.send(peer, game_signaling_1.GAME_JOINED, { id: peer.getMeshID(), name: peer.getName(), code: this.games.get(mesh) });
                // Tell new peer about existing ones, and tell existing peers about the new one
                let joinData = new Array();
                let existingPeerData = new Array();
                for (const peer of peers)
                    joinData.push({ id: peer.getMeshID(), name: peer.getName() });
                for (const peer of mesh.getPeers()) {
                    existingPeerData.push({ id: peer.getMeshID(), name: peer.getName() });
                    if (!peers.includes(peer))
                        this.send(peer, game_signaling_1.GAME_LOBBY_PLAYERS_JOINED, joinData);
                }
                this.send(peers, game_signaling_1.GAME_LOBBY_PLAYERS_JOINED, existingPeerData);
            });
            mesh.peersLeaving.connect(peers => {
                if (mesh.state.is(network_1.ConnectionState.NEW)) {
                    let leaveData = new Array();
                    for (const peer of peers)
                        leaveData.push({ id: peer.getMeshID() });
                    for (const peer of mesh.getPeers())
                        this.send(peer, game_signaling_1.GAME_LOBBY_PLAYERS_LEFT, leaveData);
                }
            });
        });
        this.meshDestroyed.connect((mesh) => {
            this.games.delete(mesh);
        });
        /*this.peerAdded.connect(peer => {
            
        });
        this.peerDisconnected.connect(peer => {
            
        });
        this.peerDropped.connect(peer => {
            
        });*/
        this.addCondition([
            game_signaling_1.GAME_CREATE,
            game_signaling_1.GAME_JOIN
        ], packet => {
            if (this.getPeerMesh(packet.peer) !== undefined)
                return "Peer that is in a mesh attempted to create or join another.";
        });
        this.onMessage(game_signaling_1.GAME_CREATE, packet => {
            let mesh = this.createMesh();
            let code = this.generateGameCode();
            this.games.set(mesh, code);
            packet.peer.setName(packet.data.name);
            mesh.add(packet.peer);
            //this.lobbyJoin(mesh, packet.peer, packet.data.name);
        });
        this.onMessage(game_signaling_1.GAME_JOIN, packet => {
            //let code = packet.data.code;
            let mesh = this.games.reverseGet(packet.data.code);
            if (mesh === undefined) {
                // Handle invalid join code somehow
                //this.send(packet.peer, GAME_JOIN_FAILED);
                this.send(packet.peer, game_signaling_1.GAME_JOINED, undefined);
            }
            else {
                packet.peer.setName(packet.data.name);
                mesh.add(packet.peer);
            }
            //this.send(packet.peer, GAME_JOIN_RESPONSE);
        });
    }
    lobbyJoin(mesh, peer, name) {
        //this.send(peer, GAME_JOINED, { id: peer.getMeshID(), name, code });
        peer.setName(name);
        mesh.add(peer);
    }
    lobbyLeave(mesh, peer) {
        mesh.remove(peer);
        this.send(peer, game_signaling_1.GAME_JOINED, undefined);
        const leaveData = [{ id: peer.getMeshID() }];
        for (const peer of mesh.getPeers())
            this.send(peer, game_signaling_1.GAME_LOBBY_PLAYERS_LEFT, leaveData);
    }
    generateGameCode(length = 5) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code = "";
        for (let i = 0; i < length; i++)
            code += chars[Math.floor(Math.random() * chars.length)];
        // Retry on collision. Dumb, but it works
        if (this.games.reverseHas(code))
            return this.generateGameCode(length);
        return code;
    }
    getMeshHost(mesh) {
        let host = mesh.getPeer(0);
        if (!host)
            throw new Error("Invalid Mesh host.");
        return host;
    }
}
exports.default = GameServer;
/*export class GameSocket extends SignalingSocket {
    
    
    
}

export default class GameServer extends SignalingServer {
    
    
    
    
}*/
