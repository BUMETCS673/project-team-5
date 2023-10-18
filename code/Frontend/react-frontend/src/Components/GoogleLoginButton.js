import React, { useState } from "react";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Modal, Button } from "react-bootstrap";
// Google import start
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import "../styles/pages/register.css";
// Google import stop

export function GoogleLoginButton(props) {
  const navigate = useNavigate();
  const { setUsername } = useUser();
  const [showUnregisteredModal, setShowUnregisteredModal] = useState(false);
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  // Failure handling for google login start
  const handleFailure = (result) => {
    alert(JSON.stringify.result);
  };
  // Failure handling for google login stop
  // Login handling for google login start
  const handleLogin = async (googleData) => {
    var url = "https://gearonthego-52bc9f57a8cd.herokuapp.com/api/register-google";
    if (props.redirectOnLogin) url = "https://gearonthego-52bc9f57a8cd.herokuapp.com/api/login-google";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        googleData: googleData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
//This coniditoning is handling a  login process and handles responses from a Google login attempt.
    if (res.ok && data && data.name && data.email) {
      const username = data.email;
      props.handleMessage(username);
      console.log("Logged in", username);

      setUsername(username);
      localStorage.setItem("loginData", JSON.stringify(data));
    }
    if (res.status === 404) {
      // If the user is unregistered, show the unregistered user modal
      setShowUnregisteredModal(true);
    } else {
      props.handleMessage("Google login failed. Please register.");
    }

    if (res.ok && (props.redirectOnLogin || !data.isNew)) navigate("/");
  };
  //This is a react component that renders a Google login button and a modal to handle unregistered users.
  return (
    <div className="App">
      <div className="GoogleLoginDiv">
        <div className="GoogleLogin">
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            id={"google-login-auth"}
          >
            <GoogleLogin
              id="google-login-button"
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Sign up with Google"
              onSuccess={handleLogin}
              onFailure={handleFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          </GoogleOAuthProvider>
        </div>
      </div>
      <Modal
        show={showUnregisteredModal}
        onHide={() => setShowUnregisteredModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Unregistered User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are not registered. Please register before logging in.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnregisteredModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GoogleLoginButton;
