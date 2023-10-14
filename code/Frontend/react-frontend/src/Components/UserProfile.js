import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavbarCustom } from "./Navbar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUser } from "./UserContext";
import FormGroup from "react-bootstrap/esm/FormGroup";
//This function is designed to handle user profiles, display equipment, and reviews. It uses various states to manage data and control the visibility of modals.
function UserProfile() {
  const { usernameSelected } = useParams();
  const { username } = useUser();
  const [equipmentData, setEquipmentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [formReviewData, setFormReviewData] = useState({
    title: "",
    description: "",
    rating: "",
  });

  // This useEffect is used When the 'usernameSelected' dependency changes, fetch equipment and reviews data.
  useEffect(() => {
    fetchEquipmentData();
    fetchReviewsData();
  }, [usernameSelected]);

  // This function is used to Fetch equipment data from the server based on 'usernameSelected'.
  const fetchEquipmentData = () => {
    fetch(`http://127.0.0.1:5000/api/items/${usernameSelected}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched equipment data:", data); // Debug statement
        setEquipmentData(data);
      })
      .catch((error) => console.error("Error:", error));
  };
  // This function is used to fetch reviews data from the server based on 'usernameSelected'.
  const fetchReviewsData = () => {
    fetch(`http://127.0.0.1:5000/api/getReviews/${usernameSelected}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  //This function handles changes in input fields and update the form review data.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormReviewData({ ...formReviewData, [name]: value });
  };
  //This function handles the submission of a review form.
  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const newReview = {
      title: formReviewData.title,
      description: formReviewData.description,
      rating: parseInt(formReviewData.rating), // Convert to an integer
      source: username,
      target: usernameSelected,
    };
    // This fetch sends a POST request to add the review to the server.
    fetch("http://127.0.0.1:5000/api/addReviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Review added successfully") {
          // Review was added successfully, fetch reviews data to update the UI
          fetchReviewsData();
        } else {
          // Handle other responses or errors as needed
        }
      })
      .catch((error) => console.error("Error:", error));

    setShowReviewModal(false);
    setFormReviewData({
      title: "",
      description: "",
      rating: "",
    });
  };
  const handleProfileClick = () => {
    navigate("/AllProfile");
  };
  console.log("selected" + usernameSelected);
  console.log("current" + username);
  if (username === usernameSelected) {
    navigate("/View");
  }

  const handleReserveClick = () => {
    console.log(selectedItem);
    navigate("/reservations", { state: { selectedItem: selectedItem } });
  };

  // The return represents a user profile page that displays equipment hosted by a selected user,
  // user reviews, and provides the ability to write reviews for the displayed equipment.
  return (
    <div>
      <NavbarCustom />
      <div
        style={{
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <Row>
          <Col md={8}>
            <h2
              style={{
                marginLeft: "15px",
                marginTop: "20px",
              }}
            >
              {usernameSelected}
            </h2>
          </Col>
          <Col md={4} className="text-right">
            <Button
              variant="secondary"
              onClick={() => handleProfileClick()}
              style={{
                fontSize: "20px",
                width: "100%",
                marginRight: "10px",
                marginTop: "15px",
                marginBottom: "25px",
              }}
            >
              View other Profiles
            </Button>
          </Col>
        </Row>
        <Container fluid>
          <Row>
            <Col md={8} className="items-hosted-column">
              <h3>Available Items</h3>
              <Row>
                {equipmentData &&
                equipmentData.items &&
                equipmentData.items.length > 0 ? (
                  equipmentData.items
                    .filter(
                      (item) =>
                        item.owner === usernameSelected && item.available
                    )
                    .map((item) => (
                      <Col key={item.id} className="col-md-4 col-12">
                        <Card
                          className="custom-card"
                          onClick={() => handleCardClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Status: {item.status}
                            </Card.Subtitle>
                            <Card.Text>{item.description}</Card.Text>
                            <Card.Text>Price: ${item.price}</Card.Text>
                            <Card.Text>Owner: {item.owner}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                ) : (
                  <p>
                    {usernameSelected} has no available equipment items hosted.
                  </p>
                )}
              </Row>

              <h3>Unavailable Items</h3>
              <Row>
                {equipmentData &&
                equipmentData.items &&
                equipmentData.items.length > 0 ? (
                  equipmentData.items
                    .filter(
                      (item) =>
                        item.owner === usernameSelected && !item.available
                    )
                    .map((item) => (
                      <Col key={item.id} className="col-md-4 col-12">
                        <Card
                          className="custom-card"
                          onClick={() => handleCardClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Status: {item.status}
                            </Card.Subtitle>
                            <Card.Text>{item.description}</Card.Text>
                            <Card.Text>Price: ${item.price}</Card.Text>
                            <Card.Text>Owner: {item.owner}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                ) : (
                  <p>
                    {usernameSelected} has no unavailable equipment items
                    hosted.
                  </p>
                )}
              </Row>
            </Col>
            <Col md={4} className="reviews-reservations-column">
              <Row>
                <Col md={6}>
                  <h3>Reviews</h3>
                </Col>
                <Col md={6} className="text-right">
                  <Button
                    style={{ width: "100%" }}
                    variant="success"
                    name="review"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Write Review
                  </Button>
                </Col>
              </Row>
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
        {/* Modal for displaying details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Status: {selectedItem?.available ? "Available" : "Unavailable"}
            </p>
            <p>Description: {selectedItem?.description}</p>
            <p>Price: {selectedItem?.price}</p>
            <p>Owner: {selectedItem?.owner}</p>
          </Modal.Body>
          <Modal.Footer>
            {selectedItem?.available && (
              <Button variant="success" onClick={handleReserveClick}>
                Reserve
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Add a "Write Review" Button */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Write a Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleReviewSubmit}>
              <FormGroup className="contact-page-form-group">
                <Form.Label className="form-label">Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={formReviewData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup className="contact-page-form-group">
                <Form.Label className="form-label">Rating</Form.Label>
                <Form.Control
                  as="select" // Use a <select> element for the dropdown
                  name="rating"
                  value={formReviewData.rating}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Control>
              </FormGroup>
              <Form.Group controlId="formReviewText">
                <Form.Label>Review Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formReviewData.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Button
                variant="success"
                type="submit"
                name="submitReview"
                style={{ marginTop: "5px" }}
              >
                Submit Review
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default UserProfile;
