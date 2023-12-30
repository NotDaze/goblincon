
export default class ByteIStream {

	private bytes: Uint8Array;
	private index = 0;

	
	constructor(bytes: Uint8Array) {
		this.bytes = bytes;
		//this.index = 0;
	}

	get complete(): boolean {
		return this.index >= this.bytes.length;
	}

	get exactComplete(): boolean {
		return this.index === this.bytes.length;
	}
	
	public *next(count: number): IterableIterator<number> {
		//console.log(this.bytes.slice(this.index, this.index + count));
		//return this.bytes.slice(this.index, this.index += count);
		
		let start = this.index;
		let end = (this.index += count); // Store this so that outside changes can't screw anything up
		
		if (end > this.bytes.length) {
			console.error("ByteIStream length exceeded.");
			end = this.bytes.length;
		}
		
		for (let i = start; i < end; i++)
			yield this.bytes[i];
		
	}
	public nextArray(count: number): Uint8Array {
		return this.bytes.slice(this.index, this.index += count);
	}
	/*public *next(count: number): Uint8Array {
		
	}*/
	
	public verifyExactComplete() {
		if (!this.exactComplete) {
			console.error("ByteIStream Error");
			console.error(this.bytes);
			console.error(this.index);
		}
	}
	
}
