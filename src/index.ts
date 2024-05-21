// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// const PORT = process.env.PORT;

// import userRoute from "./routes/user.route";
// import swaggerRoute from "./config/SwaggerConfig";

// const app = express();

// app.use(express.static("public"));
// app.use(express.json())
// app.use("/", userRoute);
// app.use("/api-docs", swaggerRoute);

//  const server = app.listen(PORT, () => {
//     console.log(`Server running on Port ${PORT}`);
//   });

// export { app,server };
import connectSequelize from "./database/config/db.config";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

import userRoute from "./routes/user.route";
import forgetPassword from "./routes/forget.password.router"
import vendorRoute from "./routes/vendor.route";
import swaggerRoute from "./config/SwaggerConfig";
import productRoute from "./routes/product.route";

import adminRoute from "./routes/roles.route";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.json());
app.use("/", userRoute);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export { app, server };
