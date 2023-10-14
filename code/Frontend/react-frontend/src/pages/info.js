import React from "react";
import AboutUs from "../Components/AboutUs";
import { NavbarCustom } from "../Components/Navbar";
//This component calls the AboutUs component to render on the screen
function Info() {
  return (
    <div className="info">
      <NavbarCustom />
      <AboutUs />
    </div>
  );
}

export default Info;
