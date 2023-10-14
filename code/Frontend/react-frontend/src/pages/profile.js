import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavbarCustom } from "../Components/Navbar";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useUser } from "../Components/UserContext";

// Ths infunction is used to displat the user data
function UserDataList() {
  const [userData, setUserData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { username } = useUser();
  console.log(username);
  
//This function is used to fetch the user data when the component mounts 
  useEffect(() => {
    fetchUserData();
  }, []);

// This function is used for making an API request to retrieve user data
  const fetchUserData = () => {
    fetch("http://127.0.0.1:5000/api/getUsers")
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  };

//This function sets the selected user in the selectedUser state
  const handleCardClick = (user) => {
    setSelectedUser(user);
  };
//This is the component that renders a list of all users
  return (
    <div>
      <NavbarCustom />

      <Container>
        <Row>
          {userData.map((user, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3}>
              <Link to={`user/${user}`} style={{ textDecoration: "none" }}>
                <Card
                  onClick={() => handleCardClick(user)}
                  name={`${user}`}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title>{user}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default UserDataList;
