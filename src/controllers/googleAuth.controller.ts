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
    }
  })(req, res, next);
};
