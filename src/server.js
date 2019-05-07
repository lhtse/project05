/**
 * TODO:
 * 1. Ensure that no 2 players can have the same display name
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
  });

  // Handling when player joins
  client.on("player joined", playerInfo => {
    console.log("player has joined: " + playerInfo.name);

    // Add the new player object to the player map
    playerMap.set(client.id, playerInfo);

    // Add the new player to the queue
    queue.push(client.id);

    // Check to see if there are 4 players in the queue
    if (queue.length == 4) {
      startNewGame(); // Start the game
    }
  });

  // Handle when a word is played
  client.on("make guess", guessedWord => {
    // Converts the entered characters to lower case
    guessedWord = guessedWord.trim().toLowerCase();
    console.log(playerMap.get(client.id).name + " guessed " + guessedWord);

    // Retrieve the correct game results object
    var gameIndex = playerMap.get(client.id).gameIndex;
    var gameResults = gamesArr[gameIndex];
    var correctWord = gameResults.correctWord;

    // Check if the word is correct
    if (guessedWord !== correctWord) {
      console.log("not correct word....");
      // Letting user know that the word is incorrect
      io.to(client.id).emit("try again");
    } else {
      // Update the score of the player who guessed correctly
      playerMap.get(client.id).score += 1;

      // test that it updates the game results object fixme: delete
      for (var i = 0; i < 4; ++i) {
        console.log(eval("gameResults.player" + (i + 1) + ".name") + " has ");
        console.log(eval("gameResults.player" + (i + 1) + ".score"));
      }

      // Check if the game is over (someone has scored 5 points)
      if (winnerExists(gameResults)) {
        // Send message to all players that the game is over
        sendToGamePlayers(gameResults, "gameover", gameResults);
      } else {
        // If word is correct then send message to the player of the game
        sendToGamePlayers(gameResults, "round over", gameResults);
      }
    }
  });

  client.on("times up", () => {
    var gameIndex = playerMap.get(client.id).gameIndex;
    var gameResults = gamesArr[gameIndex];

    sendToGamePlayers(gameResults, "round over", gameResults);
  });
});

/********************************************
 * Begin game helper functions and variables
 *********************************************/
var queue = []; // Creating queue using an array that will hold the names of the players
var gamesArr = []; // Holds the objects of all games currently being played
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
function startNewGame() {
  // Creating the JSON object
  var gameResults = {
    player1: "",
    player2: "",
    player3: "",
    player4: "",
    correctWord: ""
  };

  // Generating a word
  gameResults.correctWord = getRandomWord();

  var clientID; // Holds the client ID
  for (i = 0; i < 4; i++) {
    clientID = queue.shift(); // Dequeuing the values from queue
    playerMap.get(clientID).gameIndex = gamesArr.length; // Store the index of the current game
    // Store into the JSON object
    gameResults["player" + (i + 1)] = playerMap.get(clientID);
  }

  gamesArr.push(gameResults); // Push into the games array

  // Scramble the word
  var scrambledWord = scrambleTheWord(gameResults.correctWord);

  // Send the scrambled word to all players in Game
  sendToGamePlayers(gameResults, "play game", scrambledWord);
}

/********************************************************
 * this function randomly scrambles the 'originalWord'
 * that is given as a parameter and returns it
 * @param {*} originalWord
 ********************************************************/
function scrambleTheWord(originalWord) {
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
 * Generates a random word
 ********************************/
function getRandomWord() {
  // Get the random word
  var indexOfWord = Math.floor(Math.random() * words.length);
  var correctWord = words[indexOfWord];

  return correctWord;
}

/***********************************************
 * Send a message to all of the players
 * @param {*} gameResults
 * @param {*} message
 * @param {*} objToSend
 ***********************************************/
function sendToGamePlayers(gameResults, message, objToSend) {
  var playerID;
  for (var i = 0; i < 4; ++i) {
    // Retrieve client id for each player in the object
    playerID = eval("gameResults.player" + (i + 1) + ".clientID");

    // Send message to the specific players
    io.to(playerID).emit(message, objToSend);
  }
}

/**
 * Determines if there is a winner in the game
 * @param {*} gameResults
 */
function winnerExists(gameResults) {
  for (var i = 0; i < 4; ++i) {
    if (eval("gameResults.player" + (i + 1 + ".score")) == 5) {
      return true;
    }
  }

  return false;
}
