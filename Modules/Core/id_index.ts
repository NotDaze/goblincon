

import SortedArray from "./sorted_array";


export default class IDIndex<Type> {
	
	protected map = new Map<number, Type>();
	ids = new Set<number>();
	values = new Set<Type>();
	
	private highestID: number = -1;
	private freeIDs = new Array<number>();
	
	*[Symbol.iterator] (): Iterator<Type> {
		for (const value of this.map.values())
			yield value;
	}
	
	get size() {
		return this.values.size;
	}
	
	private trim() {
		
		while(this.highestID >= 0) {
				
			// If highest freed id is our highest id, trim and continue
			if (this.freeIDs.at(-1) === this.highestID) { 
				this.freeIDs.pop();
				this.highestID--;
			}
			else {
				return;
			}
			
		}
		
	}
	protected freeID(id: number): void {
		
		if (id === this.highestID) { // Trim
			this.highestID--;
			this.trim();
		}
		else {
			SortedArray.insert(this.freeIDs, id);
		}
		
	}
	protected reserveID(id: number): void {
		
		if (id > this.highestID) {
			
			// Add intervening free ids. If old highest is 0, and new is 2, 1 is now free
			for (let i = this.highestID + 1; i < id; i++)
				this.freeIDs.push(i); 
			
			this.highestID = id;
			
		}
		else { // Using a free ID, from the array
			
			let index = this.freeIDs.indexOf(id);
			
			if (index >= 0)
				this.freeIDs.splice(index, 1);
			else
				console.error("Index duplicate ID error.");
			
		}
		
	}
	
	getNextID(): number {
		
		// Use lowest freed ID, if we have any
		if (this.freeIDs.length > 0)
			return this.freeIDs[0];
		
		return this.highestID + 1;
		
	}
	
	has(id: number): boolean {
		return this.map.has(id);
	}
	get(id: number): Type | undefined {
		return this.map.get(id);
	}
	
	hasValue(value: Type): boolean {
		return this.values.has(value);
	}
	
	add(value: Type, id = this.getNextID()): number {
		
		if (this.ids.has(id))
			console.error("Index ID collision");
		
		this.map.set(id, value);
		this.values.add(value);
		this.ids.add(id);
		
		this.reserveID(id);
		
		return id;
		
	}
	remove(id: number): void {
		
		let value = this.map.get(id);
		
		if (value === undefined) {
			console.error("Removing value from ID index that isn't there.");
			return;
		}
		
		this.map.delete(id);
		this.values.delete(value);
		this.ids.delete(id);
		
		this.freeID(id);
		
	}
	
}
