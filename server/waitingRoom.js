/**
 * TODO:
 * Have a json object that is sent to the client on connection
 */
var socket = io(); // Holds the client socket
var playerInfo;

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
function init() {}

socket.on("in waiting room", playerObj => {
  playerInfo = playerObj;
  console.log("the name of this player is: " + playerInfo.name);
});
