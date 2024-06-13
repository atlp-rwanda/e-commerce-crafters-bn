"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAccessToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const VerifyAccessToken = (req, res, next) => {
    const bearerToken = req.header('authorization');
    if (!bearerToken) {
        return res.status(401).json({ message: "No token found" });
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }
    jsonwebtoken_1.default.verify(token, 'crafters1234', (err, decoded) => {
        if (err) {
            if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).json({ message: "Expired token" });
            }
            else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token" });
            }
            else {
                return res.status(500).json({ message: "Error verifying token" });
            }
        }
        else {
            req.token = decoded;
            next();
        }
    });
};
exports.VerifyAccessToken = VerifyAccessToken;
