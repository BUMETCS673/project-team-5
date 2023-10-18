import React, { useState } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import { Modal, Button } from "react-bootstrap";
import "../styles/pages/password.css";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/register.css";
import "../styles/Components/popup.css";
import GoogleLoginButton from "../Components/GoogleLoginButton";
// Google import stop
import axios from "axios";
import { useUser } from "../Components/UserContext";

//This funtion manages various states for form data, user type, form validation errors, and whether to show or hide a password.
function RegisterPage() {
  const { setUsername } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    user_type: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [buttonPopup, setButtonPopup] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const showPopup = () => {
    setButtonPopup(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //This function is used to toggle the visibility of a password.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            console.log("registration failed");
            window.alert(
              "Failed to Register:\nCheck Email is valid\nPassword is between 8 and 20 characters long"
            );
            console.log(response);
          });
        } else {
          return response.json().then((data) => {
            console.log(data);
            // Automatically log in the user after registration
            const loginData = {
              email: formData.email, // Use the email from the registration form
              password: formData.password, // Use the password from the registration form
            };

            // Perform a login request
            axios
              .post("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/login", loginData)
              .then((loginResponse) => {
                if (loginResponse.status === 201) {
                  // Successful login
                  const user = loginResponse.data;
                  const username = user.username;
                  setUsername(username);
                  console.log("Logged in", username);

                  // Redirect to the home page or any other desired location
                  navigate("/");
                } else {
                  // Handle l
                  window.alert("Failed to Register");
                  console.log("Login failed:", loginResponse.data);
                }
              })
              .catch((loginError) => {
                // Handle login request errors
                window.alert("Failed to Register");
                console.error("Error:", loginError);
              });
            setFormData({
              email: "",
              password: "",
            });
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //This component is rendering a registration form for both native username and password login, and google login authentication
  return (
    <div>
      <NavbarCustom />
      <div className="form" id="formDiv">
        <Form className="reservation-form" onSubmit={handleSubmit}>
          <h3 style={{ marginLeft: "35%", marginBottom: "10%" }}>Welcome!</h3>
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
            className="FormButton"
            variant="success"
            type="submit"
            id="submitButton"
          >
            Register
          </Button>
          <GoogleLoginButton
            redirectOnLogin={false}
            handleMessage={() => {}}
            setUserEmail={(email) => {
              setUserEmail(email);
            }}
            showPopup={showPopup}
          />

          <p className="dont-have-account">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
export default RegisterPage;
