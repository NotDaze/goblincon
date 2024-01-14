"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function Voting({ client }) {
    const [tab, setTab] = react_1.default.useState();
    return (react_1.default.createElement("div", { id: "voting", className: "tab" }));
}
exports.default = Voting;
