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
exports.verify2FACode = exports.generate2FACode = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const otpauth_1 = require("otpauth");
const user_1 = __importDefault(require("../database/models/user"));
const crypto_1 = require("crypto");
const base32_js_1 = require("base32.js");
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
const generate2FACode = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_1.default.findOne({ where: { email: userData.email } });
    if (existUser && existUser.isTwoFactorEnabled) {
        const secret = (0, base32_js_1.encode)((0, crypto_1.randomBytes)(10));
        const otp = new otpauth_1.TOTP({
            secret: secret,
            digits: 6,
            period: 120,
        });
        const code = otp.generate();
        const expiry = Date.now() + otp.period * 1000;
        let mailOptions = {
            from: process.env.EMAIL,
            to: existUser.email,
            subject: "Two factor authentication code",
            html: `
        <div style="text-align: center;">
          <h1 style="color: #444;">Two Factor Authentication Code</h1>
          <p style="font-size: 16px; color: #666;">
            Dear user,
          </p>
          <p style="font-size: 16px; color: #666;">
            Your 2FA code is:
          </p>
          <p style="font-size: 24px; color: #3498db;">
            ${code}
          </p>
          <p style="font-size: 16px; color: #666;">
            This code will expire in 2 minutes. Please use it promptly.
          </p>
          <p style="font-size: 16px; color: #666;">
            Regards,
          </p>
          <p style="font-size: 16px; color: #666;">
            Crafters Team
          </p>
        </div>
      `,
        };
        yield transporter.sendMail(mailOptions);
        return { twoFactorCode: code, twoFactorExpiry: expiry };
    }
});
exports.generate2FACode = generate2FACode;
const verify2FACode = (code, sessionCode, sessionExpiry) => {
    if (code !== sessionCode) {
        return 'Invalid code.';
    }
    else if (Date.now() >= sessionExpiry) {
        return 'The code has expired.';
    }
    return true;
};
exports.verify2FACode = verify2FACode;
