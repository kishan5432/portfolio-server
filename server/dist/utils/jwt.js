"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const generateToken = (payload) => {
    if (!env_1.default.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, env_1.default.JWT_SECRET, {
        expiresIn: env_1.default.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    if (!env_1.default.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=jwt.js.map