
import Vector2 from "../../Core/vector2";

/*interface AABB {
	top: number,
	bottom: number,
	left: number,
	right: number,
	width: number,
	height: number
}*/



export default class Physics {
	
	//static areAABBsOverlapping(l1: number, t1: number, )
	static areCirclesOverlapping(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
		
		//let dx = x1 - x2;
		//let dy = y1 - y2;
		let dx: number = Math.abs(x1 - x2);
		let dy: number = Math.abs(y1 - y2);
		let r: number = r1 + r2;
		
		// Currently does AABB test first, might make things faster
		return dx < r && dy < r && dx * dx + dy * dy < r * r;
		
	}
	static calculateBodyCollisionDelta(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, maxDelta = Infinity): number {
		
		// Will bodyOne and bodyTwo collide within the next maxDelta seconds?
		
		// Shortcut ideas:
		// Too far from each other to realistically collide?
		
		// Relative position and velocity
		let rpos = Vector2.subtract(bodyOne.position, bodyTwo.position);
		let rvel = Vector2.subtract(bodyOne.velocity, bodyTwo.velocity);
		let dot = rpos.dot(rvel);
		
		if (dot >= 0.0) {
			// These circles are not moving toward each other
			// They will only collide if they are already colliding
			return NaN;
		}
		
		let rposMagSq = rpos.magSq();
		let rvelMagSq = rvel.magSq();
		
		let r = bodyOne.radius + bodyTwo.radius;
		let rSq = r * r;
		
		if (rposMagSq < rSq) {
			// These circles already overlap, weird case
			return NaN;
		}
		
		
		
		
		
		/*if (rposMagSq - rSq - delta * rvelMagSq > 0.0) {
			// This doesn't make any sense lol
			// Even if these two circles were heading directly toward each other, they would not collide
			return NaN;
		}*/
		
		// -xvx - yvy +- sqrt((xvx + yvy)^2 - (x^2 + y^2 - r^2)(vx^2 + vy^2))
		// all over (vx^2 + vy^2)
		
		// at^2 + bt + c <= 0
		// a = rvel mag squared
		// b = 2 * rpos dot rvel
		// c = rpos mag squared - r squared
		
		let a = rvelMagSq; // Always positive
		let b = 2 * dot; // Always negative (unless circles moving away from each other)
		let c = rposMagSq - rSq; // Always positive (unless initially overlapping)
		
		let discriminant = b * b - 4 * a * c;
		
		if (discriminant <= 0.0) {
			// No solutions, these circles will not collide
			return NaN;
		}
		
		// (-dot +- sqrt(dot * dot - (rpos.x * rpos.x + rpos.y + rpos.y - r * r) * (rvms)))/rvms
		
		// Could be plus/minus in theory but we disregard the plus
		let t = (-b - Math.sqrt(discriminant))/(2 * a);
		
		return t < maxDelta ? t : NaN;
		
	}
	
	static chunkID(chunkSize: number, position: Vector2): number {
		
		let x = Math.round(position.x/chunkSize + 65536/2);
		let y = Math.round(position.y/chunkSize + 65536/2);
		
		return x + (y << 16);
		
	}
	static chunkX(id: number): number {
		return (id >> 16) - 65536/2;
	}
	static chunkY(id: number): number {
		return (id & 65535) - 65536/2;
	}
	static shiftChunkID(baseChunkID: number, deltaX: number, deltaY: number): number {
		return baseChunkID + deltaX + (deltaY << 16);
	}
	
}

/*class Collision {
	
	bodyOne: PhysicsBody;
	bodyTwo: PhysicsBody;
	time: number;
	
	constructor(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, time: number) {
		
		this.bodyOne = bodyOne;
		this.bodyTwo = bodyTwo;
		this.time = time;
		
	}
	
}*/

class PhysicsCollisionModel {
	
	private collisions = new Map<PhysicsBody, Array<[body: PhysicsBody, time: number]>>();
	
	//private collisions = new Array<[bodyOne: PhysicsBody, bodyTwo: PhysicsBody, time: number]>();
	
	
	private getBodyCollisionArray(body: PhysicsBody): Array<[PhysicsBody, number]> {
		
		let collisions = this.collisions.get(body);
		
		if (collisions !== undefined)
			return collisions;
		
		collisions = new Array<[PhysicsBody, number]>();
		this.collisions.set(body, collisions);
		return collisions;
		
	}
	
	/*private collisionSearch(array: Array<[PhysicsBody, number]>, entry: [PhysicsBody, number], minIndex = 0, maxIndex = array.length): number {
		
		if (maxIndex - minIndex <= 1) {
			return minIndex;
		}
		
		
		
	}*/
	private insertCollision(array: Array<[PhysicsBody, number]>, entry: [PhysicsBody, number], minIndex = 0, maxIndex = array.length - 1) {
		
		if (minIndex <= maxIndex) {
			array.splice(minIndex, 0, entry);
			return;
		}
		
		let mid = Math.floor((minIndex + maxIndex)/2);
		
		if (entry[1] <= array[mid][1])
			this.insertCollision(array, entry, minIndex, mid);
		else
			this.insertCollision(array, entry, mid, maxIndex);
		
	}
	private eraseCollision(array: Array<[PhysicsBody, number]>, entry: [PhysicsBody, number], minIndex = 0, maxIndex = array.length - 1) {
		
		for (let i: number = array.length - 1; i >= 0; i--) {
			if (array[i][0] === entry[0]) {
				array.splice(i, 1);
				return;
			}
		}
		
		/*if (maxIndex < 0)
			return;
		
		let mid = Math.floor((minIndex + maxIndex)/2);
		
		if (entry[0] === array[mid][0])
			array.splice(mid, 1); // Found it, delete and we're done
		else if (minIndex >= maxIndex)
			return; // Failed to find, maybe throw here
		else if (entry[1] <= array[mid][1])
			this.eraseCollision(array, entry, minIndex, mid);
		else
			this.eraseCollision(array, entry, mid, maxIndex);*/
		
	}
	
	addCollision(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, time: number): void {
		
		this.insertCollision(this.getBodyCollisionArray(bodyOne), [bodyTwo, time]);
		this.insertCollision(this.getBodyCollisionArray(bodyTwo), [bodyOne, time]);
		
	}
	
	clearBodyCollisions(...bodies: Array<PhysicsBody>): void {
		
		let clearedCollisions: Array<Array<[PhysicsBody, number]>> = new Array(bodies.length);
		
		// Clear collision arrays of bodies
		for (let i: number = 0; i < bodies.length; i++) {
			
			let bodyCollisions = this.collisions.get(bodies[i]);
			
			if (bodyCollisions === undefined) {
				clearedCollisions[i] = []; // Body has no collisions, just use an empty placeholder
			}
			else {
				clearedCollisions[i] = bodyCollisions;
				this.collisions.set(bodies[i], []);
			}
			
		}
		
		// For each collision, clear it from the array of the other involved body
		for (let i: number = 0; i < bodies.length; i++)
			for (const [collisionBody, collisionTime] of clearedCollisions[i])
				this.eraseCollision(this.getBodyCollisionArray(collisionBody), [bodies[i], collisionTime]);
		
	}
	
	getNextCollision(): [PhysicsBody, PhysicsBody, number] | undefined {
		
		let nextCollision: [PhysicsBody, PhysicsBody, number] | undefined = undefined;
		
		for (const [body, bodyCollisions] of this.collisions.entries())
			if (bodyCollisions.length > 0) // Body has collisions
				if(nextCollision === undefined || bodyCollisions[0][1] < nextCollision[2]) // This is the new soonest collision
					nextCollision = [body, ...bodyCollisions[0]];
		
		return nextCollision;
		
	}
	popNextCollision(): [PhysicsBody, PhysicsBody, number] | undefined {
		
		let nextCollision: [PhysicsBody, PhysicsBody, number] | undefined = this.getNextCollision();
		
		if (nextCollision !== undefined)
			this.clearBodyCollisions(nextCollision[0], nextCollision[1]);
		
		return nextCollision;
		
	}
	
	
}

export class PhysicsEnvironment {
	
	private layerCount = 0;
	
	// Chunks
	private chunkSize: number = 100;
	//private staticChunks = new Map<number, Set<PhysicsBody>>();
	//private dynamicChunks = new Map<number, Set<PhysicsBody>>();
	private chunks = new Map<number, Set<PhysicsBody>>();
	
	private collisionModel = new PhysicsCollisionModel();
	private bodyDeltas = new Map<PhysicsBody, number>();
	
	
	
	/*private *chunks(body: PhysicsBody): Iterable<number> {
		
		yield this.chunkID(body.position);
		
		
	}*/
	
	
	/**dynamicBodies(): Iterable<PhysicsBody> {
		
		for (const bodies of this.dynamicChunks.values())
			for (const body of bodies)
				yield body;
		
	}
	*staticBodies(): Iterable<PhysicsBody> {
		
		for (const bodies of this.staticChunks.values())
			for (const body of bodies)
				yield body;
		
	}*/
	*bodies(): Iterable<PhysicsBody> {
		
		/*for (const body of this.dynamicBodies())
			yield body;
		for (const body of this.staticBodies())
			yield body;*/
		
		for (const chunk of this.chunks.values())
			for (const body of chunk)
				yield body;
		
	}
	
	private getBodyDelta(body: PhysicsBody): number {
		let delta = this.bodyDeltas.get(body);
		return delta === undefined ? 0.0 : delta;
	}
	private setBodyDelta(body: PhysicsBody, delta: number): void {
		this.bodyDeltas.set(body, delta);
	}
	private clearBodyDeltas(): void {
		this.bodyDeltas.clear();
	}
	
	/*protected getChunk(chunkID: number): Set<PhysicsBody> | undefined {
		return this.chunks.get(chunkID);
	}*/
	protected chunkID(position: Vector2): number {
		return Physics.chunkID(this.chunkSize, position);
	}
	protected *chunkBodies(chunkID: number): IterableIterator<PhysicsBody> {
		
		let chunk = this.chunks.get(chunkID);
		
		if (chunk !== undefined)
			for (const body of chunk)
				yield body;
		
	}
	protected chunkRemove(chunkID: number, body: PhysicsBody): void {
		
		let chunk = this.chunks.get(chunkID);
		
		if (chunk === undefined)
			return;
		
		chunk.delete(body);
		
		if (chunk.size == 0)
			this.chunks.delete(chunkID);
		
	}
	protected chunkAdd(chunkID: number, body: PhysicsBody): void {
		
		let chunk = this.chunks.get(chunkID);
		
		if (chunk === undefined)
			this.chunks.set(chunkID, new Set([ body ]));
		else
			chunk.add(body);
		
	}
	
	
	/*protected updateBodyChunks(bodies: Iterable<PhysicsBody>): void {
		
		//let movingBodies = new Set<PhysicsBody>();
		let updates: Array<[oldChunk: number, newChunk: number, PhysicsBody]> = [];
		
		for (const [chunkID, chunkBodies] of this.chunks.entries()) {
			
			for (const body of chunkBodies) {
				
				let newChunkID = this.chunkID(body.position);
				
				if (newChunkID != chunkID)
					updates.push([ chunkID, newChunkID, body ]);
				
			}
			
		}
		
		for (const [oldChunk, newChunk, body] of updates) {
			this.chunkRemove(oldChunk, body);
			this.chunkAdd(newChunk, body);
		}
		
	}*/
	protected initialChunkUpdatePass() {
		
		//let movingBodies = new Set<PhysicsBody>();
		let updates: Array<[oldChunk: number, newChunk: number, body: PhysicsBody]> = [];
		
		for (const [chunkID, chunkBodies] of this.chunks.entries()) {
			
			for (const body of chunkBodies) {
				
				let newChunkID = this.chunkID(body.position);
				
				if (newChunkID != chunkID)
					updates.push([ chunkID, newChunkID, body ]);
				
			}
			
		}
		
		for (const [oldChunk, newChunk, body] of updates) {
			this.chunkRemove(oldChunk, body);
			this.chunkAdd(newChunk, body);
		}
		
	}
	
	
	private calculateChunkInitialInternalCollisions(chunkID: number, delta: number): void {
		
		let chunk = this.chunks.get(chunkID);
		
		if (!chunk || chunk.size <= 1) // This chunk is empty or contains only one body
			return;
		
		for (const bodyOne of chunk)
			for (const bodyTwo of chunk)
				if (bodyOne !== bodyTwo)
					this.calculateCollision(bodyOne, bodyTwo, delta);
		
		
	}
	private calculateChunkInitialExternalCollisions(chunkOneID: number, chunkTwoID: number, delta: number): void {
		
		// collide with self
		// collide with straight adjacent
		// collide with diagonally adjacent
		// i guess?
		
		for (const bodyOne of this.chunkBodies(chunkOneID))
			for (const bodyTwo of this.chunkBodies(chunkTwoID))
				this.calculateCollision(bodyOne, bodyTwo, delta);
		
		
	}
	private calculateChunkInitialCollisions(chunkID: number, delta: number): void {
		
		this.calculateChunkInitialInternalCollisions(chunkID, delta);
		
		for (const [x, y] of [[-1, 1], [0, 1], [1, 1], [1, 0]])
			this.calculateChunkInitialExternalCollisions(chunkID, Physics.shiftChunkID(chunkID, x, y), delta);
		
	}
	
	private calculateBodyChunkCollisions(body: PhysicsBody, chunkID: number, maxDelta: number) {
		
		for (const chunkBody of this.chunkBodies(chunkID))
			this.calculateCollision(body, chunkBody, maxDelta);
		
	}
	private recalculateBodyCollisions(body: PhysicsBody, maxDelta: number): void {
		
		let bodyChunkID = this.chunkID(body.position);
		
		/*for (const [x, y] of [
			[-1, -1], [ 0, -1], [ 1, -1],
			[-1,  0], [ 0,  0], [ 1,  0],
			[-1,  1], [ 0,  1], [ 1,  1]
		])
			this.calculateBodyChunkCollisions(body, Physics.shiftChunkID(bodyChunkID, x, y), maxDelta);*/
		
		for (let x = -1; x <= 1; x++)
			for (let y = -1; y <= 1; y++)
				this.calculateBodyChunkCollisions(body, Physics.shiftChunkID(bodyChunkID, x, y), maxDelta);
		
	}
	
	private initialCollisionPass(delta: number) {
		
		for (const chunkID of this.chunks.keys())
			this.calculateChunkInitialCollisions(chunkID, delta);
		
	}
	
	private calculateCollision(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, maxDelta: number): void {
		
		let initialDelta: number = this.syncBodyDeltas(bodyOne, bodyTwo);
		let collisionDelta = Physics.calculateBodyCollisionDelta(bodyOne, bodyTwo, maxDelta - initialDelta);
		
		if (Number.isNaN(collisionDelta))
			return;
		
		this.addCollision(bodyOne, bodyTwo, initialDelta + collisionDelta);
		
	}
	private addCollision(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, maxDelta: number): void {
		
		
		
		this.collisionModel.addCollision(bodyOne, bodyTwo, 10);
		
	}
	
	private syncBodyDeltas(bodyOne: PhysicsBody, bodyTwo: PhysicsBody): number {
		
		let deltaOne = this.getBodyDelta(bodyOne), deltaTwo = this.getBodyDelta(bodyTwo);
		
		if (Math.abs(deltaOne - deltaTwo) <= 1e-10)
			return deltaOne;
		
		if (deltaOne < deltaTwo) {
			this.advanceBodyToDelta(bodyOne, deltaTwo);
			return deltaTwo;
		}
		else {
			this.advanceBodyToDelta(bodyTwo, deltaOne);
			return deltaOne;
		}
		
	}
	private advanceBodyToDelta(body: PhysicsBody, newDelta: number): void {
		
		let deltaAdvancement = newDelta - this.getBodyDelta(body);
		
		if (deltaAdvancement <= 1e-10)
			return;
		
		body.position.x += body.velocity.x * deltaAdvancement;
		body.position.y += body.velocity.y * deltaAdvancement;
		
		this.setBodyDelta(body, newDelta);
		
	}
	
	private handleCollision(bodyOne: PhysicsBody, bodyTwo: PhysicsBody, collisionDelta: number, maxDelta: number): void {
		
		this.advanceBodyToDelta(bodyOne, collisionDelta);
		this.advanceBodyToDelta(bodyTwo, collisionDelta);
		
		// Calculate and apply new velocities
		
		// Recalculate new collisions for the bodies
		
		this.recalculateBodyCollisions(bodyOne, maxDelta - collisionDelta);
		this.recalculateBodyCollisions(bodyTwo, maxDelta - collisionDelta);
		
	}
	private handleNextCollision(maxDelta: number): boolean { // true = handled a collision, false = no collisions left
		
		let collision = this.collisionModel.popNextCollision();
		
		if (collision === undefined)
			return false;
		
		this.handleCollision(...collision, maxDelta);
		return true;
		
	}
	private handleCollisions(deltaAdvancement: number): void {
		
		
		
		while (this.handleNextCollision(deltaAdvancement)) {}
		
	}
	
	nextLayer(): number {
		return 1 << (++this.layerCount);
	}
	
	advance(deltaAdvancement: number): void {
		
		this.clearBodyDeltas();
		this.initialChunkUpdatePass();
		this.initialCollisionPass(deltaAdvancement);
		
	}
	
}

/*export class PhysicsProfile {
	
	layers: number;
	mask: number;
	
	constructor(layers: number, mask: number) {
		
	}
	
	matches(profile: PhysicsProfile) {
		
	}
	
}*/



export class PhysicsBody { // Circular
	
	collisionLayers: number = 0;
	collisionMask: number = 0;
	
	position = new Vector2();
	velocity = new Vector2();
	
	angle = 0.0;
	angularVelocity = 0.0;
	
	mass = 1.0;
	radius = 20.0;
	
	private static: boolean = false;
	private chunkID: number = NaN;
	
	
	// find next collision
	// run until that next collision happens
	// 
	
	constructor(position = new Vector2(0, 0), radius: number = 20.0, angle: number = 0) {
		//Object.assign(this, { position, radius, angle });
		this.position = position;
		this.radius = radius;
		this.angle = angle;
	}
	
	get left(): number {
		return this.position.x - this.radius;
	}
	get right(): number {
		return this.position.x + this.radius;
	}
	get top(): number {
		return this.position.y - this.radius;
	}
	get bottom(): number {
		return this.position.y + this.radius;
	}
	get width(): number {
		return this.radius * 2;
	}
	get height(): number {
		return this.radius * 2;
	}
	get diameter(): number {
		return this.radius * 2;
	}
	get area(): number {
		return this.radius * this.radius * Math.PI;
	}
	
	setChunkID(newChunkID: number): void {
		this.chunkID = newChunkID;
	}
	getChunkID(): number {
		return this.chunkID;
	}
	
	protected calculateLinearCollisionDelta(body: PhysicsBody, delta = Infinity): number {
		
		// Shortcut ideas:
		// Too far from each other to realistically collide?
		
		// Relative position and velocity
		let rpos = Vector2.subtract(this.position, body.position);
		let rvel = Vector2.subtract(this.velocity, body.velocity);
		let dot = rpos.dot(rvel);
		
		if (dot >= 0.0) {
			// These circles are not moving toward each other
			// They will only collide if they are already colliding
			return NaN;
		}
		
		let r = this.radius + body.radius;
		let rSq = r * r;
		
		let rposMagSq = rpos.magSq();
		
		if (rposMagSq < rSq) { // These circles already overlap, weird case
			return NaN;
		}
		
		let rvelMagSq = rvel.magSq();
		
		// -xvx - yvy +- sqrt((xvx + yvy)^2 - (x^2 + y^2 - r^2)(vx^2 + vy^2))
		// all over (vx^2 + vy^2)
		
		// at^2 + bt + c <= 0
		// a = rvel mag squared
		// b = 2 * rpos dot rvel
		// c = rpos mag squared - r squared
		
		let a = rvelMagSq; // Always positive
		let b = 2 * dot; // Always negative (unless circles moving away from each other)
		let c = rposMagSq - rSq; // Always positive (unless initially overlapping)
		
		let discriminant = b * b - 4 * a * c;
		
		if (discriminant <= 0.0) {
			// No solutions, these circles will not collide
			return NaN;
		}
		
		// (-dot +- sqrt(dot * dot - (rpos.x * rpos.x + rpos.y + rpos.y - r * r) * (rvms)))/rvms
		
		// Could be plus/minus in theory but we disregard the plus
		let t = (-b - Math.sqrt(discriminant))/(2 * a * a);
		
		return t < delta ? t : NaN;
		
	}
	
	/*public isAABBOverlapping(body: PhysicsBody): boolean {
		
	}*/
	
	isStatic(): boolean {
		return this.static;
	}
	
	isOverlapping(body: PhysicsBody): boolean {
		//return this.position.distWithin(body.position, this.radius + body.radius);
		return Physics.areCirclesOverlapping(
			this.position.x, this.position.y, this.radius,
			body.position.x, body.position.y, body.radius
		);
	}
	
	
	protected moveToward(where: Vector2, distance: number): void {
		if (this.position.distWithin(where, distance)) // && distance > 0.0 (redundant)
			this.position.set(where.x, where.y); // don't overshoot
		else
			this.position.add(Vector2.subtract(where, this.position).normalize().multiply(distance));
	}
	protected moveAway(where: Vector2, distance: number): void {
		this.moveToward(where, -distance);
	}
	protected pullToward(where: Vector2, distance: number): void {
		
	}
	
	/*tick(delta: number): void { // delta = time since last tick
		this.position.set(
			this.position.x + this.velocity.x * delta,
			this.position.y + this.velocity.y * delta
		);
	}*/
	
	withPosition(x: number, y: number): PhysicsBody { // Dangerous but eh
		this.position.set(x, y);
		return this;
	}
	withVelocity(x: number, y: number): PhysicsBody {
		this.velocity.set(x, y);
		return this;
	}
	withCollisionLayers(...layers: Array<number>): PhysicsBody {
		
		for (const layer of layers)
			this.addLayerBit(layer);
		
		return this;
		
	}
	//etc
	
	hasLayerBit(layer: number): boolean {
		return (this.collisionLayers & layer) != 0;
	}
	addLayerBit(layer: number): void {
		this.collisionLayers |= layer;
	}
	removeLayerBit(layer: number): void {
		this.collisionLayers &= ~layer;
	}
	hasMaskBit(layer: number): boolean {
		return (this.collisionMask & layer) != 0;
	}
	addMaskBit(layer: number): void {
		this.collisionMask |= layer;
	}
	removeMaskBit(layer: number): void {
		this.collisionMask &= ~layer;
	}
	
}




