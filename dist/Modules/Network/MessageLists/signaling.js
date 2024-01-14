"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESH_CLIENT_STATUS_UPDATE = exports.MESH_STATUS_UPDATE = exports.MESH_ICE_CANDIDATE_CREATED = exports.MESH_SESSION_DESCRIPTION_CREATED = exports.MESH_STABILIZED = exports.MESH_DISCONNECT_PEERS = exports.MESH_CONNECT_PEERS = exports.MESH_TERMINATE = exports.MESH_INITIALIZE = void 0;
const arg_1 = __importDefault(require("../arg"));
const network_1 = require("../network");
//const MESSAGE_ROOT = new MessageDomain();
/*export type StatusUpdate = {
    [ConnectionState.CONNECTING]: Array<number>,
    [ConnectionState.CONNECTED]: Array<number>,
    [ConnectionState.DISCONNECTED]: Array<number>,
};*/
//const STUN = new Message(Message.RAW);
exports.MESH_INITIALIZE = new network_1.Message({
    localID: arg_1.default.UINT2,
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_TERMINATE = new network_1.Message(arg_1.default.NONE);
exports.MESH_CONNECT_PEERS = new network_1.Message({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_DISCONNECT_PEERS = new network_1.Message({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
//const MESH_CREATION_COMPLETED = new Message();
exports.MESH_STABILIZED = new network_1.Message(arg_1.default.NONE);
//const MESH_DESTABILIZED = new Message();
exports.MESH_SESSION_DESCRIPTION_CREATED = new network_1.Message({
    peerID: arg_1.default.UINT2,
    type: arg_1.default.choice("offer", "answer"),
    sdp: arg_1.default.STR2
});
exports.MESH_ICE_CANDIDATE_CREATED = new network_1.Message({
    peerID: arg_1.default.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: arg_1.default.STR2,
    sdpMid: arg_1.default.STR2,
    sdpMLineIndex: arg_1.default.UINT2,
    usernameFragment: arg_1.default.STR2
});
exports.MESH_STATUS_UPDATE = new network_1.Message(arg_1.default.NONE);
/*export const MESH_CLIENT_STATUS_UPDATE = new Message([{
    pendingIDs: Arg.array(Arg.UINT2),
    connectedIDs: Arg.array(Arg.UINT2),
    disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
exports.MESH_CLIENT_STATUS_UPDATE = new network_1.Message([
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2)
]);
/*console.log(
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array())),
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array([1, 0])))
);*/
const MESSAGES = [
    //MESH_JOIN,
    exports.MESH_INITIALIZE,
    exports.MESH_TERMINATE,
    exports.MESH_CONNECT_PEERS,
    exports.MESH_DISCONNECT_PEERS,
    exports.MESH_STABILIZED,
    exports.MESH_SESSION_DESCRIPTION_CREATED,
    exports.MESH_ICE_CANDIDATE_CREATED,
    exports.MESH_STATUS_UPDATE,
    exports.MESH_CLIENT_STATUS_UPDATE
];
exports.default = MESSAGES;
