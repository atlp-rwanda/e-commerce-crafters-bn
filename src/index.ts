import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

import userRoute from "./routes/user.route";
import forgetPassword from "./routes/forget.password.router";
import swaggerRoute from "./config/SwaggerConfig";
import connectSequelize from "./database/config/db.config";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/", userRoute);
app.use("/", forgetPassword);  
app.use("/api-docs", swaggerRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

connectSequelize.authenticate() 
  .then(() => {
    console.log('connected to the database')
  }).catch((error: any) => {
    console.log(error.message)
  });

export { app, server };
