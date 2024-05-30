import express from "express";
import dotenv from "dotenv";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
const PORT = process.env.PORT;

import userRoute from "./routes/user.route";
import vendorRoute from "./routes/vendor.route";
import swaggerRoute from "./config/SwaggerConfig";
import productRoute from "./routes/product.route";
import orderRoute from './routes/order.route';

import adminRoute from "./routes/roles.route";

const app = express();
const httpServer = http.createServer(app);
const ioServer = new SocketIOServer(httpServer);


app.use(express.static("public"));
app.use(express.json());
app.use("/", userRoute);
app.use("/", vendorRoute);
app.use("/", productRoute);
app.use("/", vendorRoute);
app.use("/api-docs", swaggerRoute);
app.use("/admin", adminRoute);
app.use('/', orderRoute);

ioServer.on('connection', (socket) => {
  console.log('user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})


const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

export { app, httpServer, ioServer };
