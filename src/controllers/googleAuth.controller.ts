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

<<<<<<< HEAD
    const token = await generateToken(user);
    const userData = {
      id: user.userId,
      email: user.email,
      name: user.name,
      profile: user.profile
    };

    const redirectUrl = new URL(`${process.env.GOOGLE_AUTH_REDIRECT_URL}`);
    redirectUrl.searchParams.append('token', token);
    redirectUrl.searchParams.append('user', JSON.stringify(userData));

    if (info && info.isNewUser) {
      return res.redirect(redirectUrl.toString());
    } else {
      return res.redirect(redirectUrl.toString());
=======
    if (info.isNewUser) {
      return res
        .status(200)
        .json({ error: false, message: "Successfully signed up." });
    } else {
      const token = await generateToken(user);
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
        .json({ error: false, message: "Successfully logged in." });
>>>>>>> develop
    }
  })(req, res, next);
};
