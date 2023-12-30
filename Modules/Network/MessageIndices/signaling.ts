

import ByteIStream from "../../Core/byteistream";
import Arg from "../arg"
import { MessageDomain, ConnectionState } from '../network';

const MESSAGE_ROOT = new MessageDomain();


/*export type StatusUpdate = {
	[ConnectionState.CONNECTING]: Array<number>,
	[ConnectionState.CONNECTED]: Array<number>,
	[ConnectionState.DISCONNECTED]: Array<number>,
};*/

//const STUN = MESSAGE_ROOT.newMessage(Message.RAW);
export const MESH_INITIALIZE = MESSAGE_ROOT.newMessage({
	localID: Arg.UINT2,
	peerIDs: Arg.array(Arg.UINT2)
});
export const MESH_TERMINATE = MESSAGE_ROOT.newMessage();
export const MESH_CONNECT_PEERS = MESSAGE_ROOT.newMessage({
	peerIDs: Arg.array(Arg.UINT2)
});
export const MESH_DISCONNECT_PEERS = MESSAGE_ROOT.newMessage({
	peerIDs: Arg.array(Arg.UINT2)
});
//const MESH_CREATION_COMPLETED = MESSAGE_ROOT.newMessage();
export const MESH_STABILIZED = MESSAGE_ROOT.newMessage();
//const MESH_DESTABILIZED = MESSAGE_ROOT.newMessage();

export const MESH_SESSION_DESCRIPTION_CREATED = MESSAGE_ROOT.newMessage({
	peerID: Arg.UINT2,
	type: Arg.choice("offer", "answer"),
	sdp: Arg.STRING2
});
export const MESH_ICE_CANDIDATE_CREATED = MESSAGE_ROOT.newMessage({
	peerID: Arg.UINT2,
	//media: Arg.STRING1,
	//index: Arg.UINT2,
	//name: Arg.STRING2
	candidate: Arg.STRING2,
	sdpMid: Arg.STRING2,
	sdpMLineIndex: Arg.UINT2,
	usernameFragment: Arg.STRING2
});



export const MESH_STATUS_UPDATE = MESSAGE_ROOT.newMessage();
/*export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_ROOT.newMessage([{
	pendingIDs: Arg.array(Arg.UINT2),
	connectedIDs: Arg.array(Arg.UINT2),
	disconnectedIDs: Arg.array(Arg.UINT2),
}]);*/
export const MESH_CLIENT_STATUS_UPDATE = MESSAGE_ROOT.newMessage([
	Arg.array(Arg.UINT2),
	Arg.array(Arg.UINT2),
	Arg.array(Arg.UINT2)
]);

/*console.log(
	MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array())),
	MESSAGE_ROOT.findMessage(new ByteIStream(new Uint8Array([1, 0])))
);*/

export default MESSAGE_ROOT;
