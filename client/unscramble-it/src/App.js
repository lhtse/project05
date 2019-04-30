import React from "react";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import "./App.css";
import { Header } from "./Header";
import NameForm from "./NameForm";
// import * as io from "socket.io-client";

// const socket = io();

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route
          exact={true}
          path="/"
          render={() => (
            <div className="App">
              <Header />
              <NameForm />
            </div>
          )}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
