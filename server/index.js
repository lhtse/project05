var socket = io(); // Holds the client socket
//Information of each individual player is stored.
//We need to keep track of their name for the results page and their score to determine who wins the game
var playerInfo = {
  name: " ", 
  score:0
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
socket.on("starting game", () => {
  document.getElementById("waiting-room").style.display = "none";
});
