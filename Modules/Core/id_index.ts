

import SortedArray from "./sorted_array";
import TwoWayMap from "./two_way_map";


export default class IDIndex<Type> {
	
	protected map = new TwoWayMap<number, Type>();
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
		
		/*let trimCount = 0;
		
		for (let i = this.freeIDs.length - 1; i >= 0; i--) {
			
		}*/
		
		// Could be optimized to use splice, but probably not a big deal
		
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
		
		SortedArray.insert(this.freeIDs, id);
		this.trim();
		
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
	
	hasID(id: number): boolean {
		return this.map.has(id);
	}
	getValue(id: number): Type | undefined {
		return this.map.get(id);
	}
	
	hasValue(value: Type): boolean {
		return this.values.has(value);
	}
	getID(value: Type): number {
		let id = this.map.reverseGet(value);
		return id === undefined ? -1 : id;
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
