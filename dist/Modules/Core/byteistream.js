"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ByteIStream {
    constructor(bytes) {
        this.index = 0;
        this.bytes = bytes;
        //this.index = 0;
    }
    get complete() {
        return this.index >= this.bytes.length;
    }
    get exactComplete() {
        return this.index === this.bytes.length;
    }
    *next(count) {
        //console.log(this.bytes.slice(this.index, this.index + count));
        //return this.bytes.slice(this.index, this.index += count);
        let start = this.index;
        let end = (this.index += count); // Store this so that outside changes can't screw anything up
        if (end > this.bytes.length) {
            console.error("ByteIStream length exceeded.");
            end = this.bytes.length;
        }
        for (let i = start; i < end; i++)
            yield this.bytes[i];
    }
    nextArray(count) {
        return this.bytes.slice(this.index, this.index += count);
    }
    /*public *next(count: number): Uint8Array {
        
    }*/
    verifyExactComplete() {
        if (!this.exactComplete) {
            console.error("ByteIStream Error");
            console.error(this.bytes);
            console.error(this.index);
        }
    }
}
exports.default = ByteIStream;
