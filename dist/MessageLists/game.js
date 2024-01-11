"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_JOIN_REQUEST = exports.GAME_CREATE_RESPONSE = exports.GAME_CREATE_REQUEST = void 0;
const arg_1 = __importDefault(require("../Modules/Network/arg"));
const network_1 = require("../Modules/Network/network");
exports.GAME_CREATE_REQUEST = new network_1.Message();
exports.GAME_CREATE_RESPONSE = new network_1.Message(arg_1.default.STR1); // Game token
exports.GAME_JOIN_REQUEST = new network_1.Message(arg_1.default.STR1);
const MESSAGES = [
    exports.GAME_CREATE_REQUEST,
    exports.GAME_CREATE_RESPONSE,
    exports.GAME_JOIN_REQUEST
];
exports.default = MESSAGES;
