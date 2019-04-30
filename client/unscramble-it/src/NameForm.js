import React, { PropTypes, Component } from "react";
import { withRouter } from "react-router-dom";

/**
 * NameForm component: renders text box that allows
 * user to enter a display name
 */
class NameForm extends Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = { value: "" }; // Intializing display name to be empty

    // Binding hte event handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Updating the text box when a change is made
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // Capturing the entered name
  handleSubmit(event) {
    alert("user name typed in was: " + this.state.value);
    event.preventDefault();

    this.props.history.push("/GamePage");
  }

  // Render the component
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Your Display Name"
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default withRouter(NameForm); // Exporting component
