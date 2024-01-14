"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const urlParams = new URLSearchParams(window.location.search);
function Landing({ client }) {
    const sanitize = (value) => value === null ? "" : value;
    let name = sanitize(localStorage.getItem("playerName"));
    let code = sanitize(urlParams.get("code"));
    //if (name !== "" && code !== "") // Quick join
    //	client.joinGame(name, code);
    const setName = (newName) => {
        name = newName;
        try {
            localStorage.setItem("playerName", newName);
        }
        catch (e) {
        }
    };
    const setCode = (newCode) => code = newCode;
    return (react_1.default.createElement("div", { id: "landing", className: "tab" },
        react_1.default.createElement("input", { id: "name-input", defaultValue: name, onChange: ev => setName(ev.target.value), placeholder: "Name" }),
        react_1.default.createElement("input", { id: "code-input", defaultValue: code, onChange: ev => setCode(ev.target.value), placeholder: "Code" }),
        react_1.default.createElement("button", { id: "join-btn", onClick: ev => client.joinGame(name, code) }, "Join"),
        react_1.default.createElement("button", { id: "create-btn", onClick: ev => client.createGame(name) }, "Create")));
}
exports.default = Landing;
