import { Request, Response, NextFunction } from "express";
import User from '../database/models/user';
import { Session } from 'express-session';
import { generateAndSend2FACode } from '../services/2fa.service';
import { verify2FACode } from '../services/2fa.service';

export const toggle2FAController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).token.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isTwoFactorEnabled = !user.isTwoFactorEnabled;
    await user.save();

    const statusMessage = user.isTwoFactorEnabled ? "2FA enabled." : "2FA disabled.";
    res.status(200).json({ message: statusMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



interface ExtendedSession extends Session {
	email?: string;
	password?: string;
  twoFactorCode?: string | null;
  twoFactorExpiry?: Date | null;
  twoFAError?: string;
}

export const twoFAController = async (req: Request, res: Response) => {
	const { email, password } = req.body;
  const twoFactorData = await generateAndSend2FACode(req.body);
//   console.log(twoFactorData)
  if (twoFactorData) {
	(req.session as ExtendedSession).twoFactorCode = twoFactorData.twoFactorCode;
	if (typeof twoFactorData.twoFactorExpiry === 'number') {
	  (req.session as ExtendedSession).twoFactorExpiry = new Date(twoFactorData.twoFactorExpiry);
	}
	(req.session as ExtendedSession).email = email;
    (req.session as ExtendedSession).password = password;
	// console.log(req.session as ExtendedSession); 
  }
  res.status(200).json({ message: '2FA code sent. Please verify the code.' });
};

export const verifyCodeController = (req: Request, res: Response, next: NextFunction) => {
	// console.log(req.session as ExtendedSession) 
	const { code } = req.body;
	const sessionCode = (req.session as ExtendedSession).twoFactorCode;
	const sessionExpiry = (req.session as ExtendedSession).twoFactorExpiry;
     
	console.log(code);
	// console.log(sessionCode);
	// console.log(sessionExpiry);
	
	if (sessionCode && sessionExpiry) {
	  const sessionExpiryDate = new Date(sessionExpiry);
	  if (verify2FACode(code, sessionCode, sessionExpiryDate.getTime())) {
		(req.session as ExtendedSession).twoFactorCode = null;
		(req.session as ExtendedSession).twoFactorExpiry = null;
		req.session.save(err => {
		  if (err) {
			return res.status(500).json({ message: 'Error saving session' });
		  }
		  next();
		});
	  } else {
		(req.session as ExtendedSession).twoFAError = "Invalid or expired 2FA code.";
		req.session.save(err => {
		  if (err) {
			return res.status(500).json({ message: 'Error saving session' });
		  }
		  next();
		});
	  }
	} else {
	  (req.session as ExtendedSession).twoFAError = "2FA code or expiry is missing.";
	  req.session.save(err => {
		if (err) {
		  return res.status(500).json({ message: 'Error saving session' });
		}
		next();
	  });
	}
  };