"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    r;
    g;
    b;
    a;
    string;
    /*static rgba(r: number, g: number, b: number, a: number) {
        return new Color(r, g, b, a);
    }
    static rgb(r: number, g: number, b: number) {
        return this.rgba(r, g, b, 1.0);
    }*/
    static getString(r, g, b, a = 1.0) {
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 255)})`;
    }
    constructor(r, g, b, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        //this.set(r, g, b, a); // not doing this to appease typescript
    }
    set(r, g, b, a = this.a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.string = undefined;
    }
    getR() {
        return this.r;
    }
    getG() {
        return this.g;
    }
    getB() {
        return this.b;
    }
    getA() {
        return this.a;
    }
    setR(newR) {
        this.r = newR;
        this.string = undefined;
    }
    setG(newG) {
        this.g = newG;
        this.string = undefined;
    }
    setB(newB) {
        this.b = newB;
        this.string = undefined;
    }
    setA(newA) {
        this.a = newA;
        this.string = undefined;
    }
    getString() {
        if (this.string == undefined)
            return (this.string = Color.getString(this.r, this.g, this.b, this.a));
        else
            return this.string;
    }
}
exports.default = Color;
