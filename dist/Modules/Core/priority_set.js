"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sorted_array_1 = __importDefault(require("./sorted_array"));
class PrioritySet {
    map = new Map();
    priorities = new Array();
    *[Symbol.iterator]() {
        for (const priority of this.priorities) {
            let values = this.map.get(priority);
            if (values)
                for (const value of values)
                    yield value;
            /*let values = this.map.get(this.priorities[i]);
            
            for(let j = values.length - 1; j >= 0; j--) {
                yield values[j];
            }*/
        }
    }
    *backwards() {
        for (const priority of this.priorities) {
            let values = this.map.get(priority);
            if (values) {
                for (const value of values) {
                    yield value;
                }
            }
        }
    }
    /*get priorities() {
        return this.priorities;
    }
    get values() {
        return this.map;
    }*/
    addPriority(priority) {
        sorted_array_1.default.insert(this.priorities, priority);
    }
    deletePriority(priority) {
        sorted_array_1.default.remove(this.priorities, priority);
    }
    has(value) {
        for (const set of this.map.values()) {
            if (set.has(value))
                return true;
        }
        return false;
    }
    add(priority, ...values) {
        if (values.length === 0)
            return;
        let set = this.map.get(priority);
        if (set) {
            for (const value of values) {
                set.add(value);
            }
        }
        else {
            this.addPriority(priority);
            this.map.set(priority, new Set(values));
        }
    }
    delete(...values) {
        for (const priority of this.priorities) {
            let set = this.map.get(priority);
            if (set) {
                for (const value of values)
                    set.delete(value);
            }
            /*let arr = this.map.get(priority);

            if (arr) {

                let index = arr.indexOf(value);

                if (index >= 0) {
                    arr.splice(index, 1);

                    if (arr.length === 0) {
                        this.#deletePriority(priority);
                        this.map.delete(priority);
                    }

                    break;
                }
            }*/
        }
    }
    clear() {
        this.map.clear();
        this.priorities = new Array();
    }
}
exports.default = PrioritySet;
