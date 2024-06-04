import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { TOTP } from "otpauth";
import User from "../database/models/user";
import { randomBytes } from "crypto";
import { encode } from "base32.js";
dotenv.config();

const transporter = nodemailer.createTransport({
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

export const generate2FACode = async (userData: {
  email: string;
  password: string;
}) => {
  const existUser = await User.findOne({ where: { email: userData.email } });

  if (existUser && existUser.isTwoFactorEnabled) {
    const secret = encode(randomBytes(10));
    const otp = new TOTP({
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
    await transporter.sendMail(mailOptions);

    return { twoFactorCode: code, twoFactorExpiry: expiry };
  }
};

export const verify2FACode = (
  code: string,
  sessionCode: string,
  sessionExpiry: number
) => {
  if (code === sessionCode && Date.now() < sessionExpiry) {
    return true;
  }
  return false;
};
