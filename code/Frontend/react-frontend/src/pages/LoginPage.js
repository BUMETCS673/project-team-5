import React, { useState } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import { useUser } from "../Components/UserContext";
// Google import start
import GoogleLoginButton from "../Components/GoogleLoginButton";
// Google import stop
import "../styles/pages/password.css";
import "../styles/pages/register.css";

//This function is used to manager the user login process and initializes state for a submission message
function LoginPage() {
  const { setUsername, setUserType } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  //This function handles changes in the email and password input fields.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //This function toggles the visibility of the password input field.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/login", formData)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          const user = response.data;
          const username = user.username;
          setUsername(username);
          console.log("Logged in", username);

          navigate("/");
        } else if (response.status === 202) {
          window.alert("Wrong Password!");
        } else if (response.status === 203) {
          window.alert("Wrong User");
        } else {
          window.alert("Failed to login");
        }
      })
      .catch((error) => {
        window.alert("Failed to login");
        console.error("Error:", error);
      });
    setFormData({
      email: "",
      password: "",
    });
  };
  //This component is used to render the login page for the user to log into their account
  return (
    <div>
      <NavbarCustom />
      <div className="form" id="formDiv">
        <Form className="reservation-form" onSubmit={handleSubmit}>
          <h3 style={{ marginLeft: "30%", marginBottom: "10%" }}>
            Welcome Back!
          </h3>
          <FormGroup className="contact-page-form-group">
            <Form.Control
              type="email"
              id="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="contact-page-form-group">
            <div className="password-input-container">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <span
                className={`password-toggle ${showPassword ? "visible" : ""}`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
          </FormGroup>
          <Button
            className="FormButton" // Apply Bootstrap class for button width
            variant="success"
            type="submit"
            id="submitButton"
          >
            Log in
          </Button>
          <GoogleLoginButton
            redirectOnLogin={true}
            handleMessage={() => {}}
            setUserEmail={() => {}}
          ></GoogleLoginButton>
          {/* Add a link inside the form */}
          <p className="dont-have-account">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
