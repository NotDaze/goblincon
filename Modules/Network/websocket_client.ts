

import Signal from "../Core/signal"
import {
	
	ConnectionState,
	
	Packet,
	Message,
	MessageDomain,
	MessageHandler,
	
	LocalMonoPeer,
	
} from "./network"



export default class Socket extends LocalMonoPeer {
	
	
	public closed = new Signal<void>();
	//public error = new Signal<void>();
	
	
	private ws: WebSocket;
	
	constructor(url: string, protocols?: Array<string>, messageRoot = new MessageDomain(), messageHandler = new MessageHandler<void>()) {
		
		super(messageRoot, messageHandler);
		
		this.ws = new WebSocket(url, protocols);
		
		this.ws.binaryType = "arraybuffer";
		
		this.ws.onopen = (e: Event) => { this.state.set(ConnectionState.CONNECTED) };
		this.ws.onclose = (e: CloseEvent) => { this.close() };
		this.ws.onerror = (e: Event) => { this.close() };
		this.ws.onmessage = (e: MessageEvent<ArrayBuffer>) => { this.handleRaw(undefined, new Uint8Array(e.data)) };
		
	}
	
	
	send(message: Message, data?: any): void {
		//this.ws.send(this.messageRoot.createRaw(message, data));
		this.ws.send(message.createRaw(data));
	}
	
	
}

