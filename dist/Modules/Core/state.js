"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = __importDefault(require("./signal"));
//const ALL = Symbol
const ANY = Symbol();
class State {
    static ANY = ANY;
    changed = new signal_1.default();
    value;
    signalEntries = new Array();
    constructor(value) {
        this.value = value;
    }
    handleChanged(oldState, newState) {
        const out = [oldState, newState];
        this.changed.emit(out);
        for (const entry of this.signalEntries)
            if (this.stateMatch(entry.oldPool, oldState) && this.stateMatch(entry.newPool, newState))
                entry.signal.emit(out);
    }
    stateMatch(pool, state) {
        return pool === State.ANY || pool === state || (Array.isArray(pool) && pool.includes(state));
    }
    createTransition(oldPool, newPool) {
        let signal = new signal_1.default();
        this.signalEntries.push({ signal, oldPool, newPool });
        /*this.changed.connect((values: [T, T]) => {
            
            if (this.stateMatch(oldPool, values[0]) && this.stateMatch(newPool, values[1]))
                signal.emit(values);
            
        });*/
        return signal;
    }
    transition(oldState, newState) {
        return this.createTransition(oldState, newState);
    }
    transitionFrom(oldState) {
        return this.createTransition(oldState, State.ANY);
    }
    transitionTo(newState) {
        return this.createTransition(State.ANY, newState);
    }
    is(value) {
        return this.value == value;
    }
    any(...values) {
        return values.includes(this.value);
    }
    set(newValue) {
        if (newValue !== this.value) {
            let oldValue = this.value;
            this.value = newValue;
            this.handleChanged(oldValue, newValue);
        }
    }
}
exports.default = State;
