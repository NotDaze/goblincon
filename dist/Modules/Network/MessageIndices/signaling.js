"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESH_CLIENT_STATUS_UPDATE = exports.MESH_STATUS_UPDATE = exports.MESH_ICE_CANDIDATE_CREATED = exports.MESH_SESSION_DESCRIPTION_CREATED = exports.MESH_STABILIZED = exports.MESH_DISCONNECT_PEERS = exports.MESH_CONNECT_PEERS = exports.MESH_TERMINATE = exports.MESH_INITIALIZE = void 0;
const arg_1 = __importDefault(require("../arg"));
const network_1 = require("../network");
const MESSAGE_ROOT = new network_1.MessageDomain();
/*export type StatusUpdate = {
    [ConnectionState.CONNECTING]: Array<number>,
    [ConnectionState.CONNECTED]: Array<number>,
    [ConnectionState.DISCONNECTED]: Array<number>,
};*/
//const STUN = MESSAGE_ROOT.newMessage(Message.RAW);
exports.MESH_INITIALIZE = MESSAGE_ROOT.newMessage({
    localID: arg_1.default.UINT2,
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_TERMINATE = MESSAGE_ROOT.newMessage();
exports.MESH_CONNECT_PEERS = MESSAGE_ROOT.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
exports.MESH_DISCONNECT_PEERS = MESSAGE_ROOT.newMessage({
    peerIDs: arg_1.default.array(arg_1.default.UINT2)
});
//const MESH_CREATION_COMPLETED = MESSAGE_ROOT.newMessage();
exports.MESH_STABILIZED = MESSAGE_ROOT.newMessage();
//const MESH_DESTABILIZED = MESSAGE_ROOT.newMessage();
exports.MESH_SESSION_DESCRIPTION_CREATED = MESSAGE_ROOT.newMessage({
    peerID: arg_1.default.UINT2,
    type: arg_1.default.choice("offer", "answer"),
    sdp: arg_1.default.STRING2
});
exports.MESH_ICE_CANDIDATE_CREATED = MESSAGE_ROOT.newMessage({
    peerID: arg_1.default.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: arg_1.default.STRING2,
    sdpMid: arg_1.default.STRING2,
    sdpMLineIndex: arg_1.default.UINT2,
    usernameFragment: arg_1.default.STRING2
});
exports.MESH_STATUS_UPDATE = MESSAGE_ROOT.newMessage();
/*export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_ROOT.newMessage([{
    pendingIDs: Arg.array(Arg.UINT2),
    connectedIDs: Arg.array(Arg.UINT2),
    disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
exports.MESH_CLIENT_STATUS_UPDATE = MESSAGE_ROOT.newMessage([
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2),
    arg_1.default.array(arg_1.default.UINT2)
]);
/*console.log(
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array())),
    MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array([1, 0])))
);*/
exports.default = MESSAGE_ROOT;
