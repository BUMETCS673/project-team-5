import React, { useState } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../Components/UserContext";
// Google import start
import GoogleLoginButton from "../Components/GoogleLoginButton";
// Google import stop
import "../styles/pages/password.css";
import "../styles/pages/register.css";

//This function is used to manager the user login process and initializes state for a submission message
function LoginPage() {
  const [submitMsg, setSubmitMsg] = useState("");
  const { setUsername, setUserType } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
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
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    setSubmitMsg("Logging in...");
    axios
      .post("http://127.0.0.1:5000/api/login", formData)
      .then((response) => {
        if (response.status === 201) {
          // Going here when email right and password right
          setSubmitMsg("Login successful!");
          const user = response.data;
          const username = user.username;
          const userType = user.user_type;
          setUsername(username);
          setUserType(userType);
          console.log("Logged in", username, "as", userType);

          // ***Will remove types other than general***
          if (userType === "general") {
            navigate("/"); // Redirect to the home page
          } else {
            // Handle other user types or scenarios
            console.log("Unknown user type");
          }
        } else if (response.status === 202) {
          // Going here when password wrong but email right
          setErrors(response.data || {});
          console.log("Wrong Password");
          console.log(response.data);
          setSubmitMsg("Login failed. Please try again!");
        } else if (response.status === 203) {
          // Going here when user wrong
          setErrors(response.data || {});
          console.log("Wrong User");
          console.log(response.data);
          setSubmitMsg("Login failed. Please try again!");
        }
      })
      .catch((error) => {
        // Going here when email and/or password format wrong
        setErrors(error.response.data.errors || {});
        console.log(errors);
        console.error("Error:", error);
        setSubmitMsg("Login failed. Please try again.");
      });
  };
//This component is used to render the login page for the user to log into their account
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
              id="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="contact-page-form-group">
            <Form.Label>Password</Form.Label>
            <div className="password-input-container">
              <Form.Control
                type={showPassword ? "text" : "password"} // Toggle password visibility
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
          <div className="FormButtonDiv">
            <Button
              className="FormButton"
              variant="primary"
              type="submit"
              id="submitButton"
            >
              Submit
            </Button>
            <div className="error-messages" id="error_messages">
              {errors.email && <p>{errors.email.join(", ")}</p>}
              {errors.password && <p>{errors.password.join(", ")}</p>}
              {errors.message && <p>{errors.message}</p>}
            </div>
          </div>
        </Form>
        <GoogleLoginButton
          redirectOnLogin={true}
          handleMessage={handleSubmitMessageChange}
          setUserEmail={() => {}}
        ></GoogleLoginButton>
        {submitMsg && <div style={{ fontSize: "35px" }}>{submitMsg}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
