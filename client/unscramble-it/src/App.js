import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./Header";
import { NameForm } from "./NameForm";

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
