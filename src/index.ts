// index.js

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import  setupServer  from './helpers/createServer';

const PORT = process.env.PORT || 3000;

const app = setupServer();
const httpServer = http.createServer(app);
const ioServer = new SocketIOServer(httpServer);

const server = httpServer.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

export { app, ioServer, server };
