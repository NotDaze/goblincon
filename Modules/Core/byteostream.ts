

export default class ByteOStream {
	
	static join(...byteArrays: Array<Uint8Array>): Uint8Array {
		
		if (byteArrays.length === 0)
			return new Uint8Array();
		if (byteArrays.length === 1)
			return byteArrays[0].slice();
		
		let totalLength = 0;
		for (const byteArray of byteArrays)
			totalLength += byteArray.length;
		
		let out = new Uint8Array(totalLength);
		let index = 0;
		
		for (const byteArray of byteArrays) {
			out.set(byteArray, index);
			index += byteArray.length;
		}
		
		return out;
		
	}
	
	private segments: Array<Uint8Array>;
	
	constructor(...segments: Array<Uint8Array>) {
		this.segments = segments.slice();
	}
	
	public write(bytes: Uint8Array): void {
		this.segments.push(bytes);
	}
	public clear(): void {
		this.segments = [];
	}
	
	get bytes(): Uint8Array {
		
		if (this.segments.length !== 1)
			this.segments = [ ByteOStream.join(...this.segments) ]; // Compress segments into one
		
		return this.segments[0];
		
	}
	
	
}

