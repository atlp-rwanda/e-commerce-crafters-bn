import dotenv from 'dotenv';
import nodemailer from "nodemailer";
import { TOTP } from 'otpauth';
import User from '../database/models/user';
import { randomBytes } from "crypto";
import { encode } from "base32.js";
dotenv.config()

export const generateAndSend2FACode = async (userData:  { email: string; password: string }) => {
  const existUser = await User.findOne({ where: { email: userData.email } });
 
    if (existUser && existUser.isTwoFactorEnabled) {
		const secret = encode(randomBytes(10));
      const otp = new TOTP({
        secret: secret,
        digits: 6,
        period: 120
      });

      const code = otp.generate();
      const expiry = Date.now() + otp.period * 1000;


      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
		tls: {
			rejectUnauthorized: false
		  }
      });

      let mailOptions = {
        from: process.env.EMAIL,
        to: existUser.email,
        subject: "Two factor authentication code",
        html: `your 2FA code is ${code}`
      };
      await transporter.sendMail(mailOptions);

      return { twoFactorCode: code, twoFactorExpiry: expiry };
	}
}

export const verify2FACode = (code: string, sessionCode: string, sessionExpiry: number) => {
	
	if (code === sessionCode && Date.now() < sessionExpiry) {
	  return true;
	}
	return false;
  };