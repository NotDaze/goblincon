"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_START = exports.GAME_LOBBY_PLAYERS_LEFT = exports.GAME_LOBBY_PLAYERS_JOINED = exports.GAME_JOINED = exports.GAME_JOIN = exports.GAME_CREATE = void 0;
const arg_1 = __importDefault(require("../Modules/Network/arg"));
const network_1 = require("../Modules/Network/network");
exports.GAME_CREATE = new network_1.Message({
    name: arg_1.default.STR1
});
exports.GAME_JOIN = new network_1.Message({
    name: arg_1.default.STR1,
    code: arg_1.default.STR1
});
exports.GAME_JOINED = new network_1.Message(arg_1.default.optional({
    id: arg_1.default.INT2,
    name: arg_1.default.STR1,
    code: arg_1.default.STR1
}));
exports.GAME_LOBBY_PLAYERS_JOINED = new network_1.Message(arg_1.default.arrayShort({
    id: arg_1.default.INT2,
    name: arg_1.default.STR1
}));
exports.GAME_LOBBY_PLAYERS_LEFT = new network_1.Message(arg_1.default.arrayShort({
    id: arg_1.default.INT2
}));
exports.GAME_START = new network_1.Message();
/*export const GAME_JOIN_RESPONSE = new Message(
    Arg.branch(
        {
            success: Arg.const(false),
            code: Arg.const<string | undefined>(undefined)
        },
        {
            success: Arg.const(true),
            code: Arg.STR1
        }
    )
);*/
//export const GAME_CREATE_RESPONSE = new Message(Arg.STR1); // Game token
//export const GAME_JOIN = new Message(Arg.STR1);
//export const GAME_JOIN_RESPONSE = new Message(Arg.optional(Arg.STR1));
const MESSAGES = [
    exports.GAME_CREATE,
    exports.GAME_JOIN,
    exports.GAME_JOINED,
    exports.GAME_LOBBY_PLAYERS_JOINED,
    exports.GAME_LOBBY_PLAYERS_LEFT,
    exports.GAME_START,
];
exports.default = MESSAGES;
