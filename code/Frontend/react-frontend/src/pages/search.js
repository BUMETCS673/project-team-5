import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarCustom from "../Components/Navbar";

function ItemSearchAndFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("searchItems");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchItems();
  }, [availabilityFilter, priceRange, searchQuery]);
//This is a fetch items function that looks into the equipment table of the database
  const fetchItems = () => {
    // Make an AJAX request to your backend API
    let endpoint;

    if (availabilityFilter === "searchItems") {
      endpoint = `http://127.0.0.1:5000/api/searchItems?q=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;
    } else if (availabilityFilter === "available") {
      endpoint = `http://127.0.0.1:5000/api/searchItems?q=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&availability=available`;
    } else if (availabilityFilter === "unavailable") {
      endpoint = `http://127.0.0.1:5000/api/searchItems?q=${searchQuery}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&availability=unavailable`;
    } else {
      endpoint = `http://127.0.0.1:5000/api/items?availability=${availabilityFilter}`;
    }
  
    fetch(endpoint)
      .then(handleResponse)
      .catch(handleError);
  };

  const handleResponse = (response) => {
    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
    response.text().then((errorText) => console.error("Error response:", errorText));
      throw new Error("Network response was not ok");
    }

    response
      .json()
      .then((data) => {
        setResults(data);
      })
      .catch(handleError);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    setResults([{ message: "An error occurred while fetching data." }]);
  };

  const handleCardClick = (item) => {
    console.log(selectedItem);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleReserveClick = () => {
    console.log(selectedItem);
    navigate("/reservations",{state:{selectedItem:selectedItem}});
  };

  const filterDataByPriceRange = () => {
    const filteredItems = results.filter((item) => {
      return (
        item &&
        item.price !== undefined && // Check if 'price' property exists and is not undefined
        item.price >= priceRange[0] &&
        item.price <= priceRange[1] &&
        (availabilityFilter === "searchItems" || // Include all items if "All" is selected
          (availabilityFilter === "available" && item.available) || // Include only available items
          (availabilityFilter === "unavailable" && !item.available)) // Include only unavailable items
      );
    });
    setFilteredData(filteredItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    fetchItems();
  };


  // Use useEffect to call the filtering function whenever the priceRange changes
  useEffect(() => {
    filterDataByPriceRange();
  }, [priceRange]);

  return (
    <div>
      <NavbarCustom />

      <Container>
        {/* Search input */}
        <div class="searchWrapper">
          <form onSubmit={handleSubmit}>
            <div class="searchBar">
              <input
              type="text"
              id="searchInput"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}/>
              <Button id="searchButton" type="submit" onClick={fetchItems}>Search</Button>

            {/* Filter Options */}
            <h2>Filter by Availability Status:</h2>
            <label>
              <input
                type="radio"
                name="availabilityFilter"
                value="searchItems"
                onClick={() => {
                  setSearchQuery("");
                  fetchItems();
                }}
                checked={availabilityFilter === "searchItems"}
                onChange={() => setAvailabilityFilter("searchItems")}
              />{" "}
              All
            </label>
            <label>
              <input
                type="radio"
                id="radioAvailable"
                name="availabilityFilter"
                value="available"
                // onClick={(e) => setSearchQuery("")}
                onClick={() => {
                  setSearchQuery("");
                  setAvailabilityFilter("available");
                  fetchItems();
                }}

                checked={availabilityFilter === "available"}
                // onChange={() => setAvailabilityFilter("available")}
              />{" "}
              Available
            </label>
            <label>
              <input
                type="radio"
                id="radioUnavailable"
                name="availabilityFilter"
                value="unavailable"
                // onClick={(e) => setSearchQuery("")}
                onClick={() => {
                  setSearchQuery("");
                  setAvailabilityFilter("unavailable");
                  fetchItems();
                }}
                checked={availabilityFilter === "unavailable"}
                // onChange={() => setAvailabilityFilter("unavailable")}
              />{" "}
              Unavailable
            </label>

            </div>
            
            {/* {availabilityFilter === "searchItems" &&  ( */}
            <div class="priceFilter">
              {/* Price Range Slider */}
              <h2>Filter by Price Range:</h2>
              <Slider range
              size="small"
                defaultValue={70}
                aria-label="Small"
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={20}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />
              <div>
                <span>Min Price: ${priceRange[0]}</span>
                <span>Max Price: ${priceRange[1]}</span>
              </div>
            </div>
            {/* )} */}
            </form>
        </div>

        {/* Display Results */}
      
        <div id="results">
                
          {results
          .filter((item) => item && item.price !== undefined && item.price >= priceRange[0] && item.price <= priceRange[1])
          .map((item) => (
            
            <Card
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(item)}
            >
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Status: {item.available ? "Available" : "Unavailable"}
                </Card.Subtitle>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>Price: ${item.price}</Card.Text>
                <Card.Text>Owner: {item.owner}</Card.Text>
              </Card.Body>
            </Card>
          )
          )}
        </div> 

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
            <Button onClick={handleReserveClick}>Reserve</Button>
            <Button variant="secondary" onClick={() => {
                setSearchQuery(""); 
                setShowModal(false); 
                setAvailabilityFilter("searchItems"); 
                fetchItems();
                }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default ItemSearchAndFilter;
