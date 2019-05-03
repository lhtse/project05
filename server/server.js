/**
 * TODO:
 * 1. When a client joins, push them into the queue (implemented as an array)
 * 2. When the size of the array is 4, we can start a game
 */

/**
 * TODO:
 * 1. Build a Timer object using the existing Timers module for node.js
 * 2. Handle the case where the timer runs out before any client sends
 *    the correct answer to the server
 * 
 * var myInt = setInterval(function () {
 *   clientUpdate();
 * }, 60000);
 * 
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
  console.log("a client has connected: " + client.id);

  // Handling when a client has disconnected
  client.on("disconnect", () => {
    console.log("a client has disconnected " + client.id);

    // Removing player from the queue
    removeFromQueue(client.id);

    // Removing the player from the player map
    playerMap.delete(client.id);

    // Handling when player has joined
    // Listens for "player joined" string then will display the message
    client.on("player joined", playerInfo => {
      console.log("player has joined: " + playerInfo.name);

      // Add the new player object to the player map
      playerMap.set(client.id, playerInfo);
      // fixme: delete
      // playerMap.forEach((value, key) => {
      //   console.log("name of player is: " + value.name);
      //   console.log("key is " + key);
      // });

      // Add the new player to the queue
      queue.push(client.id);
      // fixme: delete
      // queue.forEach(element => {
      //   console.log("element: " + element);
      // });

      // Check to see if there are 4 players in the queue
      if (queue.length == 4) {
        io.emit("starting game");

        // Remove first 4 players (call this in the play game function)
        getGamePlayers();

        // Start the game
      }
    });
  });
});

/********************************************
 * Begin game helper functions and variables
 *********************************************/
var queue = []; // Creating queue using an array that will hold the names of the players
var playerMap = new Map();

/*********************************
 * Removes player from the queue
 ********************************/
function removeFromQueue(clientID) {
  var index = queue.indexOf(clientID);
  queue.splice(index, 1);
}

/*************************************************
 * Removes first 4 players from the queue and
 * stores them into a JSON object
 ************************************************/
function getGamePlayers() {
  var clientID;
  for (i = 0; i < 4; i++) {
    clientID = queue.shift();
    // console.log("removing: " + playerMap.get(clientID).name); //fixme delete
  }

  console.log("size of queue: " + queue.length); // fixme delete
}

/*********************************
 * Plays a round of the game
 ********************************/
function playGame() {
  // Retrieve the object that holds all the current players
  // var gameInfo = getGamePlayers();

  // Get the scrambled word

  // Start the timer

  // Listen for submitted word
  io.on("play word", word => {
    // Check if the word is correct
    var placeholder = "delete me";
    // If word is correct then send message to the player of the game
  });
}

function sendToGamePlayers(gameInfo, message) {
  // Retrieve client id for each player in the object
  // Send message to the specific players

  var placeholder = "delete me";
}
