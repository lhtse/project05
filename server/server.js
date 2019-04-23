const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = process.env.PORT || 8888;
