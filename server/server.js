const app = require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = process.env.PORT || 3000;

/**
 * Server is listening on the port
 */
httpServer.listen(port, () => {
  console.log("listening on port ", port);
});

/**
 * Handler for when client connects
 */
io.on("connection", client => {
  console.log("a client has connected");

  // Handling when a client has disconnected
  client.on("disconnect", () => {
    console.log("a client has disconnected");
  });
});
