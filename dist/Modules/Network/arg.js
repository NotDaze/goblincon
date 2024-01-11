"use strict";
//const ByteStream = require("../Core/bytestream");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const byteistream_1 = __importDefault(require("../Core/byteistream"));
const byteostream_1 = __importDefault(require("../Core/byteostream"));
const LOG256 = Math.log(256);
const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();
;
//type Unarg<> = T;
//type FlattenArg<T extends ArgLike> = T extends Arg<infer ArgT> ? ArgT : T;
//type ArgLike<T> = (T extends Arg<infer ArgT> ? ArgT : T);
/*type FlattenArgLike<T extends ArgLike> = (
    T extends Arg<infer ArgT> ? ArgT : (
    T extends ArgMap<infer ArgMapT> ? ArgMapT : never
)*/
//type ArgLike<T> = ArgMap<T> | Arg<T>;
//type ArgTuple<T> = Array<ArgLike>;
//type ArgMap = { [key: string]: ArgLike }
//type ArgValue<T extends ArgLike> = T extends Arg;
//type ArgMap = Record<string, ArgLike>
//type ArgValue<Arg<T>> = 
//type ArgValue
//type ArgLike<T> = ArgMap<T>
//type ArgMap<T extends DynamicObject> = { [key: string]: string }
//[ Arg.STR1, Arg.INT1 ] => [string, number]
//import { joinByteArrays, ByteOStream, ByteIStream } from "../Core/byteistream"
class ArgLength {
    iterations;
    bytes;
    static VAR1 = new ArgLength(1, 1);
    static VAR2 = new ArgLength(1, 2);
    static VAR3 = new ArgLength(1, 3);
    static fixed(bytes) {
        return new ArgLength(0, bytes);
    }
    constructor(iterations, bytes) {
        this.iterations = iterations;
        this.bytes = bytes;
    }
}
class Arg {
    length;
    constructor(length) {
        this.length = length;
    }
    matches(value) {
        console.error("Override Arg.matches");
        return false;
    }
    encode(value) {
        console.error("Override Arg.encode");
        return new Uint8Array();
    }
    streamEncode(value, stream) {
        stream.write(this.encode(value));
    }
    decode(bytes) {
        throw new Error("Override Arg.decode (unless only using Arg.streamDecode)");
        //return undefined as T; // This is a hack, but probably a necessary one?
    }
    streamDecode(stream) {
        let byteCount = Arg.resolveHeader(stream, this.length);
        let bytes = stream.next(byteCount);
        return this.decode(bytes);
    }
    //static safe: boolean = true;
    static calculateByteCount(choiceCount) {
        //return Math.max(1, );
        return Math.ceil(Math.log(choiceCount) / LOG256);
    }
    static calculateChoiceCount(byteCount) {
        return 1 << (8 * byteCount);
    }
    static joinByteArrays(...byteArrays) {
        return byteostream_1.default.join(...byteArrays);
    }
    static encodeInt(value, byteCount) {
        byteCount = (byteCount !== undefined ? byteCount : Arg.calculateByteCount(value));
        let out = new Uint8Array(byteCount);
        for (let i = 0; i < byteCount; i++) {
            out[i] = (value & 255);
            value = value >> 8;
        }
        return out;
    }
    /*static decodeInt(bytes: Uint8Array): number {
        
        let out = 0;
        
        for (let i = 0; i < bytes.length; i++) {
            out += (bytes[i] << i * 8);
        }
        
        return out;
        
    }*/
    static decodeInt(bytes) {
        let out = 0;
        let i = 0;
        for (const byte of bytes) {
            if (i >= 4)
                continue;
            out += byte << (8 * (i++));
        }
        return out;
    }
    static encodeFloat(value, min, precision, byteCount) {
        return this.encodeInt(Math.round((value - min) / precision), byteCount);
    }
    static decodeFloat(bytes, min, precision) {
        return min + this.decodeInt(bytes) * precision;
    }
    static encodeStr(str) {
        return TEXT_ENCODER.encode(str);
    }
    static decodeStr(bytes) {
        return TEXT_DECODER.decode(Uint8Array.from(bytes));
    }
    /*static decodeStrArray(bytes: Uint8Array): string {
        return TEXT_DECODER.decode(bytes);
    }*/
    static createHeader(footprint, byteCount) {
        if (footprint.iterations <= 0)
            return new Uint8Array();
        let segments = new Array;
        for (let i = 0; i < footprint.iterations; i++) {
            let lengthToEncode = (i == 0 ? byteCount : segments[0].length);
            let newSegmentLength = Arg.calculateByteCount(lengthToEncode);
            if (i === footprint.iterations - 1) { // last iteration
                if (footprint.bytes < newSegmentLength)
                    throw "Length header too small to encode value";
                newSegmentLength = footprint.bytes;
            }
            segments.unshift(this.encodeInt(lengthToEncode, newSegmentLength));
        }
        return Arg.joinByteArrays(...segments);
    }
    static withHeader(footprint, bytes) {
        return Arg.joinByteArrays(this.createHeader(footprint, bytes.length), bytes);
    }
    static resolveHeader(stream, footprint) {
        let byteCount = footprint.bytes;
        for (let i = 0; i < footprint.iterations; i++) {
            byteCount = this.decodeInt(stream.next(byteCount));
        }
        return byteCount;
    }
    static matches(arg, value) {
        if (arg == null) {
            return value == null;
        }
        else if (arg instanceof Arg) {
            return arg.matches(value);
        }
        else if (Array.isArray(arg)) {
            if (!Array.isArray(value) || arg.length !== value.length)
                return false;
            for (let i = 0; i < arg.length; i++) {
                if (!this.matches(arg[i], value[i]))
                    return false;
            }
            return true;
        }
        else {
            for (const key in arg) {
                if (!this.matches(arg[key], (key in value) ? value[key] : null))
                    return false;
            }
            return true;
        }
    }
    static matchesAll(arg, values) {
        for (const value of values) {
            if (!Arg.matches(arg, value))
                return false;
        }
        return true;
    }
    static streamEncodeAll(arg, values, stream) {
        for (const value of values)
            Arg.streamEncode(arg, value, stream);
    }
    static streamDecodeAll(arg, count, stream) {
        let out = new Array();
        for (let i = 0; i < count; i++) {
            out.push(Arg.streamDecode(arg, stream));
        }
        return out;
    }
    static encode(arg, value) {
        if (!this.matches(arg, value))
            console.error("Arg/Value Mismatch | ", value, " | ", arg);
        let stream = new byteostream_1.default();
        this.streamEncode(arg, value, stream);
        return stream.bytes;
    }
    static streamEncode(arg, value, stream) {
        if (arg == null) {
            if (value != null)
                console.error("Invalid null arg footprint.");
        }
        else if (arg instanceof Arg) {
            arg.streamEncode(value, stream);
        }
        else if (Array.isArray(arg)) {
            for (let i = 0; i < arg.length; i++)
                this.streamEncode(arg[i], value[i], stream);
        }
        else {
            for (const key in arg) {
                this.streamEncode(arg[key], value[key], stream);
            }
        } // TODO: improve error handling
    }
    static decode(arg, bytes) {
        return this.streamDecode(arg, new byteistream_1.default(bytes));
    }
    static streamDecodeSafe(arg, stream) {
        let decoded = this.streamDecode(arg, stream);
        stream.verifyExactComplete();
        return decoded;
    }
    static streamDecode(arg, stream) {
        /*if (arg === undefined) {
            return undefined;
        }*/
        if (arg instanceof Arg) {
            return arg.streamDecode(stream);
        }
        else {
            //let decoded = {} as T;
            if (Array.isArray(arg)) {
                let decoded = [];
                for (const subarg of arg)
                    decoded.push(this.streamDecode(subarg, stream));
                return decoded;
            }
            else {
                let decoded = {};
                for (const key in arg)
                    decoded[key] = this.streamDecode(arg[key], stream);
                return decoded;
            }
        }
        /*else if (arg instanceof Array) {
            
            let decoded = new Array<any>();
            
            for (const subarg of arg)
                decoded.push(this.streamDecode(subarg, stream));
            
            return decoded;
            
        }
        else {
            
            let decoded: DynamicObject = {};
            
            for (const key in arg)
                decoded[key] = this.streamDecode(arg[key], stream);
            
            return decoded;
            
        }*/
    }
    static test(arg, value) {
        let encoded = Arg.encode(arg, value);
        let decoded = Arg.decode(arg, encoded);
        //if (decoded !== encoded)
        //	console.log("Arg test failed!");
        console.log(value);
        console.log(decoded);
        console.log(encoded);
    }
    static rawFixed(byteCount) {
        return RawArg.fixed(byteCount);
    }
    static strFixed(byteCount) {
        return StrArg.fixed(byteCount);
    }
    /*static int(byteCount: number, min: number): IntArg {
        return new IntArg(byteCount, min);
    }*/
    static float(min, max, precision = 0.01) {
        return new FloatArg(min, max, precision);
    }
    /*static str(iterCount: number = 1, byteCount: number = 2): StrArg {
        return new StrArg(iterCount, byteCount);
    }*/
    static choice(...choices) {
        return new ChoiceArg(...choices);
    }
    static array(arg, byteCount = 2) {
        return new ArrayArg(arg, byteCount);
    }
    static arrayShort(arg) {
        return Arg.array(arg, 1);
    }
    static arrayLong(arg) {
        return Arg.array(arg, 2);
    }
    static branch(...paths) {
        return new BranchArg(paths);
    }
    static const(value) {
        return new ConstArg(value, true);
    }
    static auto(value) {
        return new ConstArg(value, false);
    }
    static default(arg, fallback) {
        return new BranchArg([new ConstArg(fallback, false), arg]);
    }
    static optional(arg) {
        return Arg.default(arg, undefined);
    }
    /*static UINT1 = this.int(1, 0);
    static UINT2 = this.int(2, 0);
    static UINT4 = this.int(4, 0);
    static UINT6 = this.int(6, 0);
    
    static INT1 = this.int(1, -128);
    static INT2 = this.int(2, -32768);
    static INT4 = this.int(4, -2147483648);
    static INT6 = this.int(6, -281474976710656);
    
    static CHAR = this.str(0, 1);
    static STRING1 = this.str(1, 1);
    static STRING2 = this.str(2, 1);
    
    static BOOL = this.choice(false, true);*/
    static RAW1;
    static RAW2;
    static RAW3;
    static UINT1;
    static UINT2;
    static UINT4;
    static UINT6;
    static INT1;
    static INT2;
    static INT4;
    static INT6;
    static CHAR;
    static STR1;
    static STR2;
    static STR3;
    static BOOL;
    static NONE;
}
exports.default = Arg;
class RawArg extends Arg {
    static fixed(bytes) {
        return new RawArg(ArgLength.fixed(bytes));
    }
    constructor(length) {
        super(length);
    }
    matches(value) {
        return value instanceof Uint8Array;
    }
    streamEncode(value, stream) {
        stream.write(Arg.createHeader(this.length, value.length));
        stream.write(value);
    }
    streamDecode(stream) {
        let byteCount = Arg.resolveHeader(stream, this.length);
        return stream.nextArray(byteCount);
    }
}
class ChoiceArg extends Arg {
    choices;
    constructor(...choices) {
        super(new ArgLength(0, Arg.calculateByteCount(choices.length)));
        this.choices = choices;
    }
    matches(value) {
        return this.choices.includes(value);
    }
    encode(value) {
        let index = this.choices.indexOf(value);
        if (index < 0)
            console.error("Invalid ChoiceArg choice: ", value, " | ", this.choices);
        return Arg.encodeInt(index, this.length.bytes);
    }
    decode(bytes) {
        return this.choices[Arg.decodeInt(bytes)];
    }
}
class IntArg extends Arg {
    min;
    max; // not inclusive
    constructor(byteCount, min = 0) {
        super(new ArgLength(0, byteCount));
        this.min = min;
        this.max = min + Arg.calculateChoiceCount(byteCount);
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return Number.isInteger(value) && value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeInt(value - this.min, this.length.bytes);
    }
    decode(bytes) {
        return Arg.decodeInt(bytes) + this.min;
    }
}
class FloatArg extends Arg {
    min;
    max; // exclusive
    precision;
    constructor(min, max, precision) {
        if (precision === undefined)
            precision = 0.01;
        super(new ArgLength(0, Arg.calculateByteCount((max - min) / precision)));
        this.min = (min === undefined ? 0 : min);
        this.max = this.min + precision * Arg.calculateChoiceCount(this.length.bytes);
        this.precision = precision;
    }
    matches(value) {
        if (typeof value != "number")
            return false;
        return value >= this.min && value < this.max;
    }
    encode(value) {
        return Arg.encodeFloat(value, this.min, this.precision, this.length.bytes);
    }
    decode(bytes) {
        return Arg.decodeFloat(bytes, this.min, this.precision);
    }
}
class StrArg extends Arg {
    static fixed(bytes) {
        return new StrArg(ArgLength.fixed(bytes));
    }
    constructor(length) {
        super(length);
    }
    matches(value) {
        if (typeof value != "string")
            return false;
        return true; // TODO: should probably length check
    }
    encode(value) {
        return Arg.withHeader(this.length, Arg.encodeStr(value));
    }
    decode(bytes) {
        return Arg.decodeStr(bytes);
    }
}
class ArrayArg extends Arg {
    arg;
    constructor(arg, byteCount = 2) {
        // special length header that tells how many copies of the sublist you get
        // also, this is certified black magic
        super(new ArgLength(1, byteCount));
        this.arg = arg;
    }
    matches(values) {
        if (!Array.isArray(values) && !(values instanceof Set))
            return false;
        return Arg.matchesAll(this.arg, values);
    }
    /*public encode(values: Array<any>): Uint8Array {
        
        return Arg.joinByteArrays(
            Arg.createHeader(this.length, values.length), // header
            ...(values.map(value => { return Arg.encode(this.arg, value) })) // encoded values
        );
        
        //return Arg.joinByteArrays([ header, encoded ]);
        
    }*/
    streamEncode(values, stream) {
        stream.write(Arg.createHeader(this.length, values.length));
        Arg.streamEncodeAll(this.arg, values, stream);
    }
    streamDecode(stream) {
        return Arg.streamDecodeAll(this.arg, Arg.resolveHeader(stream, this.length), stream);
        /*let decoded = new Array<any>();
        
        for (let i = 0; i < valueCount; i++) {
            decoded.push(Arg.streamDecode(this.arg, stream));
        }
        
        
        return decoded;*/
    }
}
class DictArg extends Arg {
    keyArg;
    valueArg;
    constructor(keyArg, valueArg, byteCount = 2) {
        super(new ArgLength(1, byteCount));
        this.keyArg = keyArg;
        this.valueArg = valueArg;
    }
    matches(obj) {
        if (obj instanceof Map)
            return Arg.matchesAll(this.keyArg, obj.keys()) && Arg.matchesAll(this.valueArg, obj.values());
        else if (typeof obj == "object" && Object.getPrototypeOf(obj) === Object.prototype)
            return Arg.matchesAll(this.keyArg, Object.keys(obj)) && Arg.matchesAll(this.valueArg, Object.values(obj));
        else
            return false;
    }
    streamEncode(obj, stream) {
        if (obj instanceof Map) {
            stream.write(Arg.createHeader(this.length, obj.size));
            for (const [key, value] of obj) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, value, stream);
            }
        }
        else { // Generic object, probably a literal
            let keys = Object.keys(obj);
            stream.write(Arg.createHeader(this.length, keys.length));
            for (const key of keys) {
                Arg.streamEncode(this.keyArg, key, stream);
                Arg.streamEncode(this.valueArg, obj[key], stream);
            }
        }
    }
    streamDecode(stream) {
        let valueCount = Arg.resolveHeader(stream, this.length);
        //let decoded: Record<
        let decoded = {};
        for (let i = 0; i < valueCount; i++) {
            let key = Arg.streamDecode(this.keyArg, stream);
            let value = Arg.streamDecode(this.valueArg, stream);
            decoded[key] = value;
        }
        return decoded;
    }
}
class BranchArg extends Arg {
    paths;
    constructor(paths, byteCount = 1) {
        super(new ArgLength(1, byteCount));
        this.paths = Array.from(paths);
    }
    matches(value) {
        for (const path of this.paths) {
            if (Arg.matches(path, value))
                return true;
        }
        return false;
    }
    streamEncode(value, stream) {
        for (let i = 0; i < this.paths.length; i++) {
            //console.log(i)
            if (Arg.matches(this.paths[i], value)) { // Use first matching path
                stream.write(Arg.encodeInt(i, this.length.bytes));
                Arg.streamEncode(this.paths[i], value, stream);
                return;
            }
        }
        console.error("No match found for BranchArg.");
    }
    streamDecode(stream) {
        let path = Arg.resolveHeader(stream, this.length);
        return Arg.streamDecode(// Header tells us which path to use
        this.paths[path], stream);
    }
}
class ConstArg extends Arg {
    value;
    mandatory;
    constructor(value, mandatory = true) {
        super(new ArgLength(0, 0));
        this.value = value;
        this.mandatory = mandatory;
    }
    matches(value) {
        if (value === this.value)
            return true;
        else if (value == null)
            return !this.mandatory;
        else
            return false;
    }
    streamEncode(value, stream) {
        if (value === undefined) {
            if (this.mandatory) {
                console.error("Invalid value for mandatory constArg");
            }
        }
        else if (value !== this.value) {
            throw new Error("Invalid value for ConstArg.");
        }
    }
    streamDecode(stream) {
        return this.value;
    }
}
Arg.RAW1 = new RawArg(ArgLength.VAR1);
Arg.RAW2 = new RawArg(ArgLength.VAR2);
Arg.RAW3 = new RawArg(ArgLength.VAR3);
Arg.UINT1 = new IntArg(1, 0);
Arg.UINT2 = new IntArg(2, 0);
Arg.UINT4 = new IntArg(4, 0);
Arg.UINT6 = new IntArg(6, 0);
Arg.INT1 = new IntArg(1, -128);
Arg.INT2 = new IntArg(2, -32768);
Arg.INT4 = new IntArg(4, -2147483648);
Arg.INT6 = new IntArg(6, -281474976710656);
Arg.CHAR = StrArg.fixed(1);
Arg.STR1 = new StrArg(ArgLength.VAR1);
Arg.STR2 = new StrArg(ArgLength.VAR2);
Arg.STR3 = new StrArg(ArgLength.VAR3);
Arg.BOOL = Arg.choice(false, true);
Arg.NONE = Arg.const(undefined);
/*let arg = {
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMLineIndex: Arg.INT2,
    sdpMid: Arg.STRING2,
    usernameFragment: Arg.STRING2
};*/
/*let encoded = Arg.encode(arg, {
    peerID: 2,
    candidate: "candidate",
    sdpMLineIndex: 12,
    sdpMid: "yeah",
    usernameFragment: "yeah"
})*/
//let encoded = Arg.encode(arg, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
/*let arg = Arg.STRING2;

let encoded = new Uint8Array([ 7, 0, 0, 0, 0, 0, 1, 0, 48, 0, 128, 8, 0, 99, 51, 52, 51, 50, 55, 98, 52 ]);


console.log(Arg.decode({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, encoded))

Arg.test({
    peerID: Arg.UINT2,
    //media: Arg.STRING1,
    //index: Arg.UINT2,
    //name: Arg.STRING2
    candidate: Arg.STRING2,
    sdpMid: Arg.STRING2,
    sdpMLineIndex: Arg.UINT2,
    usernameFragment: Arg.STRING2
}, { peerID: 0, candidate: "candidate:0 1 UDP 2122252543 ebde5967-d563-4beb-bada-3bc12fa08c35.local 62385 typ host", sdpMid: "0", sdpMLineIndex: 0, usernameFragment: "65db9032" });
//console.log(encoded, Arg.decode(arg, encoded))*/
//console.log(Arg.decode(Arg.INT1, Arg.encode(Arg.INT1, 120)));
//console.log(Arg.encode(arg, 1));
/*Arg.test(Arg.RAW1, new Uint8Array([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]));
Arg.test(Arg.RAW2, new Uint8Array([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]));
Arg.test(Arg.RAW3, new Uint8Array([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]));
Arg.test(Arg.rawFixed(5), new Uint8Array([4, 5, 7, 10, 12]));*/
/*let arg = Arg.UINT1;
let argList = [ arg, Arg.array([ arg, arg ]), { a: [ arg, arg ], b: arg } ];


let encoded = Arg.encode(argList, [0, [[1, 2], [3, 4], [5, 7]], { a: [ 55, 77 ], b: 66 }]);

console.log(encoded);

let decoded = Arg.decode(argList, encoded);

console.log(decoded);*/
/*let arg = Arg.branch(
    Arg.array(Arg.UINT1),
    Arg.array(Arg.STRING2),
    Arg.array(Arg.array(Arg.CHAR)),
    { x: Arg.UINT1, y: Arg.UINT1 },
    [ Arg.UINT2, Arg.UINT2 ],
    null
);

//console.log(Arg.encode(arg, [ 1, 2 ]));

let encoded = Arg.encode(arg, { x: 2, y: 10 });
//let encoded = Arg.encode(arg, null);
//let encoded = Arg.encode(arg, [ 1, 2, 255, 33, 85 ]);
//let encoded = Arg.encode(arg, [ ["a", "b"], ["c"] ]);
//let encoded = Arg.encode(arg, [ "w", "heeee" ]);

console.log(encoded);
console.log(Arg.decode(arg, encoded));*/
//console.log(Arg.encodeInt(0));
//type ArgTuple<T extends []> = [ArgLike<T[0]>];
//type ArgTuple<T> = { [key in keyof T]: ArgLike<T[key]> }
//type FlattenArg<T extends Arg<any>> = T extends Arg<infer ArgT> ? ArgT : never;
//type FlattenArgMap<T extends ArgMap<any>> = T extends ArgMap<infer ArgT> ? ArgT : never;
/*type FlattenArgLike<T extends ArgLike<T>> = (
    T extends Arg<infer ArgT> ? ArgT :
    (T extends ArgMap<infer ArgMapT> ? ArgMapT : undefined)
);*/
/*let a: ArgMap<{ name: string }> = { name: Arg.STR1 };
let b: FlattenArgLike<ArgMap<{ name: string }>>;

let c: ArgMap<[number, string]> = [Arg.INT1, Arg.STR2];
let d: FlattenArgLike<typeof c>;*/
