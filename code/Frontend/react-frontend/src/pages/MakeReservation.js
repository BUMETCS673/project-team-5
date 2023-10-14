import React, { useState } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { useUser } from "../Components/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/pages/reservations.css";

//This function is used to render a reservation form, it retrieves the selected items information, and user data from the components props, and manages the form data
function ReservationForm() {
  const location = useLocation();
  let [submitMsg, setSubmitMsg] = React.useState("");
  const { username } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    item_id: location.state.selectedItem.itemid,
    user_name: username,
  });

  const selectedItem = location.state.selectedItem;

//This function is triggered when an input fields value changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

//This function is called when the Checkout button is clicked, it navigates to the checkout page and passed the reservation details and selected item data as state
  const handleCheckoutClick = () => {
    navigate("/Checkout", {
      state: { reservationDetails: formData, selectedItem },
    });
  };

//This function handles the form submission when the Make Reservation button is clicked. IT performs date validation, and sends a post to the backend using the feth API
  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the formData as JSON to your Flask back-end here
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
    setSubmitMsg("Loading...");
    if (formData.end_date != null && formData.end_date < formData.start_date) {
      setSubmitMsg("End date must be after the start date!");
    } else if (new Date(formData.start_date) < new Date()) {
      setSubmitMsg("start date must be after today!");
    } else {
      setTimeout(() => setSubmitMsg("Your reservation has been made!"), 3000);
      setFormData({
        start_date: "",
        end_date: "",
        item_id: location.state.selectedItem.itemid,
        user_name: username,
      });
    }
  };
//This component provides a user interface for reserving an item, displaying item details, date inputs, and a checkout button, and handles the submission and confirmation of the reservaiton
  return (
    <div>
      <NavbarCustom />
      <div className="form" id="formDiv">
        <Form className="reservation-form" onSubmit={handleSubmit}>
          <h3>Reservation Details</h3>
          <FormGroup className="reservation-page-form-group">
            <label>Item Name</label>
            <p>{selectedItem.name}</p>
          </FormGroup>
          <FormGroup className="reservation-page-form-group">
            <label>Item Description</label>
            <p>{selectedItem.description}</p>
          </FormGroup>
          <FormGroup className="reservation-page-form-group">
            <label>Rental Start Date</label>
            <Form.Control
              type="date"
              placeholder="Enter Date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="reservation-page-form-group">
            <label>Rental End Date</label>
            <Form.Control
              type="date"
              placeholder="Enter Date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <Button
            variant="primary"
            type="submit"
            onClick={handleCheckoutClick}
            style={{
              fontSize: "20px",
              width: "150px",
              marginLeft: "35%",
              marginBottom: "25px",
            }}
            id="submitButton"
          >
            Checkout
          </Button>
        </Form>
        {submitMsg && <div style={{ fontSize: "35px" }}>{submitMsg}</div>}
      </div>
    </div>
  );
}

export default ReservationForm;
