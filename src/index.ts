import express from "express";
import dotenv from "dotenv";
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
import cartroute from "./routes/cart.route";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(express.json());
app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", productRoute);
app.use("/", forgotPassword);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/", roleRoute);
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);
app.use("/", cartroute);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export { app, server };
