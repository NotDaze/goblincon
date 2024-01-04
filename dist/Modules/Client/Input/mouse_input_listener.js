"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signal_1 = __importDefault(require("../../Core/signal"));
class MouseInputListener {
    mouseDown = new signal_1.default();
    mouseUp = new signal_1.default();
    constructor(element) {
        /*element.addEventListener("mousedown", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
        element.addEventListener("mouseup", (ev: MouseEvent) => this.mouseUp.emit([ ev.offsetX, ev.offsetY ]));
        //element.addEventListener("mous", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
        element.addEventListener("mousedown", (ev: MouseEvent) => this.mouseDown.emit([ ev.offsetX, ev.offsetY ]));
        element.addEventListener("mouse")*/
    }
}
exports.default = MouseInputListener;
