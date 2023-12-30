"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    static add(v1, v2) {
        return v1.duplicate().add(v2);
    }
    static subtract(v1, v2) {
        return v1.duplicate().subtract(v2);
    }
    static multiply(v, f) {
        return v.duplicate().multiply(f);
    }
    static divide(v, f) {
        return v.duplicate().divide(f);
    }
    static angle(v) {
        return v.angle();
    }
    static rotate(v, a) {
        return v.duplicate().rotate(a);
    }
    static normalize(v) {
        return v.duplicate().normalize();
    }
    static lerp(v1, v2, f) {
        return v1.duplicate().lerp(v2, f);
    }
    static midpoint(v1, v2) {
        return v1.duplicate().lerp(v2, 0.5);
    }
    // Informational
    mag() {
        return Math.sqrt(this.magSq());
    }
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    dist(v) {
        return Math.sqrt(this.distSq(v));
    }
    distSq(v) {
        let x = this.x - v.x;
        let y = this.y - v.y;
        return x * x + y * y;
    }
    distWithin(v, r) {
        return r >= 0.0 && this.distSq(v) <= r * r;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    // Manipulation
    duplicate() {
        return new Vector2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return this.set(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return this.set(this.x - v.x, this.y - v.y);
    }
    multiply(f) {
        return this.set(this.x * f, this.y * f);
    }
    divide(f) {
        return this.set(this.x / f, this.y / f);
    }
    normalize() {
        return this.divide(this.mag());
    }
    setMag(m) {
        return this.normalize().multiply(m);
    }
    rotate(a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return this.set(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    lerp(v, f) {
        return this.set(this.x + f * (v.x - this.x), this.y + f * (v.y - this.y));
    }
}
Vector2.ZERO = new Vector2(0, 0);
Vector2.UP = new Vector2(0, -1);
Vector2.DOWN = new Vector2(0, 1);
Vector2.LEFT = new Vector2(-1, 0);
Vector2.RIGHT = new Vector2(1, 0);
exports.default = Vector2;
