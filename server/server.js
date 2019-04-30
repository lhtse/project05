/**
 * TODO:
 * 1. When a client joins, push them into the queue (implemented as an array)
 * 2. When the size of the array is 4, we can start a game
 */

const express = require("express");
const app = express();
const path = require("path");
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

const port = process.env.PORT || 3000;

app.use("/static", express.static(path.join(__dirname)));
/**
 * Server is listening on the port
 */
httpServer.listen(port, () => {
  console.log("listening on port ", port);
});

app.get("/index.js", function(req, res) {
  res.sendFile(__dirname + "/index.js");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
  // res.sendFile(__dirname + "/index.js");
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

  // Handling when player has joined
  client.on("player joined", displayName => {
    console.log("player has joined: " + displayName);
    io.emit("say hello", displayName + " says helloooo");
  });
});

/********************************************
 * Begin game helper functions and variables
 *********************************************/
var queue = []; // Creating queue using an array
