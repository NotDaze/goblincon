"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function PlayerName({ name }) {
    return (react_1.default.createElement("div", { className: "player-name" }, name));
}
function PlayerList({ client }) {
    const [peers, setPeers] = react_1.default.useState(Array.from(client.getPeers()));
    /*React.useEffect(() => client.lobbyPlayerListUpdate.subscribe(() => {
        setPlayerNames(client.getPeerNames());
    }));*/
    react_1.default.useEffect(() => client.peerAdded.subscribe(peer => {
        setPeers(Array.from(client.getPeers()));
    }));
    react_1.default.useEffect(() => client.peerDropped.subscribe(peer => {
        setPeers(Array.from(client.getPeers()));
    }));
    return (react_1.default.createElement("div", { id: "player-list" }, peers.map(peer => react_1.default.createElement(PlayerName, { key: peer.getID(), name: peer.getName() }))));
}
function LobbyHeader({ code, name }) {
    const copyCode = () => {
        navigator.clipboard.writeText(`localhost:5050?code=${code}`);
    };
    return (react_1.default.createElement("div", { id: "header" },
        react_1.default.createElement("div", { id: "code", onClick: copyCode }, code),
        react_1.default.createElement("div", { id: "name" }, name)));
}
function Lobby({ client }) {
    return (react_1.default.createElement("div", { id: "lobby", className: "tab" },
        react_1.default.createElement(LobbyHeader, { code: client.getGameCode(), name: client.getGameName() }),
        react_1.default.createElement(PlayerList, { client: client }),
        react_1.default.createElement("div", null, client.canStartGame() && react_1.default.createElement("button", { id: "start-btn", onClick: () => client.startGame() }, "Start"))));
}
exports.default = Lobby;
