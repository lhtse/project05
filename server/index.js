var socket = io(); // Holds the client socket
var playerInfo = {
  name: ""
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

  showModal(nameModal);

  addEvent(
    nameForm,
    "submit",
    event => {
      playerInfo.name = nameField.value;
      alert("display name: " + playerInfo.name);
      socket.emit("player joined", playerInfo);

      // Unblock the modal
      nameModal.style.display = "none";

      event.preventDefault(); // preventing from reloading the page fixme: might need to remove
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
socket.on("show waiting room", () => {
  showModal(document.getElementById("waiting-room"));
});
