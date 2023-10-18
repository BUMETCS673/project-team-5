import React, { useState, useEffect } from "react";
import { NavbarCustom } from "../Components/Navbar";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useUser } from "../Components/UserContext";
import FormGroup from "react-bootstrap/esm/FormGroup";
import { useNavigate } from "react-router-dom";
function View() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [reservationData, setReservationData] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // click modal is not necessary for reservation
  const [reviews, setReviews] = useState([]); // State for reviews
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // adding similar remove/update modal for reservation
  const [showRemoveReservationModal, setShowRemoveReservationModal] = useState(false);
  const [showUpdateReservationModal, setShowUpdateReservationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { username } = useUser();
  const navigate = useNavigate();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    info: "",
    status: "",
    price: "",
  });
//This is a function that creates a new object to add an item to a user
  const handleAddItem = () => {
    const newEquipment = {
      name: formData.name,
      description: formData.info,
      status: formData.status,
      price: formData.price,
      owner: username,
    };
//This fetch call  makes a POST request to the server's API to add new equipment. 
//Upon a successful response, it logs the data, navigates to a different route, and optionally updates the equipment data.
    fetch("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/addEquipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEquipment),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/View");
        // Optionally, you can update the equipmentData state here
        fetchEquipmentData();
      })
      .catch((error) => console.error("Error:", error));
    setShowAddItemModal(false); // Close the modal after adding the item
    setFormData({
      name: "",
      info: "",
      status: "",
      price: "",
    });
  };
//This function handles the input and handles changes to the input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  // This function initializes a state variable 'updateFormData' using 'useState'
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "",
    price: "",
    owner: "",
  });
  // This function initializes a state variable 'updateReservationData' using 'useState'
  const [updateReservationData, setUpdateReservationData] = useState({
    reservation_id: null,
    start_date: "",
    end_date: "",
    item_id: "",
    user_name: "",
    price: "",
    item_name: ""
  });
//This function Uses the 'useEffect' hook to perform data fetching when 'username' changes
  useEffect(() => {
    fetchEquipmentData();
    fetchReservationData();
    fetchReviewsData();
  }, [username]);
//This function fetches the equipment from the database server
  const fetchEquipmentData = () => {
    fetch("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/getEquipment")
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error("Error:", error));
  };
//This function fetches the reservations from the database server
  const fetchReservationData = () => {
    fetch("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/getReservation")
      .then((response) => response.json())
      .then((data) => setReservationData(data))
      .catch((error) => console.error("Error:", error));
  };
//This function fetches the reviews from the database server
  const fetchReviewsData = () => {
    fetch(`https://gearonthego-52bc9f57a8cd.herokuapp.com/api/getReviews/${username}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error:", error));
  };
//This function is triggered from a click event It prevents event propagation to parent elements (likely to avoid unintended behavior), 
//sets the selected equipment, and shows a modal dialog for confirming the removal of the equipment.
  const handleRemoveClick = (event, equipment) => {
    event.stopPropagation();
    setSelectedItem(equipment);
    setShowRemoveModal(true);
  };

//This function handles the removal and sends a confirmaiton of the removal
  const handleRemoveConfirm = () => {
    if (!selectedItem) {
      console.error("No item selected for removal.");
      return;
    }
    console.log("Selected Item:", selectedItem);
    fetch(`https://gearonthego-52bc9f57a8cd.herokuapp.com/api/removeEquipment/${selectedItem.itemid}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchEquipmentData();
        setShowRemoveModal(false);
        setSelectedItem(null);
      })
      .catch((error) => console.error("Error:", error));
  };
// This function is used to display the users items
  const handleShowAddItemModal = () => {
    setShowAddItemModal(true);
  };
//This function is used to handled closing the screen displaying the item
  const handleCloseAddItemModal = () => {
    setShowAddItemModal(false);
  };
//This function handles any updates made to the item
  const handleUpdateClick = (event, equipment) => {
    event.stopPropagation();
    setSelectedItem(equipment);
    setUpdateFormData({
      id: equipment.itemid,
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      price: equipment.price,
      owner: equipment.owner,
    });
    setShowUpdateModal(true);
  };
// This function is used to make a PUT request to update the equipment data on the database
  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    console.log(updateFormData);
    fetch(`https://gearonthego-52bc9f57a8cd.herokuapp.com/api/updateEquipment/${updateFormData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchEquipmentData();
        setShowUpdateModal(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  // Modal components for cancel/update reservations
  const handleRemoveReservationClick = (event, reservation) => {
    event.stopPropagation();
    setSelectedReservation(reservation);
    setShowRemoveReservationModal(true);
  };

//This function it checks whether a selectedItem is defined. 
//If it's not defined (i.e., no item is selected), it logs an error message to the console and exits the function.

  const handleRemoveReservationConfirm = () => {
    if (!selectedReservation) {
      console.error("No reservation selected for removal.");
      return;
    }
    console.log("Selected Reservation:", selectedReservation);
    fetch(
      // reservation will be removed from the database -> payment will be returned via Payment system (implementation details omitted)
      `https://gearonthego-52bc9f57a8cd.herokuapp.com/api/removeReservation/${selectedReservation.reservation_id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchReservationData();
        setShowRemoveReservationModal(false);
        setSelectedReservation(null);
      })
      .catch((error) => console.error("Error:", error));
  };
//This function is triggered by a click event, and sets the selected reservation, 
//populates the updateReservationData state with reservation details, and shows a modal for updating the reservation.
  const handleUpdateReservationClick = (event, reservation) => {
    event.stopPropagation();
    setSelectedReservation(reservation);
    setUpdateReservationData({
      reservation_id: reservation.reservation_id,
      start_date: reservation.start_date,
      end_date: reservation.end_date,
      item_id: reservation.item_id,
      user_name: reservation.user_name,
      price: reservation.price,
      item_name: reservation.item_name
    });
    setShowUpdateReservationModal(true);
  };
//This function makes a PUT request to update reservation data on the server, 
//logs the response data, fetches updated reservation data, and closes the update modal.
  const handleUpdateReservationSubmit = (event) => {
    event.preventDefault();
    console.log(updateReservationData);
    fetch(
      `https://gearonthego-52bc9f57a8cd.herokuapp.com/api/updateReservation/${updateReservationData.reservation_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateReservationData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchReservationData();
        setShowUpdateReservationModal(false);
      })
      .catch((error) => console.error("Error:", error));
  };
//This function sets the selected equipment and shows a modal for displaying additional information about the equipment.
  const handleCardClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowModal(true);
  };
///This function navigates to the "/AllProfile" route. It's typically used for redirecting the user to a profile-related page or component.
  const handleProfileClick = () => {
    navigate("/AllProfile");
  };
//This function formats the date to display the weekday (short form), numeric day, short month, and numeric year, according to the "en-US" locale
  const dateDisplay = (date) => {
    // normal date format to change GMT to EST is hard to implement 
    // -> fall back to use string method to format
    return date.split(" ").slice(1, 4).join(" ");
  };
//This is the return componant that renders a user interface that shows equipment items and active reservation, which is being filtered based on the user
  return (
    <div>
      <NavbarCustom />
      <Container fluid>
        <Row>
          <Col md={8} className="items-hosted-column">
            <Button
              variant="success"
              type="submit"
              style={{
                fontSize: "20px",
                width: "45%",
                marginRight: "5px",
                marginTop: "15px",
                marginBottom: "25px",
              }}
              id="addButton"
              onClick={handleShowAddItemModal}
            >
              Add Item
            </Button>
            <h2>Equipment Items</h2>
            <Row>
              {equipmentData.map(
                (equipment) =>
                  equipment.owner === username && (
                    <Col key={equipment.id} xs={12} sm={6} md={6} lg={6}>
                      <Card
                        onClick={() => handleCardClick(equipment)}
                        style={{ cursor: "pointer" }}
                      >
                        <Card.Body>
                          <Card.Title>{equipment.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Status: {equipment.status}
                          </Card.Subtitle>
                          <Card.Text>{equipment.description}</Card.Text>
                          <Card.Text>Price: ${equipment.price}</Card.Text>
                          <Card.Text>Owner: {equipment.owner}</Card.Text>
                          <Button
                            variant="danger"
                            name={`remove-${equipment.itemid}`}
                            onClick={(e) => handleRemoveClick(e, equipment)}
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                            }}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="success"
                            name={`update-${equipment.itemid}`}
                            onClick={(e) => handleUpdateClick(e, equipment)}
                            style={{
                              marginLeft: "5px",
                              marginRight: "5px",
                            }}
                          >
                            Update
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
              )}
            </Row>
            <h2>Active Reservations</h2>
            <Row>
              {reservationData.map(
                (reservation) =>
                  reservation.user_name === username && (
                    <Col
                      key={reservation.reservation_id}
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                    >
                      <Card style={{ cursor: "pointer" }}>
                        <Card.Body>
                          <Card.Text>
                            Start Date: {dateDisplay(reservation.start_date)}
                          </Card.Text>
                          <Card.Text>
                            End Date: {dateDisplay(reservation.end_date)}
                          </Card.Text>
                          <Card.Text>
                            Price: {reservation.price}
                          </Card.Text>
                          <Card.Text>
                            Item Name: {reservation.item_name}
                          </Card.Text>
                          <Button
                            variant="danger"
                            name={`remove-${reservation.reservation_id}`}
                            onClick={(e) =>
                              handleRemoveReservationClick(e, reservation)
                            }
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="success"
                            name={`remove-${reservation.reservation_id}`}
                            onClick={(e) =>
                              handleUpdateReservationClick(e, reservation)
                            }
                          >
                            Modify
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
              )}
            </Row>
          </Col>

          <Col md={4} className="reviews-reservations-column">
            <div
              className="d-flex flex-column"
              style={{ alignItems: "flex-start" }}
            >
              <Button
                variant="success"
                onClick={() => handleProfileClick()}
                name="otherProfiles"
                style={{
                  fontSize: "20px",
                  width: "100%",
                  marginRight: "5px",
                  marginTop: "15px",
                  marginBottom: "25px",
                }}
              >
                View other Profiles
              </Button>
            </div>
            <h2>Reviews:</h2>
            {reviews.length === 0 ? (
              <p>This person has no reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <Card key={index} style={{ marginBottom: "10px" }}>
                  <Card.Body>
                    <Card.Title>{review[3]}</Card.Title>
                    <Card.Text>Rating: {review[4]}</Card.Text>
                    <Card.Text>{review[5]}</Card.Text>
                    <Card.Text>By: {review[2]}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>
        </Row>
      </Container>
      {/* Add a section to display reviews */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEquipment?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Status: {selectedEquipment?.status}</p>
          <p>Description: {selectedEquipment?.description}</p>
          <p>Price: ${selectedEquipment?.price}</p>
          <p>Owner: {selectedEquipment?.owner}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            name="close"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRemoveReservationModal} onHide={() => setShowRemoveReservationModal(false)}>
        {/* Cancel reservation confirmation modal */}
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancallation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* need to specify Body as Reservation does not have a name 
          -> otherwise it will throw an error that selectedReservation object can't be a react component */}
          Are you sure you want to cancel {selectedReservation?.Body}?
        </Modal.Body>
        <Modal.Footer>
          <Button name="remove2" variant="danger" onClick={handleRemoveReservationConfirm}>
            Yes
          </Button>
          <Button
            name="cancel"
            variant="secondary"
            onClick={() => setShowRemoveReservationModal(false)}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateReservationModal} onHide={() => setShowUpdateReservationModal(false)}>
        {/* Update reservation modal */}
        <Modal.Header closeButton>
          <Modal.Title>Edit Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateReservationSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={updateReservationData.start_date}
                onChange={(e) =>
                  setUpdateReservationData({
                    ...updateReservationData,
                    start_date: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={updateReservationData.end_date}
                onChange={(e) =>
                  setUpdateReservationData({
                    ...updateReservationData,
                    end_date: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddItemModal}
        id="updateModal"
        onHide={handleCloseAddItemModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="contact-form" onSubmit={handleAddItem}>
            <FormGroup className="contact-page-form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name for Item"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="contact-page-form-group">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Condition of Item"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="contact-page-form-group">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price for object"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="contact-page-form-group">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description of Item"
                name="info"
                value={formData.info}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            type="submit"
            name="submitButtonUpdate"
            style={{
              fontSize: "20px",
              width: "150px",
              marginLeft: "15px",
              marginBottom: "25px",
            }}
            id="submitButtonUpdate"
            onClick={handleAddItem}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        {/* Remove confirmation modal */}
        <Modal.Header closeButton>
          <Modal.Title>Confirm Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove {selectedItem?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button name="remove2" variant="danger" onClick={handleRemoveConfirm}>
            Remove
          </Button>
          <Button
            name="cancel"
            variant="secondary"
            onClick={() => setShowRemoveModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        {/* Update item modal */}
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={updateFormData.name}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={updateFormData.description}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={updateFormData.status}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    status: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={updateFormData.price}
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    price: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button
              variant="success"
              style={{ marginTop: "5px" }}
              type="submit"
            >
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default View;
