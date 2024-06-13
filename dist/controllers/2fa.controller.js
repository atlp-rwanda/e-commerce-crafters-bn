"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enable2FA = void 0;
const user_1 = __importDefault(require("../database/models/user"));
const enable2FA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.token.id;
        const user = yield user_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
        yield user.save();
        const statusMessage = user.isTwoFactorEnabled
            ? "2FA enabled."
            : "2FA disabled.";
        return res.status(200).json({ message: statusMessage });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.enable2FA = enable2FA;
