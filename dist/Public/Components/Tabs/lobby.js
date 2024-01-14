"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function PlayerEntry({ name }) {
    return (react_1.default.createElement("div", null, name));
}
function PlayerList({ client }) {
    const [playerNames, setPlayerNames] = react_1.default.useState(client.getPeerNames());
    react_1.default.useEffect(() => client.lobbyPlayerListUpdate.subscribe(() => {
        setPlayerNames(client.getPeerNames());
    }));
    return (react_1.default.createElement("div", { id: "player-list" }, playerNames.map(name => react_1.default.createElement(PlayerEntry, { name: name }))));
}
function LobbyCode({ code }) {
    const copyCode = () => {
        navigator.clipboard.writeText(`localhost:5050?code=${code}`);
    };
    return (react_1.default.createElement("h2", { id: "code", onClick: copyCode }, code));
}
function Lobby({ client }) {
    return (react_1.default.createElement("div", { id: "lobby" },
        react_1.default.createElement(LobbyCode, { id: "code", code: client.getGameCode() }),
        react_1.default.createElement(PlayerList, { client: client }),
        react_1.default.createElement("button", { id: "start-btn" })));
}
exports.default = Lobby;
