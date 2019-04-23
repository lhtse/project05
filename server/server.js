const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
  console.log("listening on port ", port);
});

io.on("connection", client => {
  console.log("a client has connected");
});
