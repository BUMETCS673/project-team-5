import React, { useState } from "react";
import { Container, Form, Button, Alert, Col, Row } from "react-bootstrap";

//This function initializes and manages the checkoutForm and retreives reservation data
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/pages/checkout.css";
import NavbarCustom from "../Components/Navbar";
import "../styles/pages/register.css";
function CheckoutForm() {
  const location = useLocation();
  console.log(location.state.reservationDetails);
  // create a variable formData to fetch all contexts passed from the reservation page
  const formData = location.state.reservationDetails;
  const price = location.state.reservationDetails.price;


// This function informs users to fill in the required information before submission
  function youClicked() {
    alert(
      "Please fill in the boxes below.\nIncomplete information will not be submitted."
    );
  }


  const navigate = useNavigate();

// This function allows the user to naviagte to the payment Successful page when called
  const handleSuccessfulPayment = () => {
    fetch("http://127.0.0.1:5000/api/makeReservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
    navigate("/PaymentSuccessful");
  };

//This function is executed when a form is submitted
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid. Submitting...");
      //is_paid = true;
      handleSuccessfulPayment();
    }
  };
// This is the component for the checkout form, it collects payment information details with demographic data
  return (
    <div>
      <NavbarCustom />
      <Container className="checkout-form-container">
        <Row>
          <Col md={3} className="items-hosted-column">
            <h1>Checkout</h1>
            <div>
        <p>Price: $ {price}</p>
        </div>
          </Col>
          <Col md={2} className="items-hosted-column">
            <input
              type="submit"
              style={{ marginTop: "10%" }}
              id="clickme"
              value="Help"
              onClick={youClicked}
            />
          </Col>
        </Row>
        <hr />
        <Form
          name="Payment Details"
          method="post"
          action=""
          noValidate
          onSubmit={handleFormSubmit}
        >
          <Form.Group>
            <Form.Label>Full Name as it appears on your Card:</Form.Label>
            <Form.Control type="text" name="textName" id="fullName" required />
          </Form.Group>

          <Form.Label>Enter your Billing Address:</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="textName"
                id="streetAddress"
                placeholder="Street Address"
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="textName"
                id="unitNo"
                placeholder="House/Unit/Apartment No"
                required
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Control
                type="text"
                name="textName"
                id="state"
                placeholder="State (e.g., MA)"
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                name="textName"
                id="zipCode"
                placeholder="Zip Code"
                required
              />
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Card Number:</Form.Label>
            <Form.Control
              type="text"
              name="textName"
              id="cardNumber"
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Valid Through (MM/YY):</Form.Label>
                <Form.Control
                  type="text"
                  name="textName"
                  id="validThru"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>CVC:</Form.Label>
                <Form.Control type="text" name="textName" id="cvc" required />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>
              Please write your experience here: (required)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              cols={50}
              name="taComments"
              id="message"
              required
            />
          </Form.Group>

          <Button variant="success" className="FormButton" type="submit">
            Pay
          </Button>
        </Form>
      </Container>
    </div>
  );
}

//This function is used to make validaitons on the form to avoid information being entered that will prevent any mistakes from being passed into the database
function validateForm() {
  var fullName = document.getElementById("fullName");
  if (fullName.value.length < 2) {
    alert("Error: Full Name should be at least two characters");
    fullName.focus();
    return false;
  }

  var streetAddress = document.getElementById("streetAddress");
  if (streetAddress.value.length < 2) {
    alert("Error: Street Address should be at least 2 characters");
    streetAddress.focus();
    return false;
  }

  var state = document.getElementById("state");
  if (state.value.length !== 2) {
    alert("Error: State should be only 2 characters, e.g: MA");
    state.focus();
    return false;
  }

  var zipCode = document.getElementById("zipCode");
  if (zipCode.value.length < 4) {
    alert("Error: Zip Code should be at least 4 characters");
    zipCode.focus();
    return false;
  }

  var cvc = document.getElementById("cvc");
  if (cvc.value.length !== 3) {
    alert("Error: The CVC number should be of 3 digits");
    cvc.focus();
    return false;
  }

  var monthValid = document.getElementById("validThru");
  var monthValue = monthValid.value.trim();

  var validPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;

  if (!validPattern.test(monthValue)) {
    alert(
      "Error: Please enter your Credit Card's 'valid thru' information in the form MM/YY. e.g: 12/23"
    );
    monthValid.focus();
    return false;
  }

  var [validMonth, validYear] = monthValue.split("/");


var currentDate = new Date();


var currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to get the correct month (0-indexed)
var currentYear = String(currentDate.getFullYear()).slice(2);

validMonth = parseInt(validMonth, 10);
validYear = parseInt(validYear, 10);


currentMonth = parseInt(currentMonth, 10);
currentYear = parseInt(currentYear, 10);

if (validYear < currentYear || (validYear === currentYear && validMonth < currentMonth)) {
    alert("Sorry: The card you are using has expired. Please use a card that has a minimum expiry of " + currentMonth + "/" + currentYear);
    monthValid.focus();
    return false;
}

var cvc = document.getElementById("cvc");
var cvcinput = cvc.value.trim(); 


var cvcValid = /^\d{3}$/;

if (!cvcValid.test(cvcinput)) {
    alert("Sorry: Invalid CVC. Please enter exactly 3 digits.");
    cvc.focus();
    return false;
}

  var message = document.getElementById("message");
  if (message.value.length < 30) {
    alert(
      "Error: Please enter a message of at least 30 characters before you submit"
    );
    message.focus();
    return false;
  }

  var cardNumberElement = document.getElementById("cardNumber");
  var cardNumber = cardNumberElement.value;

  if (cardNumber.length < 12 || cardNumber.length > 16) {
    alert("Error: Card Number should be of 12 to 16 digits");
    cardNumberElement.focus();
    return false;
  } else {
    const cardDigits = cardNumber.split("").map(Number);
    cardDigits.reverse();

    for (let i = 1; i < cardDigits.length; i += 2) {
      cardDigits[i] *= 2;

      if (cardDigits[i] >= 10) {
        cardDigits[i] -= 9;
      }
    }

    const valid = cardDigits.reduce((acc, val) => acc + val, 0);

    if (valid % 10 === 0) {
      alert("Card number is valid");
      return true;
    } else {
      alert("Invalid card number");
      return false;
    }
  }
}

export default CheckoutForm;
