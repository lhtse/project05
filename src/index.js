var socket = io(); // Holds the client socket
var playerInfo = {
  clientID: "",
  name: "",
  score: 0,
  gameIndex: ""
};
var gameTimer = null;
var gameTimeout = null;
var roundTimer = null;
var roundTimeout = null;

//Running init() function after page loads
addEvent(window, "load", init, false);
/***************************************************************************************
Definition of addEvent() function: Attaches appropriate browser event handler to object.
Takes document object, event name string, function name, and boolean as parameters.
****************************************************************************************/
function addEvent(object, eventName, functName, cap) {
  // Return if object is null
  if (object == null) {
    return;
  }

  // Attaching event handler based on the browser
  if (object.attachEvent) {
    object.attachEvent("on" + eventName, functName);
  } else if (object.addEventListener) {
    object.addEventListener(eventName, functName, cap);
  }
}

/******************************************
 * Defintion of init:
 *****************************************/
function init() {
  // Setting up action handler for the display name form
  var nameForm = document.getElementById("name-form");
  var nameField = document.getElementById("name-field");
  var nameModal = document.getElementById("name-modal");

  showModal(nameModal); // Display the display name modal

  // Add even handler for display name submission
  addEvent(
    nameForm,
    "submit",
    event => {
      playerInfo.clientID = socket.id;
      playerInfo.name = nameField.value; // Update the info object with display name
      socket.emit("player joined", playerInfo); // Send info to the server

      nameModal.style.display = "none"; // Unblock the modal
      showModal(document.getElementById("waiting-room")); // Display waiting room by default

      event.preventDefault(); // preventing from reloading the page
    },
    false
  );

  // Add event handler for user entering word into the game form
  var gameForm = document.getElementById("unscramble-form");
  var gameField = document.getElementById("unscramble-field");
  addEvent(
    gameForm,
    "submit",
    event => {
      resetTimer(gameTimer);
      resetTimeout(gameTimeout);

      var guessedWord = gameField.value; // Get the guessed word
      socket.emit("make guess", guessedWord); // Send the guessed word to the server
      event.preventDefault();
    },
    false
  );
}

/*******************************
 * Display Modals
 *******************************/
function showModal(modal) {
  // Getting the modal
  modal.style.display = "block";

  // Shake modal when user clicks outside
  addEvent(
    window,
    "click",
    event => {
      // Setting up the modal to update based on window size
      modal.classList.remove("shake");
      modal.offsetHeight;

      // Implementing shaking effect
      if (event.target == modal) {
        modal.classList.add("shake");
      }
    },
    false
  );
}

function showScoreBoard(gameResults) {
  document.getElementById("scrambled-word").innerHTML = "";
  document.getElementById("unscramble-field").value = "";

  // Setup the game results
  var resultsArr = [
    gameResults.player1,
    gameResults.player2,
    gameResults.player3,
    gameResults.player4
  ];

  // Sort the results array based on the score
  resultsArr.sort((object1, object2) => {
    var a = object1.score;
    var b = object2.score;
    console.log("a is " + a + " b is " + b);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  // Populate the score table with the player names and scores
  for (var i = 0; i < 4; ++i) {
    document.getElementById("name" + (i + 1)).innerHTML = resultsArr[i].name;
    document.getElementById("score" + (i + 1)).innerHTML = resultsArr[i].score;
  }

  showModal(document.getElementById("score-modal")); // Display game results
}

function resetTimer(timer) {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

function resetTimeout(timeout) {
  if (timeout !== null) {
    clearInterval(timeout);
    timeout = null;
  }
}

/*****************************
 * Handling server messages
 *****************************/
socket.on("play game", scrambledWord => {
  resetTimer(roundTimer);
  resetTimeout(roundTimeout);

  // Display the scrambled word on the html page
  document.getElementById("scrambled-word").innerHTML = scrambledWord;
  // Remove the "waiting room" modal
  document.getElementById("waiting-room").style.display = "none";

  // Remove the scoreboard if it is visible
  document.getElementById("score-modal").style.display = "none";

  var gameTimeLeft = 20;
  document.getElementById("timer").innerHTML =
    "Time Remaining: " + gameTimeLeft + " s";

  gameTimer = setInterval(() => {
    document.getElementById("timer").innerHTML =
      "Time Remaining: " + --gameTimeLeft + " s";
  }, 1000);

  gameTimeout = setTimeout(() => {
    clearInterval(gameTimer);
    gameTimer = null;
    socket.emit("times up");
  }, 20000);
});

// Displaying score board when the round is over
socket.on("round over", gameResults => {
  resetTimer(gameTimer);
  resetTimeout(gameTimeout);

  var timeLeft = 5;

  document.getElementById("round-timer").innerHTML =
    "Time Remaining: " + timeLeft + " s";

  showScoreBoard(gameResults);

  roundTimer = setInterval(() => {
    document.getElementById("round-timer").innerHTML =
      "Next Round In: " + --timeLeft + " s";
  }, 1000);

  roundTimeout = setTimeout(() => {
    clearInterval(roundTimer);
    document.getElementById("round-timer").innerHTML = "";
    socket.emit("next round");
  }, 5000);
});

socket.on("gameover", gameResults => {
  resetTimer(gameTimer);
  resetTimeout(gameTimeout);
  resetTimer(roundTimer);
  resetTimeout(roundTimeout);

  document.getElementById("scoreboard-h2").innerHTML =
    "Game Over! (Final Scoreboard)";
  document.getElementById("play-again-btn").style.display = "block";
  showScoreBoard(gameResults);
});

socket.on("try again", () => {
  alert("Oops that's not the correct word...try again!");
});
