import passport, { Profile } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findUserByEmail } from "../services/googleAuth.service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../database/models/user";

import "dotenv/config";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (!clientID || !clientSecret || !callbackURL) {
  throw new Error(
    "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and GOOGLE_CALLBACK_URL must be set"
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user);
  console.log(user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
  console.log(user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error("No email found from the Google profile"));
      }

      let user = await findUserByEmail(profile.emails[0].value);
      let isNewUser: boolean = false;
      if (!user) {
        const randomPassword = crypto.randomBytes(16).toString("hex");
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: hashedPassword,
        });
        isNewUser = true;
      }

      return done(null, user, { isNewUser });
    }
  )
);
