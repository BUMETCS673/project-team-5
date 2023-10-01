import React, { useState } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Form from "react-bootstrap/esm/Form";
import FormGroup from "react-bootstrap/esm/FormGroup";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../Components/UserContext";
// Google import start
import GoogleLoginButton from "../Components/GoogleLoginButton";
// Google import stop

function LoginPage() {
  const [submitMsg, setSubmitMsg] = useState("");
  const { setUsername } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitMessageChange = (message) => {
    setSubmitMsg(message)
  }

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://127.0.0.1:5000/api/login", formData)
      .then((response) => {
        if (response.status === 201) {
          setSubmitMsg("Login successful!");
          const user = response.data;
          const username = user.username;
          setUsername(username.split("@")[0]);
          console.log("Logged in", username);
          navigate("/");
        } else {
          setSubmitMsg("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitMsg("Login failed. Please try again.");
      });
  };

  return (
    <div>
      <NavbarCustom />
      <h1>Log In</h1>
      <div className="form" id="formDiv">
        <Form className="contact-form" onSubmit={handleSubmit}>
          <FormGroup className="contact-page-form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="contact-page-form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <Button
            variant="primary"
            type="submit"
            style={{
              fontSize: "20px",
              width: "150px",
              marginLeft: "15px",
              marginBottom: "25px",
            }}
            id="submitButton"
          >
            Submit
          </Button>
        </Form>
        <GoogleLoginButton redirectOnLogin={true} handleMessage={handleSubmitMessageChange}></GoogleLoginButton>
        {submitMsg && <div style={{ fontSize: "35px" }}>{submitMsg}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
