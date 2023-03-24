"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mainFolder = require.main;
exports.default = path_1.default.dirname(mainFolder.filename);
//# sourceMappingURL=path.js.map