import React, { Component } from "react";
import Nav from "../components/Nav";
import {FormBtn, Email, Password, SmallButton } from "../components/Form";
import { Col, Row, Container } from "../components/Grid";

import API from "../utils/API";
const uuidv4 = require("uuid/v4");

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    uuid: uuidv4(),
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.email && this.state.password) {
      API.signupUser({
        email: this.state.email,
        password: this.state.password,
        uuid: this.state.uuid,
      })
        .then(res => {
          if(res.data) {
            window.location.replace("/dashboard/" + res.data.uuid);
            console.log(res);
          } else {
            console.log("Sign-up error")
          }
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Nav />
        <Row>

          <Col size="md-4"/>
          <Col size="md-4">
            <form >
              <Email
                value={this.state.title}
                onChange={this.handleInputChange}
                name="email"
                />
              <Password
                value={this.state.title}
                onChange={this.handleInputChange}
                name="password"
                />
              <SmallButton
                disabled={!(this.state.email && this.state.password)}
                onClick={this.handleFormSubmit}
                >
                Create Account
              </SmallButton>
            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;
