"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalListener = void 0;
;
class SignalListener {
    connections = new Map();
    register(signal, callback) {
        if (!this.connections.has(signal))
            this.connections.set(signal, new Set());
        this.connections.get(signal)?.add(callback);
    }
    unregister(signal, callback) {
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
    connect(signal, callback) {
        this.register(signal, callback);
        return signal.connect(callback);
    }
    disconnect(signal, callback) {
        this.unregister(signal, callback);
        signal.disconnect(callback);
    }
    disconnectAll() {
        for (const [signal, callbacks] of this.connections.entries())
            for (const callback of callbacks)
                signal.disconnect(callback);
        this.connections.clear();
    }
}
exports.SignalListener = SignalListener;
class Signal extends Set {
    static DISCONNECT = Symbol();
    //private callbacks = new PrioritySet<(arg: ArgType) => any>();
    //private callbacks: Array<(arg: ArgType) => any> = [];
    //private callbacks = new Set<(arg: ArgType) => any>;
    static fromEvent(emitter, event) {
        let newSignal = new Signal();
        newSignal.bindEvent(emitter, event);
        return newSignal;
    }
    static fromSignal(signal) {
        let newSignal = new Signal();
        newSignal.bindSignal(signal);
        return newSignal;
    }
    /*static fromStateTransition<T>(state: State<T>, from: T, to: T) {
        
    }
    static fromStateTransitionTo<T>(state: State<T>, ...states: Array<T>): Signal {
        
    }
    static fromStateTransitionFrom<T>(state: State<T>, ...states: Array<T>): Signal {
        
    }*/
    bindEvent(emitter, event) {
        emitter.on(event, this.emit.bind(this));
    }
    bindSignal(signal) {
        signal.connect(this.emit.bind(this));
    }
    /*private pconnect(priority: number, callback: (arg: ArgType) => any): (arg: ArgType) => void {
        this.callbacks.add(priority, callback);
        return callback;
    }*/
    connect(callback) {
        //return this.pconnect(0, callback);
        this.add(callback);
        return callback;
    }
    disconnect(callback) {
        this.delete(callback);
    }
    disconnectAll() {
        this.clear();
    }
    subscribe(callback, chain) {
        this.connect(callback);
        return () => {
            if (chain !== undefined)
                chain();
            this.disconnect(callback);
        };
    }
    emit(arg) {
        for (const callback of this) {
            //let out = callback(arg);
            callback(arg);
            /*if (out === Signal.DISCONNECT)
                this.disconnect(callback);*/
            // Gotta iterate backwards or something for this to work properly
        }
    }
}
exports.default = Signal;
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
