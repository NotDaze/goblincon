"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ByteOStream {
    static join(...byteArrays) {
        if (byteArrays.length === 0)
            return new Uint8Array();
        if (byteArrays.length === 1)
            return byteArrays[0].slice();
        let totalLength = 0;
        for (const byteArray of byteArrays)
            totalLength += byteArray.length;
        let out = new Uint8Array(totalLength);
        let index = 0;
        for (const byteArray of byteArrays) {
            out.set(byteArray, index);
            index += byteArray.length;
        }
        return out;
    }
    segments;
    constructor(...segments) {
        this.segments = segments.slice();
    }
    write(bytes) {
        this.segments.push(bytes);
    }
    clear() {
        this.segments = [];
    }
    get bytes() {
        if (this.segments.length !== 1)
            this.segments = [ByteOStream.join(...this.segments)]; // Compress segments into one
        return this.segments[0];
    }
}
exports.default = ByteOStream;
