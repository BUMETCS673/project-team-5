import React, { useState } from "react";
import { Link } from "react-router-dom";


//This function is the display that takes palce when the payment becomes succsseful

import NavbarCustom from "../Components/Navbar";

function PaymentSuccessful() {
  const marginStyle = {
    marginLeft: "20px",
  };

  return (
    <div>
      <NavbarCustom />
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <h2 style={marginStyle}>Payment Successfully Processed</h2>
        <br />
        <br />
        <h3 style={marginStyle}>Thank you for renting with GearOnTheGo!</h3>
        <h3 style={marginStyle}>
          A copy of your purchase has been sent to your email
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <h5 style={marginStyle}>
          Have any questions? Feel free to{" "}
          <Link to="/contact">Contact Us!</Link>
        </h5>
      </div>
    </div>
  );
}

export default PaymentSuccessful;
