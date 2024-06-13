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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const googleAuth_service_1 = require("../services/googleAuth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../database/models/user"));
require("dotenv/config");
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;
if (!clientID || !clientSecret || !callbackURL) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL must be set");
}
passport_1.default.serializeUser((user, done) => {
    done(null, user);
    console.log(user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
    console.log(user);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID,
    clientSecret,
    callbackURL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (!profile.emails || profile.emails.length === 0) {
        return done(new Error("No email found from the Google profile"));
    }
    let user = yield (0, googleAuth_service_1.findUserByEmail)(profile.emails[0].value);
    let isNewUser = false;
    if (!user) {
        const randomPassword = crypto_1.default.randomBytes(16).toString("hex");
        const hashedPassword = yield bcrypt_1.default.hash(randomPassword, 10);
        user = yield user_1.default.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
        });
        isNewUser = true;
    }
    return done(null, user, { isNewUser });
})));
