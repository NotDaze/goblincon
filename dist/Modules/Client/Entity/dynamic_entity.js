"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = __importDefault(require("../../Core/vector2"));
const entity_1 = __importDefault(require("./entity"));
class DynamicEntity extends entity_1.default {
    constructor() {
        super(...arguments);
        this.velocity = new vector2_1.default();
    }
}
exports.default = DynamicEntity;
