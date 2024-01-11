



export default class TwoWayMap<Key, Value> extends Map<Key, Value> {
	
	private reverse = new Map<Value, Key>();
	
	
	constructor(iterable?: null | Iterable<[Key, Value]>) {
		
		super();
		
		if (iterable != undefined)
			for (const [key, value] of iterable)
				this.set(key, value);
		
	}
	
	set(key: Key, value: Value): this {
		
		if (this.reverse.has(value)) { // Values must be unique
			console.error("Added duplicate value to TwoWayMap, clearing its original entry.");
			this.reverseDelete(value);
		}
		
		this.reverse.set(value, key);
		return super.set(key, value);
		
	}
	delete(key: Key): boolean {
		
		let value = this.get(key);
		
		if (value !== undefined)
			this.reverse.delete(value);
		
		return super.delete(key);
		
	}
	
	/*reverseSet(value: Value, key: Key): this {
		return this.set(key, value);
	}*/
	
	reverseHas(value: Value): boolean {
		return this.reverse.has(value);
	}
	reverseGet(value: Value): Key | undefined {
		return this.reverse.get(value);
	}
	reverseDelete(value: Value): boolean {
		
		let key = this.reverseGet(value);
		
		if (key === undefined) // Value does not exist
			return false;
		
		super.delete(key);
		this.reverse.delete(value);
		
		return true;
		
	}
	
}






