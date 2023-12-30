

export class ArrayMap<KeyType, ValueType> {
	
	private map = new Map<KeyType, Array<ValueType>>();
	
	*entries(): IterableIterator<[KeyType, ValueType]> {
		for (const [key, valueArray] of this.map.entries())
			for (const value of valueArray)
				yield [key, value];
	}
	
	*keys(): IterableIterator<KeyType> {
		return this.map.keys();
	}
	*values(): IterableIterator<ValueType> {
		for (const valueArray of this.map.values())
			for (const value of valueArray)
				yield value;
	}
	
	
	has(key: KeyType): boolean {
		return this.map.has(key);
	}
	
	get(key: KeyType): Array<ValueType> | undefined {
		return this.map.get(key);
	}
	
	set(key: KeyType, ...values: ValueType[]): void {
		
		if (values.length === 0)
			this.map.delete(key);
		else
			this.map.set(key, values);
		
	}
	delete(key: KeyType): boolean {
		return this.map.delete(key);
	}
	
	
	add(key: KeyType, ...values: ValueType[]): void {
		
		let keyValues = this.get(key);
		
		if (keyValues === undefined)
			this.set(key, ...values);
		else
			keyValues.concat(values);
		
	}
	
	
	
	remove(key: KeyType, ...values: ValueType[]): void {
		
		let keyValues = this.get(key);
		
		if (keyValues === undefined) return;
		
		for (let i = keyValues.length - 1; i >= 0; i--) {
			
			if (values.includes(keyValues[i]))
				keyValues.splice(i, 1);
			
		}
		
		if (keyValues.length === 0)
			this.delete(key);
		
	}
	
	
	
}
