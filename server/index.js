var socket = io(); // Holds the client socket
var displayName = "";

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

/**
 * Defintion of init:
 */
function init() {
  // Setting up action handler for the display name form
  var nameForm = document.getElementById("name-form");
  var nameField = document.getElementById("name-field");

  addEvent(
    nameForm,
    "submit",
    event => {
      displayName = nameField.value;
      alert("display name: " + displayName);
      socket.emit("player joined", displayName);
      event.preventDefault(); // preventing from reloading the page fixme: might need to remove
    },
    false
  );
}

socket.on("say hello", message => {
  console.log(message);
});
