"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sorted_array_1 = __importDefault(require("./sorted_array"));
class IDIndex {
    constructor() {
        this.map = new Map();
        this.ids = new Set();
        this.values = new Set();
        this.highestID = -1;
        this.freeIDs = new Array();
    }
    *[Symbol.iterator]() {
        for (const value of this.map.values())
            yield value;
    }
    get size() {
        return this.values.size;
    }
    trim() {
        while (this.highestID >= 0) {
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
    freeID(id) {
        if (id === this.highestID) { // Trim
            this.highestID--;
            this.trim();
        }
        else {
            sorted_array_1.default.insert(this.freeIDs, id);
        }
    }
    reserveID(id) {
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
    getNextID() {
        // Use lowest freed ID, if we have any
        if (this.freeIDs.length > 0)
            return this.freeIDs[0];
        return this.highestID + 1;
    }
    has(id) {
        return this.map.has(id);
    }
    get(id) {
        return this.map.get(id);
    }
    hasValue(value) {
        return this.values.has(value);
    }
    add(value, id = this.getNextID()) {
        if (this.ids.has(id))
            console.error("Index ID collision");
        this.map.set(id, value);
        this.values.add(value);
        this.ids.add(id);
        this.reserveID(id);
        return id;
    }
    remove(id) {
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
exports.default = IDIndex;
