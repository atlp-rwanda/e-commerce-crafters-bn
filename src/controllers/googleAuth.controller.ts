import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { generateToken } from "../helpers/generateToken";
import User from "../database/models/user";

export const redirectToGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

export const handleGoogleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", async (err: any, user: User, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/auth/google");
    }

    const token = await generateToken(user);

    const redirectUrl = new URL(`${process.env.GOOGLE_AUTH_REDIRECT_URL}`);
    redirectUrl.searchParams.append('token', token);
    redirectUrl.searchParams.append('user', JSON.stringify(user));

    if (info && info.isNewUser) {
      return res.redirect(redirectUrl.toString());
    } else {
      return res.redirect(redirectUrl.toString());
    }
  })(req, res, next);
};
