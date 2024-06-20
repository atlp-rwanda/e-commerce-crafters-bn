import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";
import { generate2FACode } from "../services/2fa.service";
import { verify2FACode } from "../services/2fa.service";

interface ExtendedSession extends Session {
  email?: string;
  password?: string;
  twoFactorCode?: string | null;
  twoFactorExpiry?: Date | null;
  twoFAError?: string | null;
}

export const twoFAController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const twoFactorData = await generate2FACode(req.body);
  const extSession = req.session as ExtendedSession;

  if (twoFactorData) {
    extSession.twoFactorCode = twoFactorData.twoFactorCode;
    if (typeof twoFactorData.twoFactorExpiry === "number") {
      extSession.twoFactorExpiry = new Date(twoFactorData.twoFactorExpiry);
    }
    extSession.email = email;
    extSession.password = password;
    return res.status(200).json({ message: "2FA code sent. Please verify the code." });
  } else {
    next();
  }
};

export const verifyCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const extendedSession = req.session as ExtendedSession;
  const { code } = req.body;

  const sessionCode = extendedSession.twoFactorCode;
  const sessionExpiry = extendedSession.twoFactorExpiry;

  extendedSession.twoFAError = null;

  if (sessionCode && sessionExpiry) {
    const sessionExpiryDate = new Date(sessionExpiry);
    const result = verify2FACode(code, sessionCode, sessionExpiryDate.getTime());

    if (result === true) {
      extendedSession.twoFactorCode = null;
      extendedSession.twoFactorExpiry = null;
    } else {
      extendedSession.twoFAError = result;
    }
  } else {
    extendedSession.twoFAError = "2FA code or expiring time is missing.";
  }
  
  try {
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
    next();
  } catch (err) {
    return res.status(500).json({ message: "Error saving session" });
  }
};
