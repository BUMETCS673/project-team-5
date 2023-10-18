import { useState, useEffect } from "react";
import { NavbarCustom } from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/UserContext";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import "../styles/pages/home.css";
import "../styles/Components/card.css";

//This function is a functional component that manages equipment data and provides functions to handle card clicks and reservation navigation
function EquipmentList() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { userType } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    fetchEquipmentData();
  }, []);
//This is a function that takes an equipment object as a parameter and updates the selectedItem state with the selected equipment
  const fetchEquipmentData = () => {
    // Fetch equipment data from your Flask API endpoint
    fetch("https://gearonthego-52bc9f57a8cd.herokuapp.com/api/getEquipment")
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error("Error:", error));
  };

//This is a function that navigates the user to the registration page (/register) with the selected equipment as a part of the route state
  const handleCardClick = (equipment) => {
    setSelectedItem(equipment);
    setShowModal(true);
  };

  const handleReserveClickRegister = () => {
    navigate("/register", { state: { selectedItem: selectedItem } });
  };
//This is a function that navigates the user to the reservations page (/reservations) with the selected equipment as part of the route state. 
  const handleReserveClickReserve = () => {
    navigate("/reservations", { state: { selectedItem: selectedItem } });
  };
//This component renders the items that are in the database on the homepage
  return (
    <div>
      <NavbarCustom />
      <div className="container2">
        <div className="row equal-height-cards">
          {equipmentData.map((equipment) => (
            <Col key={equipment.itemid} className="col-md-4 col-12">
              <Card
                className="custom-card"
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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Status: {selectedItem?.status}</p>
          <p>Description: {selectedItem?.description}</p>
          <p>Price: ${selectedItem?.price}</p>
          <p>Owner: {selectedItem?.owner}</p>
        </Modal.Body>
        <Modal.Footer>
          {userType === "renter" ? (
            <Button onClick={handleReserveClickReserve}>Reserve</Button>
          ) : (
            <Button onClick={handleReserveClickRegister}>Reserve</Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EquipmentList;
