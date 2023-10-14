import React from "react";
import { FormGroup } from "react-bootstrap";
import { NavbarCustom } from "../Components/Navbar.js";
import Form from "react-bootstrap/esm/Form.js";
import Button from "react-bootstrap/esm/Button.js";
import "../styles/pages/contact.css";
import "../styles/pages/home.css";

//This function is a functional component responsible for rendering a contact form and managing user input and submission status. 
export default function Contact() {
  let [firstName, setFirst] = React.useState("");
  let [lastName, setLast] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [subject, setSubject] = React.useState("");
  let [msg, setMsg] = React.useState("");
  let [submitMsg, setSubmitMsg] = React.useState("");

  //This function handles the form submission. When the user submits the form
  const submit = (e) => {
    e.preventDefault();
    setSubmitMsg("Loading...");
    setTimeout(
      () =>
        setSubmitMsg(
          "That worked! We will be in contact with you soon! Have a magical day!"
        ),
      3000
    );
    setFirst("");
    setLast("");
    setEmail("");
    setSubject("");
    setMsg("");
  };

  //This component  is rendering a contact form within a web page, styled with Bootstrap, allowing users to enter their first name, last name, email, subject, and message. 
  return (
    <>
      <NavbarCustom />
      <div
        className="text-center"
        style={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <div
          className="home-page"
          style={{ height: "1000px", width: "5000px" }}
        >
          <div
            className="hours text-dark"
            style={{
              fontFamily: "blackPearl",
              textAlign: "center",
              position: "relative",
              marginTop: "15px",
              width: "auto",
              height: "900px",
            }}
          >
            <h1>Contact Us</h1>
            <div className="form" id="formDiv">
              <Form className="contact-form" onSubmit={submit}>
                <FormGroup className="contact-page-form-group">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirst(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="contact-page-form-group">
                  <Form.Label className="form-label">Last Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLast(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="contact-page-form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </FormGroup>

                <FormGroup className="contact-page-form-group">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="subject"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="contact-page-form-group">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    type="msg"
                    placeholder="Enter message"
                    as="textarea"
                    rows={5}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
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
              {submitMsg && <div style={{ fontSize: "35px" }}>{submitMsg}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
