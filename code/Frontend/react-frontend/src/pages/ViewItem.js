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

function AllItemsPage() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { username } = useUser();
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "",
    price: "",
    owner: "",
  });

  useEffect(() => {
    fetchEquipmentData();
  }, [username]);

  const fetchEquipmentData = () => {
    fetch("http://127.0.0.1:5000/api/getEquipment")
      .then((response) => response.json())
      .then((data) => setEquipmentData(data))
      .catch((error) => console.error("Error:", error));
  };

  const handleRemoveClick = (event, equipment) => {
    event.stopPropagation();
    setSelectedItem(equipment);
    setShowRemoveModal(true);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleRemoveConfirm = () => {
    if (!selectedItem) {
      console.error("No item selected for removal.");
      return;
    }
    console.log("Selected Item:", selectedItem);
    fetch(`http://127.0.0.1:5000/api/removeEquipment/${selectedItem.itemid}`, {
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

  const handleUpdateSubmit = (event) => {
    event.preventDefault();
    console.log(updateFormData);
    fetch(`http://127.0.0.1:5000/api/updateEquipment/${updateFormData.id}`, {
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

  const handleCardClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowModal(true);
  };

  return (
    <div>
      <NavbarCustom />
      <Container>
        <Row>
          {equipmentData.map(
            (equipment) =>
              equipment.owner === username && (
                <Col key={equipment.id} xs={12} sm={6} md={4} lg={3}>
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
                        onClick={(e) => handleRemoveClick(e, equipment)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="primary"
                        onClick={(e) => handleUpdateClick(e, equipment)}
                      >
                        Update
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
          )}
        </Row>
      </Container>

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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
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
          <Button variant="danger" onClick={handleRemoveConfirm}>
            Remove
          </Button>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
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
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
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
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AllItemsPage;
