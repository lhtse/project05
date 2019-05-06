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
  });

  // Handling when player joins
  client.on("player joined", playerInfo => {
    console.log("player has joined: " + playerInfo.name);

    // Add the new player object to the player map
    playerMap.set(client.id, playerInfo);

    // Add the new player to the queue
    queue.push(client.id);

    console.log("q length: " + queue.length);

    // Check to see if there are 4 players in the queue
    if (queue.length == 4) {
      // Start the game
      playGame();
    }
  });
});

/********************************************
 * Begin game helper functions and variables
 *********************************************/
var queue = []; // Creating queue using an array that will hold the names of the players
var playerMap = new Map();
var words = [
  "hello",
  "little",
  "summer",
  "session",
  "reload",
  "learn",
  "tiger",
  "lizard",
  "phone",
  "burger",
  "science",
  "light",
  "weight",
  "label",
  "sticky",
  "banana",
  "socket",
  "extends",
  "winter",
  "spring",
  "rhino"
];

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
  // Creating the JSON object
  var gameResults = {
    player1: "",
    player2: "",
    player3: "",
    player4: ""
  };
  var clientID; // Holds the client ID
  for (i = 0; i < 4; i++) {
    clientID = queue.shift(); // Dequeuing the values from queue

    // Store into the JSON object
    gameResults["player" + (i + 1)] = playerMap.get(clientID);
    // console.log(eval("gameResults.player" + (i + 1) + ".name"));
    // console.log(eval("gameResults.player" + (i + 1) + ".score"));
  }

  return gameResults;
}

/********************************************************
 * this function randomly scrambles the 'originalWord'
 * that is given as a parameter and returns it
 * @param {*} originalWord
 ********************************************************/
function scramble_the_word(originalWord) {
  var scrambledWord = "";
  var randomIndex;
  // split the word into an array of sub-strings
  var word = originalWord.split("");
  while (word.length > 0) {
    //make sure you use all the letters
    //sets our randomIndex
    randomIndex = Math.floor(Math.random() * word.length);
    //character from the random index is removed one time and added to the scrambled word
    scrambledWord = scrambledWord + word.splice(randomIndex, 1);
  } //continue until all the letters are used up
  return scrambledWord;
}

/*********************************
 * Plays a round of the game
 ********************************/
function playGame() {
  // Retrieve the object that holds all the current players
  var gameResults = getGamePlayers();

  // Get the random word
  var indexOfWord = Math.floor(Math.random() * words.length);
  var correctWord = words[indexOfWord];

  // Scramble the word
  var scrambledWord = scramble_the_word(correctWord);

  // Send the scrambled word to all players in Game
  sendToGamePlayers(gameResults, "play game", scrambledWord);

  // Start the timer

  // Check that the time limit has not run out

  // Listen for guessed word
  io.on("make guess", playerInfo => {
    // Converts the entered characters to lower case
    var guessedWord = playerInfo.latestGuess;
    guessedWord = guessedWord.trim().toLowerCase();

    // Check if the word is correct
    if (guessedWord !== correctWord) {
      console.log("not correct word....");
      // Letting user know that the word is incorrect
      io.to("${playerID}").emit("try again");
    } else {
      // If word is correct then send message to the player of the game
      sendToGamePlayers(gameResults, "round over", correctWord);
    }
  });

  console.log("exiting the function::::::");
}

function sendToGamePlayers(gameResults, message, objToSend) {
  var playerID;
  for (var i = 0; i < 4; ++i) {
    // Retrieve client id for each player in the object
    playerID = eval("gameResults.player" + (i + 1) + ".clientID");
    console.log("send to the player: " + playerID);

    // Send message to the specific players
    io.to(playerID).emit(message, objToSend);
  }
}
