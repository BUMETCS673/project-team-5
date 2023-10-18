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
  const { username } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    // item_id, price are contexts passed from items; user_name is a global user context
    item_id: location.state.selectedItem.itemid,
    user_name: username,
    price: location.state.selectedItem.price,
    item_name: location.state.selectedItem.name,
  });

  const selectedItem = location.state.selectedItem;

  //This function is triggered when an input fields value changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //This function handles the form submission when the Make Reservation button is clicked. IT performs date validation, and sends a post to the backend using the feth API
  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the formData as JSON to your Flask back-end here
    if (formData.end_date != null && formData.end_date < formData.start_date) {
      // enforce end user enter valid inputs: that rental end date can't be before start date
      window.alert("End date must be after the start date!");
    } else if (new Date(formData.start_date) < new Date()) {
      // also rental start date can't be in the past
      window.alert("Start date must be after today!");
    } else if (formData.end_date == "" || formData.start_date == "") {
      window.alert("Please enter a date!");
    } else {
      navigate("/Checkout", {
        state: { reservationDetails: formData, selectedItem },
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
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}

export default ReservationForm;
