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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.twoFAController = void 0;
const _2fa_service_1 = require("../services/2fa.service");
const _2fa_service_2 = require("../services/2fa.service");
const twoFAController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const twoFactorData = yield (0, _2fa_service_1.generate2FACode)(req.body);
    const extSession = req.session;
    if (twoFactorData) {
        extSession.twoFactorCode = twoFactorData.twoFactorCode;
        if (typeof twoFactorData.twoFactorExpiry === "number") {
            extSession.twoFactorExpiry = new Date(twoFactorData.twoFactorExpiry);
        }
        extSession.email = email;
        extSession.password = password;
        return res.status(200).json({ message: "2FA code sent. Please verify the code." });
    }
    else {
        next();
    }
});
exports.twoFAController = twoFAController;
const verifyCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const extendedSession = req.session;
    const { code } = req.body;
    const sessionCode = extendedSession.twoFactorCode;
    const sessionExpiry = extendedSession.twoFactorExpiry;
    extendedSession.twoFAError = null;
    if (sessionCode && sessionExpiry) {
        const sessionExpiryDate = new Date(sessionExpiry);
        const result = (0, _2fa_service_2.verify2FACode)(code, sessionCode, sessionExpiryDate.getTime());
        if (result === true) {
            extendedSession.twoFactorCode = null;
            extendedSession.twoFactorExpiry = null;
        }
        else {
            extendedSession.twoFAError = result;
        }
    }
    else {
        extendedSession.twoFAError = "2FA code or expiring time is missing.";
    }
    try {
        yield new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(null);
                }
            });
        });
        next();
    }
    catch (err) {
        return res.status(500).json({ message: "Error saving session" });
    }
});
exports.verifyCode = verifyCode;
