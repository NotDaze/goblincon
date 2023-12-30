

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


const MessageRoot = new MessageDomain();

const TEST = MessageRoot.newMessage(Arg.STRING2);

export class RemoteGameClient extends RemoteMeshClient {
	
	constructor() {
		
		super();
		
	}
	
}

export default class LocalGameClient extends LocalMeshClient<RemoteGameClient> {
	
	constructor(serverUrl: string, protocols: Array<string> = []) {
		
		super(RemoteGameClient, serverUrl, protocols, MessageRoot, new MessageHandler<RemoteGameClient>);
		
		this.connected.connect(() => {
			
			this.sendAll(TEST, "Hello world!");
			
		});
		
		this.onMessage(TEST, (packet: Packet<RemoteGameClient>) => {
			
			console.log(packet.peer.getID(), ": ", packet.data);
			
		});
		
	}
	
	
	
}


