"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsBody = exports.PhysicsEnvironment = void 0;
const vector2_1 = __importDefault(require("../../Core/vector2"));
/*interface AABB {
    top: number,
    bottom: number,
    left: number,
    right: number,
    width: number,
    height: number
}*/
class Physics {
    //static areAABBsOverlapping(l1: number, t1: number, )
    static areCirclesOverlapping(x1, y1, r1, x2, y2, r2) {
        //let dx = x1 - x2;
        //let dy = y1 - y2;
        let dx = Math.abs(x1 - x2);
        let dy = Math.abs(y1 - y2);
        let r = r1 + r2;
        // Currently does AABB test first, might make things faster
        return dx < r && dy < r && dx * dx + dy * dy < r * r;
    }
    static calculateBodyCollisionDelta(bodyOne, bodyTwo, maxDelta = Infinity) {
        // Will bodyOne and bodyTwo collide within the next maxDelta seconds?
        // Shortcut ideas:
        // Too far from each other to realistically collide?
        // Relative position and velocity
        let rpos = vector2_1.default.subtract(bodyOne.position, bodyTwo.position);
        let rvel = vector2_1.default.subtract(bodyOne.velocity, bodyTwo.velocity);
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
        let t = (-b - Math.sqrt(discriminant)) / (2 * a);
        return t < maxDelta ? t : NaN;
    }
    static chunkID(chunkSize, position) {
        let x = Math.round(position.x / chunkSize + 65536 / 2);
        let y = Math.round(position.y / chunkSize + 65536 / 2);
        return x + (y << 16);
    }
    static chunkX(id) {
        return (id >> 16) - 65536 / 2;
    }
    static chunkY(id) {
        return (id & 65535) - 65536 / 2;
    }
    static shiftChunkID(baseChunkID, deltaX, deltaY) {
        return baseChunkID + deltaX + (deltaY << 16);
    }
}
exports.default = Physics;
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
    constructor() {
        this.collisions = new Map();
    }
    //private collisions = new Array<[bodyOne: PhysicsBody, bodyTwo: PhysicsBody, time: number]>();
    getBodyCollisionArray(body) {
        let collisions = this.collisions.get(body);
        if (collisions !== undefined)
            return collisions;
        collisions = new Array();
        this.collisions.set(body, collisions);
        return collisions;
    }
    /*private collisionSearch(array: Array<[PhysicsBody, number]>, entry: [PhysicsBody, number], minIndex = 0, maxIndex = array.length): number {
        
        if (maxIndex - minIndex <= 1) {
            return minIndex;
        }
        
        
        
    }*/
    insertCollision(array, entry, minIndex = 0, maxIndex = array.length - 1) {
        if (minIndex <= maxIndex) {
            array.splice(minIndex, 0, entry);
            return;
        }
        let mid = Math.floor((minIndex + maxIndex) / 2);
        if (entry[1] <= array[mid][1])
            this.insertCollision(array, entry, minIndex, mid);
        else
            this.insertCollision(array, entry, mid, maxIndex);
    }
    eraseCollision(array, entry, minIndex = 0, maxIndex = array.length - 1) {
        for (let i = array.length - 1; i >= 0; i--) {
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
    addCollision(bodyOne, bodyTwo, time) {
        this.insertCollision(this.getBodyCollisionArray(bodyOne), [bodyTwo, time]);
        this.insertCollision(this.getBodyCollisionArray(bodyTwo), [bodyOne, time]);
    }
    clearBodyCollisions(...bodies) {
        let clearedCollisions = new Array(bodies.length);
        // Clear collision arrays of bodies
        for (let i = 0; i < bodies.length; i++) {
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
        for (let i = 0; i < bodies.length; i++)
            for (const [collisionBody, collisionTime] of clearedCollisions[i])
                this.eraseCollision(this.getBodyCollisionArray(collisionBody), [bodies[i], collisionTime]);
    }
    getNextCollision() {
        let nextCollision = undefined;
        for (const [body, bodyCollisions] of this.collisions.entries())
            if (bodyCollisions.length > 0) // Body has collisions
                if (nextCollision === undefined || bodyCollisions[0][1] < nextCollision[2]) // This is the new soonest collision
                    nextCollision = [body, ...bodyCollisions[0]];
        return nextCollision;
    }
    popNextCollision() {
        let nextCollision = this.getNextCollision();
        if (nextCollision !== undefined)
            this.clearBodyCollisions(nextCollision[0], nextCollision[1]);
        return nextCollision;
    }
}
class PhysicsEnvironment {
    constructor() {
        this.layerCount = 0;
        // Chunks
        this.chunkSize = 100;
        //private staticChunks = new Map<number, Set<PhysicsBody>>();
        //private dynamicChunks = new Map<number, Set<PhysicsBody>>();
        this.chunks = new Map();
        this.collisionModel = new PhysicsCollisionModel();
        this.bodyDeltas = new Map();
    }
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
    *bodies() {
        /*for (const body of this.dynamicBodies())
            yield body;
        for (const body of this.staticBodies())
            yield body;*/
        for (const chunk of this.chunks.values())
            for (const body of chunk)
                yield body;
    }
    getBodyDelta(body) {
        let delta = this.bodyDeltas.get(body);
        return delta === undefined ? 0.0 : delta;
    }
    setBodyDelta(body, delta) {
        this.bodyDeltas.set(body, delta);
    }
    clearBodyDeltas() {
        this.bodyDeltas.clear();
    }
    /*protected getChunk(chunkID: number): Set<PhysicsBody> | undefined {
        return this.chunks.get(chunkID);
    }*/
    chunkID(position) {
        return Physics.chunkID(this.chunkSize, position);
    }
    *chunkBodies(chunkID) {
        let chunk = this.chunks.get(chunkID);
        if (chunk !== undefined)
            for (const body of chunk)
                yield body;
    }
    chunkRemove(chunkID, body) {
        let chunk = this.chunks.get(chunkID);
        if (chunk === undefined)
            return;
        chunk.delete(body);
        if (chunk.size == 0)
            this.chunks.delete(chunkID);
    }
    chunkAdd(chunkID, body) {
        let chunk = this.chunks.get(chunkID);
        if (chunk === undefined)
            this.chunks.set(chunkID, new Set([body]));
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
    initialChunkUpdatePass() {
        //let movingBodies = new Set<PhysicsBody>();
        let updates = [];
        for (const [chunkID, chunkBodies] of this.chunks.entries()) {
            for (const body of chunkBodies) {
                let newChunkID = this.chunkID(body.position);
                if (newChunkID != chunkID)
                    updates.push([chunkID, newChunkID, body]);
            }
        }
        for (const [oldChunk, newChunk, body] of updates) {
            this.chunkRemove(oldChunk, body);
            this.chunkAdd(newChunk, body);
        }
    }
    calculateChunkInitialInternalCollisions(chunkID, delta) {
        let chunk = this.chunks.get(chunkID);
        if (!chunk || chunk.size <= 1) // This chunk is empty or contains only one body
            return;
        for (const bodyOne of chunk)
            for (const bodyTwo of chunk)
                if (bodyOne !== bodyTwo)
                    this.calculateCollision(bodyOne, bodyTwo, delta);
    }
    calculateChunkInitialExternalCollisions(chunkOneID, chunkTwoID, delta) {
        // collide with self
        // collide with straight adjacent
        // collide with diagonally adjacent
        // i guess?
        for (const bodyOne of this.chunkBodies(chunkOneID))
            for (const bodyTwo of this.chunkBodies(chunkTwoID))
                this.calculateCollision(bodyOne, bodyTwo, delta);
    }
    calculateChunkInitialCollisions(chunkID, delta) {
        this.calculateChunkInitialInternalCollisions(chunkID, delta);
        for (const [x, y] of [[-1, 1], [0, 1], [1, 1], [1, 0]])
            this.calculateChunkInitialExternalCollisions(chunkID, Physics.shiftChunkID(chunkID, x, y), delta);
    }
    calculateBodyChunkCollisions(body, chunkID, maxDelta) {
        for (const chunkBody of this.chunkBodies(chunkID))
            this.calculateCollision(body, chunkBody, maxDelta);
    }
    recalculateBodyCollisions(body, maxDelta) {
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
    initialCollisionPass(delta) {
        for (const chunkID of this.chunks.keys())
            this.calculateChunkInitialCollisions(chunkID, delta);
    }
    calculateCollision(bodyOne, bodyTwo, maxDelta) {
        let initialDelta = this.syncBodyDeltas(bodyOne, bodyTwo);
        let collisionDelta = Physics.calculateBodyCollisionDelta(bodyOne, bodyTwo, maxDelta - initialDelta);
        if (Number.isNaN(collisionDelta))
            return;
        this.addCollision(bodyOne, bodyTwo, initialDelta + collisionDelta);
    }
    addCollision(bodyOne, bodyTwo, maxDelta) {
        this.collisionModel.addCollision(bodyOne, bodyTwo, 10);
    }
    syncBodyDeltas(bodyOne, bodyTwo) {
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
    advanceBodyToDelta(body, newDelta) {
        let deltaAdvancement = newDelta - this.getBodyDelta(body);
        if (deltaAdvancement <= 1e-10)
            return;
        body.position.x += body.velocity.x * deltaAdvancement;
        body.position.y += body.velocity.y * deltaAdvancement;
        this.setBodyDelta(body, newDelta);
    }
    handleCollision(bodyOne, bodyTwo, collisionDelta, maxDelta) {
        this.advanceBodyToDelta(bodyOne, collisionDelta);
        this.advanceBodyToDelta(bodyTwo, collisionDelta);
        // Calculate and apply new velocities
        // Recalculate new collisions for the bodies
        this.recalculateBodyCollisions(bodyOne, maxDelta - collisionDelta);
        this.recalculateBodyCollisions(bodyTwo, maxDelta - collisionDelta);
    }
    handleNextCollision(maxDelta) {
        let collision = this.collisionModel.popNextCollision();
        if (collision === undefined)
            return false;
        this.handleCollision(...collision, maxDelta);
        return true;
    }
    handleCollisions(deltaAdvancement) {
        while (this.handleNextCollision(deltaAdvancement)) { }
    }
    nextLayer() {
        return 1 << (++this.layerCount);
    }
    advance(deltaAdvancement) {
        this.clearBodyDeltas();
        this.initialChunkUpdatePass();
        this.initialCollisionPass(deltaAdvancement);
    }
}
exports.PhysicsEnvironment = PhysicsEnvironment;
/*export class PhysicsProfile {
    
    layers: number;
    mask: number;
    
    constructor(layers: number, mask: number) {
        
    }
    
    matches(profile: PhysicsProfile) {
        
    }
    
}*/
class PhysicsBody {
    // find next collision
    // run until that next collision happens
    // 
    constructor(position = new vector2_1.default(0, 0), radius = 20.0, angle = 0) {
        this.collisionLayers = 0;
        this.collisionMask = 0;
        this.position = new vector2_1.default();
        this.velocity = new vector2_1.default();
        this.angle = 0.0;
        this.angularVelocity = 0.0;
        this.mass = 1.0;
        this.radius = 20.0;
        this.static = false;
        this.chunkID = NaN;
        //Object.assign(this, { position, radius, angle });
        this.position = position;
        this.radius = radius;
        this.angle = angle;
    }
    get left() {
        return this.position.x - this.radius;
    }
    get right() {
        return this.position.x + this.radius;
    }
    get top() {
        return this.position.y - this.radius;
    }
    get bottom() {
        return this.position.y + this.radius;
    }
    get width() {
        return this.radius * 2;
    }
    get height() {
        return this.radius * 2;
    }
    get diameter() {
        return this.radius * 2;
    }
    get area() {
        return this.radius * this.radius * Math.PI;
    }
    setChunkID(newChunkID) {
        this.chunkID = newChunkID;
    }
    getChunkID() {
        return this.chunkID;
    }
    calculateLinearCollisionDelta(body, delta = Infinity) {
        // Shortcut ideas:
        // Too far from each other to realistically collide?
        // Relative position and velocity
        let rpos = vector2_1.default.subtract(this.position, body.position);
        let rvel = vector2_1.default.subtract(this.velocity, body.velocity);
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
        let t = (-b - Math.sqrt(discriminant)) / (2 * a * a);
        return t < delta ? t : NaN;
    }
    /*public isAABBOverlapping(body: PhysicsBody): boolean {
        
    }*/
    isStatic() {
        return this.static;
    }
    isOverlapping(body) {
        //return this.position.distWithin(body.position, this.radius + body.radius);
        return Physics.areCirclesOverlapping(this.position.x, this.position.y, this.radius, body.position.x, body.position.y, body.radius);
    }
    moveToward(where, distance) {
        if (this.position.distWithin(where, distance)) // && distance > 0.0 (redundant)
            this.position.set(where.x, where.y); // don't overshoot
        else
            this.position.add(vector2_1.default.subtract(where, this.position).normalize().multiply(distance));
    }
    moveAway(where, distance) {
        this.moveToward(where, -distance);
    }
    pullToward(where, distance) {
    }
    /*tick(delta: number): void { // delta = time since last tick
        this.position.set(
            this.position.x + this.velocity.x * delta,
            this.position.y + this.velocity.y * delta
        );
    }*/
    withPosition(x, y) {
        this.position.set(x, y);
        return this;
    }
    withVelocity(x, y) {
        this.velocity.set(x, y);
        return this;
    }
    withCollisionLayers(...layers) {
        for (const layer of layers)
            this.addLayerBit(layer);
        return this;
    }
    //etc
    hasLayerBit(layer) {
        return (this.collisionLayers & layer) != 0;
    }
    addLayerBit(layer) {
        this.collisionLayers |= layer;
    }
    removeLayerBit(layer) {
        this.collisionLayers &= ~layer;
    }
    hasMaskBit(layer) {
        return (this.collisionMask & layer) != 0;
    }
    addMaskBit(layer) {
        this.collisionMask |= layer;
    }
    removeMaskBit(layer) {
        this.collisionMask &= ~layer;
    }
}
exports.PhysicsBody = PhysicsBody;
