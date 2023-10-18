import React from "react";
import "../styles/Components/aboutus.css";
// About us page that lives on the NAVBAR and renders when opened
function AboutUs() {
  return (
    <div className="containerAbout">
      <img
        className="logo"
        src={require("../Media/GearOnTheGo.png")}
        alt="Gear On The Go"
      />
      <br />
      <h2>Step into a world of adventure with Gear On the Go! </h2>
      <p>
        Hey there, thrill-seekers, outdoor enthusiasts and gear heads! Get ready
        to embark on a game-changing journey with our cutting-edge web
        application. Picture this: a dynamic team formed as part of Boston
        University's Software Engineering class, driven by the mission to
        revolutionize following our passion wherever we are!
      </p>
      <br />
      <p>
        Introducing Gear On The Go—an ingenious platform connecting owners of
        top-notch recreational gear, from sleek paddleboards to rugged hiking
        equipment, and even high-performance bikes! Imagine having the freedom
        to pursue your passions without the hassle of ownership. Whether you're
        a casual explorer or a globe-trotting adventurer, we've got you covered.
      </p>
      <br />
      <p>
        Why buy when you can experience the best without the commitment? Our
        platform brings together equipment owners looking to share their
        treasures during downtime. And for those on the move or seeking an
        adrenaline rush, Gear on the Go unlocks access to top-tier gear, right when
        you need it.
      </p>
      <br />
      <p>
        Seize this golden opportunity to turn your unused equipment into a
        thriving business, or dive headfirst into a world of endless
        possibilities as a renter. Gear On The Go is not just an application;
        it's a lifestyle, an experience, a chance to embrace the great outdoors
        like never before!
      </p>
      <br />
      <p>Gear up for a revolution—Gear up for Gear On The Go! 🚀🔥</p>
      <br />
      <h2>Meet Our Team! </h2>
      <div className="team-images">
        <div className="image-container">
          <img
            className="samantha"
            src={require("../Media/TeamLeader.jpg")}
            alt="Samantha"
          />
          <div className="overlay">
            <div className="text">
              Meet our Team Leader Samantha! Fun Fact: Samantha has a twin
              sister! Double the trouble, double the brilliance!🌟👯‍♀️
            </div>
          </div>
        </div>
        <br />
        <div className="image-container">
          <img
            className="ahnaf"
            src={require("../Media/SecurityLeader.jpg")}
            alt="Ahnaf"
          />
          <div className="overlay">
            <div className="text">
              Meet our Security Leader Ahnaf! Fun Fact: Ahnaf finds solace in
              leisurely drives, using them as a means to unwind and release
              stress!🚗
            </div>
          </div>
        </div>
        <br />
        <div className="image-container">
          <img
            className="laz"
            src={require("../Media/QALeader.png")}
            alt="Laz"
          />
          <div className="overlay">
            <div className="text">
              Meet our Quality Assurance Leader Lazaro! Fun Fact: Laz is out
              there, training like a powerhouse for powerlifting!💪
            </div>
          </div>
        </div>
        <br />
        <div className="image-container">
          <img
            className="saahil"
            src={require("../Media/RequirementLeader.jpeg")}
            alt="Saahil"
          />
          <div className="overlay">
            <div className="text">
              Meet our Requirements Leader Saahil! Fun Fact: "Saahil knows how
              to play the piano, but looking at keys confuses him, so he tries
              to distract himself by glancing anywhere but at the black and
              white ivories!" 🎹😄{" "}
            </div>
          </div>
        </div>
        <br />
        <div className="image-container">
          <img
            className="shajee"
            src={require("../Media/ConfigurationLeader.png")}
            alt="Shajee"
          />
          <div className="overlay">
            <div className="text">
              Meet our Configuration Leader Shajee! Fun Fact: Our Configuration
              leader is a rockstart behind the scenes. You can often see him
              singing and strumming his guitar!🎸🎤🎶
            </div>
          </div>
        </div>
        <br />
        <div className="image-container">
          <img
            className="jay"
            src={require("../Media/ANDLeader.jpg")}
            alt="Jian"
          />
          <div className="overlay">
            <div className="text">
              Meet our Architecture and Design Leader Jay! Fun Fact: Horseback
              riding may be the most calm outdoor experience for Jay!🐎
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
