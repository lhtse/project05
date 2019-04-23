import React, { Component } from "react";
import io from "socket.io-client";
// Add css styling here

var socket;
class Header extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "http://localhost:3000"
    };

    socket = io(this.state.endpoint);
  }

  render() {
    return (
      <header>
        <h1>Unscramble it!</h1>
      </header>
    );
  }
}

export { Header, socket };
