"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const draw_pad_1 = __importDefault(require("../draw_pad"));
function Game({ client }) {
    return (react_1.default.createElement("div", { className: "tab", id: "game" },
        react_1.default.createElement(draw_pad_1.default, null)));
}
exports.default = Game;
