import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import './config/passport';

dotenv.config();
const PORT = process.env.PORT;

import userRoute from "./routes/user.route";
import vendorRoute from "./routes/vendor.route";
import swaggerRoute from "./config/SwaggerConfig";

import productRoute from "./routes/product.route";
import adminRoute from "./routes/roles.route";
import forgotPassword from "./routes/forget.password.router";
import authRoute from "./routes/auth.router";
import roleRoute from "./routes/roles.route";
import orderRoute from "./routes/order.route";
import checkoutRoute from "./routes/checkout.router"

import googleAuthRoute from './routes/googleAuth.route'
import cartroute from "./routes/cart.route"
import wishlistroute from "./routes/wishlist.route"
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret:'crafters1234',
  resave:false,
  saveUninitialized:true,
  cookie: { secure: false }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.json());


// app.use(express.json());
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", productRoute);
app.use("/", forgotPassword);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/", roleRoute);
app.use("/", orderRoute);
app.use("/", checkoutRoute);
app.use('/', googleAuthRoute)
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);
app.use("/", cartroute);
app.use("/", wishlistroute);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export { app, server };
