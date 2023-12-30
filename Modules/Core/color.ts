

export default class Color {
	
	protected r: number;
	protected g: number;
	protected b: number;
	protected a: number;
	
	private string?: string;
	
	/*static rgba(r: number, g: number, b: number, a: number) {
		return new Color(r, g, b, a);
	}
	static rgb(r: number, g: number, b: number) {
		return this.rgba(r, g, b, 1.0);
	}*/
	
	
	static getString(r: number, g: number, b: number, a = 1.0): string {
		return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 255)})`;
	}
	
	constructor(r: number, g: number, b: number, a: number = 1.0) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		//this.set(r, g, b, a); // not doing this to appease typescript
	}
	
	set(r: number, g: number, b: number, a = this.a) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		this.string = undefined;
	}
	
	getR(): number {
		return this.r;
	}
	getG(): number {
		return this.g;
	}
	getB(): number {
		return this.b;
	}
	getA(): number {
		return this.a;
	}
	setR(newR: number): void {
		this.r = newR;
		this.string = undefined;
	}
	setG(newG: number): void {
		this.g = newG;
		this.string = undefined;
	}
	setB(newB: number): void {
		this.b = newB;
		this.string = undefined;
	}
	setA(newA: number): void {
		this.a = newA;
		this.string = undefined;
	}
	
	getString(): string {
		
		if (this.string == undefined)
			return (this.string = Color.getString(this.r, this.g, this.b, this.a));
		else
			return this.string;
		
	}
	
	/*apply(color: Color): void {
		
		if (color.r !== null)
			this.r = color.r;
		if (color.g !== null)
			this.g = color.g;
		if (color.b !== null)
			this.b = color.b;
		if (color.a !== null)
			this.a = color.a;
		
	}*/
	
}