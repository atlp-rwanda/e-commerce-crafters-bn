import express from "express";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

import userRoute from "./routes/user.route";
import swaggerRoute from "./config/SwaggerConfig";
import adminRoute from "./routes/roles.route";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/", userRoute);
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export { app, server };
