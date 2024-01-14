"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRAWING_DATA_CHUNK = void 0;
const arg_1 = __importDefault(require("../Modules/Network/arg"));
const network_1 = require("../Modules/Network/network");
/*export const GAME_CREATE = new Message({
    name: Arg.STR1
});
export const GAME_JOIN = new Message({
    name: Arg.STR1,
    code: Arg.STR1
});
export const GAME_JOINED = new Message(Arg.optional({
    id: Arg.INT2,
    name: Arg.STR1,
    code: Arg.STR1
}));
export const GAME_LOBBY_PLAYERS_JOINED = new Message(Arg.arrayShort({
    id: Arg.INT2,
    name: Arg.STR1
}));
export const GAME_LOBBY_PLAYERS_LEFT = new Message(Arg.arrayShort({
    id: Arg.INT2
}));


export const GAME_START = new Message();*/
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
exports.DRAWING_DATA_CHUNK = new network_1.Message({
    round: arg_1.default.INT1,
    index: arg_1.default.INT2,
    data: arg_1.default.RAW2
});
const MESSAGES = [
    exports.DRAWING_DATA_CHUNK
];
exports.default = MESSAGES;
