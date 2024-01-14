
import Signal from "./signal"


//const ALL = Symbol

const ANY = Symbol();

type StatePool<T> = T | Array<T> | typeof ANY;

export default class State<T> {
	
	static ANY: typeof ANY = ANY;
	
	public changed = new Signal<[oldValue: T, newValue: T]>();
	public value: T;
	
	private signalEntries = new Array<{ signal: Signal<[T, T]>, oldPool: StatePool<T>, newPool: StatePool<T> }>();
	
	constructor(value: T) {
		this.value = value;
	}
	
	private handleChanged(oldState: T, newState: T): void {
		
		const out: [T, T] = [oldState, newState];
		this.changed.emit(out);
		
		for (const entry of this.signalEntries)
			if (this.stateMatch(entry.oldPool, oldState) && this.stateMatch(entry.newPool, newState))
				entry.signal.emit(out);
		
	}
	
	private stateMatch(pool: StatePool<T>, state: T): boolean {
		return pool === State.ANY || pool === state || (Array.isArray(pool) && pool.includes(state));
	}
	private createTransition(oldPool: StatePool<T>, newPool: StatePool<T>): Signal<[T, T]> {
		
		let signal = new Signal<[T, T]>();
		this.signalEntries.push({ signal, oldPool, newPool });
		
		/*this.changed.connect((values: [T, T]) => {
			
			if (this.stateMatch(oldPool, values[0]) && this.stateMatch(newPool, values[1]))
				signal.emit(values);
			
		});*/
		
		return signal;
		
	}
	
	transition(oldState: T | Array<T>, newState: T | Array<T>): Signal<[T, T]> {
		return this.createTransition(oldState, newState);
	}
	transitionFrom(oldState: T | Array<T>): Signal<[T, T]> {
		return this.createTransition(oldState, State.ANY);
	}
	transitionTo(newState: T | Array<T>): Signal<[T, T]> {
		return this.createTransition(State.ANY, newState);
	}
	
	public is(value: T): boolean {
		return this.value == value;
	}
	public any(...values: Array<T>): boolean {
		return values.includes(this.value);
	}
	
	public set(newValue: T) {
		
		if (newValue !== this.value) {
			
			let oldValue = this.value;
			this.value = newValue;
			
			this.handleChanged(oldValue, newValue);
			
		}
		
	}
	
}


