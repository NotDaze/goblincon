"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwoWayMap extends Map {
    reverse = new Map();
    constructor(iterable) {
        super();
        if (iterable != undefined)
            for (const [key, value] of iterable)
                this.set(key, value);
    }
    set(key, value) {
        if (this.reverse.has(value)) { // Values must be unique
            console.error("Added duplicate value to TwoWayMap, clearing its original entry.");
            this.reverseDelete(value);
        }
        this.reverse.set(value, key);
        return super.set(key, value);
    }
    delete(key) {
        let value = this.get(key);
        if (value !== undefined)
            this.reverse.delete(value);
        return super.delete(key);
    }
    /*reverseSet(value: Value, key: Key): this {
        return this.set(key, value);
    }*/
    reverseHas(value) {
        return this.reverse.has(value);
    }
    reverseGet(value) {
        return this.reverse.get(value);
    }
    reverseDelete(value) {
        let key = this.reverseGet(value);
        if (key === undefined) // Value does not exist
            return false;
        super.delete(key);
        this.reverse.delete(value);
        return true;
    }
}
exports.default = TwoWayMap;
