import React, { Component } from "react";
import Nav from "../components/Nav";

import {FormBtn, Email, Password } from "../components/Form";
import { Col, Row, Container } from "../components/Grid";

import API from "../utils/API";

class Login extends Component {
  state = {
    email: "",
    password: "",
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
      console.log("Login state = " + this.state.password)
      API.loginUser({
        email: this.state.email,
        password: this.state.password
      })
        .then(res => {
          window.location.replace("/dashboard/" + res.data.uuid);
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
              <FormBtn
                disabled={!(this.state.email && this.state.password)}
                onClick={this.handleFormSubmit}
                >
                Create Account
              </FormBtn>
            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
