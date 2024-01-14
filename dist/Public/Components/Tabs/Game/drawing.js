"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const draw_pad_1 = __importDefault(require("../../draw_pad"));
function GameInfo({ client }) {
    return (react_1.default.createElement("div", { id: "info" }));
}
function PlayerName({ player }) {
    const [finished, setFinished] = react_1.default.useState(false);
    react_1.default.useEffect(() => player.drawingFinished.subscribe(() => {
        setFinished(true);
    }));
    return (react_1.default.createElement("div", null,
        player.getName(),
        " ",
        finished && react_1.default.createElement("span", null, "\u2705")));
}
function PlayerList({ client }) {
    return (react_1.default.createElement("div", { id: "player-list" }, Array.from(client.getPeers()).map(peer => react_1.default.createElement(PlayerName, { player: peer }))));
}
function Drawing({ client }) {
    const [tab, setTab] = react_1.default.useState();
    return (react_1.default.createElement("div", { id: "drawing", className: "tab" },
        react_1.default.createElement(GameInfo, { client: client }),
        react_1.default.createElement(draw_pad_1.default, null),
        react_1.default.createElement(PlayerList, { client: client })));
}
exports.default = Drawing;
