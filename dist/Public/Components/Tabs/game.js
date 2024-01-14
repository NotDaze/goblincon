"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const drawing_1 = __importDefault(require("./Game/drawing"));
function Game({ client }) {
    const [tab, setTab] = react_1.default.useState(react_1.default.createElement(drawing_1.default, { client: client }));
    return (react_1.default.createElement("div", { id: "game", className: "tab" }, tab));
}
exports.default = Game;
