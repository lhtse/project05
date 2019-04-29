import React, { Component } from "react";
import io from "socket.io-client";
// Add css styling here

var socket; // Holds the reference to the socket

/**
 * Header -- creates the io socket to connect to the server
 */
class Header extends Component {
  // Constructor -- creates the component
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "http://localhost:3000"
    };

    socket = io(this.state.endpoint);
  }

  // Renders the component
  render() {
    return (
      <header>
        <h1>Unscramble it!</h1>
      </header>
    );
  }
}

// Export the Header and the socket
export { Header, socket };
