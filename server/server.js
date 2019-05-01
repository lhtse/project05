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

app.use("/static", express.static(path.join(__dirname))); // fixme: might not need this so delete

/**************************************
 * Server is listening on the port
 **************************************/
httpServer.listen(port, () => {
  console.log("listening on port ", port);
});

app.get("/index.js", function(req, res) {
  res.sendFile(__dirname + "/index.js");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/styles.css", function(req, res) {
  res.sendFile(__dirname + "/styles.css");
});

/************************************
 * Handler for when client connects
 ***********************************/
io.on("connection", client => {
  console.log("a client has connected");

  // Handling when a client has disconnected
  client.on("disconnect", () => {
    console.log("a client has disconnected");
  });

  // Handling when player has joined
  // Listens for "player joined" string then will display the message
  client.on("player joined", playerInfo => {
    console.log("player has joined: " + playerInfo.name);

    io.emit("to waiting room");

    playerMap.set(playerInfo.name, playerInfo);
    io.emit("in waiting room", playerMap.get(playerInfo.name));
  });
});

/********************************************
 * Begin game helper functions and variables
 *********************************************/
var queue = []; // Creating queue using an array that will hold the names of the players
var playerMap = new Map();
