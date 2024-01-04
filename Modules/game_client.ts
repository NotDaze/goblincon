

import Signal from "./Core/signal"
import {
	
	TransferMode,
	ConnectionState,
	
	Packet,
	Message,
	MessageDomain,
	MessageHandler,
	
	//LocalMonoPeer,
	//LocalMultiPeer,
	//RemotePeer,
	
} from "./Network/network"
import LocalMeshClient, { RemoteMeshClient } from "./Network/mesh_client"
import Arg from "./Network/arg"

const TEST = new Message(Arg.STRING2);
const MESSAGE_ROOT = new MessageDomain([
	TEST
]);

//const TEST = MessageRoot.newMessage(Arg.STRING2);

// Host creates game (via server)
// Server generates a token
// Server gives token to host
// Clients connect to server
// 

export class RemoteGameClient extends RemoteMeshClient {
	
	constructor() {
		
		super();
		
	}
	
}

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(MESSAGE_ROOT, RemoteGameClient, serverUrl, protocols, new MessageHandler<RemoteGameClient>);
		
		this.connected.connect(() => {
			
			this.sendAll(TEST, "Hello world!");
			
		});
		
		this.onMessage(TEST, (packet: Packet<RemoteGameClient>) => {
			
			console.log(packet.peer.getID(), ": ", packet.data);
			
		});
		
	}
	
	
	
}


