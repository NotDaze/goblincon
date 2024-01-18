
import EventEmitter from "events";
import PrioritySet from "./priority_set";
//const PrioritySet = require("./priority_set");

//import State from "./state";

export interface SignalLike<ArgType> {
	
	connect(callback: (arg: ArgType) => void): (arg: ArgType) => void,
	disconnect(callback: (arg: ArgType) => void): void,
	disconnectAll(): void,
	emit(arg: ArgType): void
	
};
export interface SignalListenerLike {
	
	connect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): (arg: ArgType) => void,
	disconnect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): void,
	disconnectAll(): void
	
}

export class SignalListener implements SignalListenerLike {
	
	private connections = new Map<Signal<any>, Set<(arg: any) => void>>();
	
	private register<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): void {
		
		if (!this.connections.has(signal))
			this.connections.set(signal, new Set());
		
		this.connections.get(signal)?.add(callback);
		
	}
	private unregister<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): void {
		
		let signalCallbacks = this.connections.get(signal);
		
		if (signalCallbacks === undefined)
			return;
		
		signalCallbacks.delete(callback);
		
		if (signalCallbacks.size === 0)
			this.connections.delete(signal);
		
	}
	
	/*public pconnect<ArgType>(signal: Signal<ArgType>, priority: number, callback: (arg: ArgType) => void): (arg: ArgType) => void {
		this.register(signal, callback);
		return signal.pconnect(priority, cal-lback);
	}*/
	public connect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): (arg: ArgType) => void {
		this.register(signal, callback);
		return signal.connect(callback);
	}
	public disconnect<ArgType>(signal: Signal<ArgType>, callback: (arg: ArgType) => void): void {
		this.unregister(signal, callback);
		signal.disconnect(callback);
	}
	public disconnectAll(): void {
		
		for (const [signal, callbacks] of this.connections.entries())
			for (const callback of callbacks)
				signal.disconnect(callback);
		
		this.connections.clear();
		
	}
	
}


export default class Signal<ArgType> extends Set<(arg: ArgType) => any> implements SignalLike<ArgType> { // Maybe make this extend set..?
	
	static DISCONNECT: symbol = Symbol();
	
	//private callbacks = new PrioritySet<(arg: ArgType) => any>();
	//private callbacks: Array<(arg: ArgType) => any> = [];
	//private callbacks = new Set<(arg: ArgType) => any>;
	
	static fromEvent<ArgType>(emitter: EventEmitter, event: string): Signal<ArgType> {
		let newSignal = new Signal<ArgType>();
		newSignal.bindEvent(emitter, event);
		return newSignal;
	}
	static fromSignal<ArgType>(signal: Signal<ArgType>) {
		let newSignal = new Signal<ArgType>();
		newSignal.bindSignal(signal);
		return newSignal;
	}
	/*static fromStateTransition<T>(state: State<T>, from: T, to: T) {
		
	}
	static fromStateTransitionTo<T>(state: State<T>, ...states: Array<T>): Signal {
		
	}
	static fromStateTransitionFrom<T>(state: State<T>, ...states: Array<T>): Signal {
		
	}*/
	
	
	
	public bindEvent(emitter: EventEmitter, event: string): void {
		emitter.on(event, this.emit.bind(this));
	}
	public bindSignal(signal: Signal<ArgType>): void {
		signal.connect(this.emit.bind(this));
	}
	
	/*private pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
		this.callbacks.add(priority, callback);
		return callback;
	}*/
	public connect(callback: (arg: ArgType) => void): (arg: ArgType) => void {
		//return this.pconnect(0, callback);
		this.add(callback);
		return callback;
	}
	public disconnect(callback: (arg: ArgType) => void): void {
		this.delete(callback);
	}
	public disconnectAll(): void {
		this.clear();
	}
	
	public subscribe(callback: (arg: ArgType) => void, chain?: () => void): () => void {
		
		this.connect(callback);
		
		//let ref = new WeakRef(this);
		
		return () => {
			chain?.();
			this.disconnect(callback);
		}
		
	}
	
	public emit(arg: ArgType): void {
		
		for (const callback of this) {
			
			//let out = callback(arg);
			callback(arg);
			
			/*if (out === Signal.DISCONNECT)
				this.disconnect(callback);*/
			// Gotta iterate backwards or something for this to work properly
			
		}
		
	}
	
}

/*export default class Signal<ArgType> implements SignalLike<ArgType> { // Maybe make this extend set..?
	
	static DISCONNECT: symbol = Symbol();
	
	//private callbacks = new PrioritySet<(arg: ArgType) => any>();
	//private callbacks: Array<(arg: ArgType) => any> = [];
	private callbacks = new Set<(arg: ArgType) => any>;
	
	static fromEvent<ArgType>(emitter: EventEmitter, event: string): Signal<ArgType> {
		let newSignal = new Signal<ArgType>();
		newSignal.bindEvent(emitter, event);
		return newSignal;
	}
	static fromSignal<ArgType>(signal: Signal<ArgType>) {
		let newSignal = new Signal<ArgType>();
		newSignal.bindSignal(signal);
		return newSignal;
	}
	
	
	
	public bindEvent(emitter: EventEmitter, event: string): void {
		emitter.on(event, this.emit.bind(this));
	}
	public bindSignal(signal: Signal<ArgType>): void {
		signal.connect(this.emit.bind(this));
	}
	
	//private pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
	//	this.callbacks.add(priority, callback);
	//	return callback;
	//}
	public connect(callback: (arg: ArgType) => void): (arg: ArgType) => void {
		//return this.pconnect(0, callback);
		this.callbacks.add(callback);
		return callback;
	}
	public disconnect(callback: (arg: ArgType) => void): void {
		this.callbacks.delete(callback);
	}
	public disconnectAll(): void {
		this.callbacks.clear();
	}
	
	public emit(arg: ArgType): void {
		
		for (const callback of this.callbacks) {
			
			//let out = callback(arg);
			callback(arg);
			
			//if (out === Signal.DISCONNECT)
			//	this.disconnect(callback);
			// Gotta iterate backwards or something for this to work properly
			
		}
		
	}
	
}*/
