"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import DrawPadCanvas from "../../Modules/draw_pad_canvas";
const react_1 = __importDefault(require("react"));
const draw_pad_1 = __importDefault(require("./draw_pad"));
//import Canvas from "../../Modules/Client/Rendering/canvas";
function App() {
    return (react_1.default.createElement("div", { id: "app", className: "flex" },
        react_1.default.createElement(draw_pad_1.default, null)));
}
exports.default = App;
