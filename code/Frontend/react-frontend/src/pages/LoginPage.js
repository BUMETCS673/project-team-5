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
  const [showErrorModal, setShowErrorModal] = useState(false);

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

//This Function is used to set the submitMsg state, which displays a message to the user during the login process.
  const handleSubmitMessageChange = (message) => {
    setSubmitMsg(message);
  };

  //This function toggles the visibility of the password input field.
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

//This function handles the form submission when the login button is clicked.

  const showError = () => {
    setShowErrorModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/login", formData)
      .then((response) => {
        if (response.status === 201) {
          const user = response.data;
          const username = user.username;
          setUsername(username);
          console.log("Logged in", username);

          navigate("/");
        } else if (response.status === 202) {
          console.log("Wrong Password");
          console.log(response.data);
          showError();
        } else if (response.status === 203) {
          console.log("Wrong User");
          console.log(response.data);
          showError();
        }
      })
      .catch((error) => {
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

        <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Incorrect username/password combination. Please try again.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowErrorModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default LoginPage;
