/**
 * TODO:
 * 1. Add event handler for game form
 */
var socket = io(); // Holds the client socket
var playerInfo = {
  clientID: "",
  name: "",
  score: 0,
  latestGuess: ""
};

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

      // Unblock the modal
      nameModal.style.display = "none";

      // Display waiting room by default
      showModal(document.getElementById("waiting-room"));

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
      // Update the latest guessed word
      playerInfo.latestGuess = gameField.value;
      alert("sending word: " + playerInfo.latestGuess);

      socket.emit("make guess", playerInfo);

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

/*****************************
 * Handling server messages
 *****************************/
socket.on("play game", scrambledWord => {
  // Display the scrambled word on the html page
  document.getElementById("scrambled-word").innerHTML = scrambledWord;
  // Remove the "waiting room" modal
  document.getElementById("waiting-room").style.display = "none";
});

socket.on("round over", correctWord => {
  alert(correctWord);
  document.getElementById("scrambled-word").innerHTML = "";
});

socket.on("try again", () => {
  alert("try again!!!!!!!!!!!!!!");
});
