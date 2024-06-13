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
exports.handleGoogleCallback = exports.redirectToGoogle = void 0;
const passport_1 = __importDefault(require("passport"));
const generateToken_1 = require("../helpers/generateToken");
exports.redirectToGoogle = passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
});
const handleGoogleCallback = (req, res, next) => {
    passport_1.default.authenticate("google", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/auth/google");
        }
        if (info && info.isNewUser) {
            return res
                .status(200)
                .json({ message: "Successfully signed up." });
        }
        else {
            const token = yield (0, generateToken_1.generateToken)(user);
            // console.log(token);
            res
                .header("Authorization", `Bearer ${token}`)
                .cookie("Authorization", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                sameSite: "lax",
                secure: true,
            });
            return res
                .status(200)
                .json({ message: "Successfully logged in." });
        }
    }))(req, res, next);
};
exports.handleGoogleCallback = handleGoogleCallback;
