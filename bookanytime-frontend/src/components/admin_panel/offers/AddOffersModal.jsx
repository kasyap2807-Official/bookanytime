import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const AddOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]); // Store multiple properties

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch properties when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${encodeURIComponent(selectedCategory)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProperties(data);
          } else {
            setProperties([]);
          }
        })
        .catch((error) => console.error("Error fetching properties:", error));
    } else {
      setProperties([]);
    }
  }, [selectedCategory]);

  const handleImageChange = (e) => {
    setImage([...e.target.files]);
  };

  const handlePropertySelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedProps = selectedOptions.map((option) => ({
      _id: option.value,
      name: option.text,
    }));
    setSelectedProperties(selectedProps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || selectedProperties.length === 0 || !image.length || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("properties", JSON.stringify(selectedProperties)); // Send as JSON string
    image.forEach((img) => formData.append("images", img));
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/offers/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Offer added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Failed to add offer.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Offer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Properties</Form.Label>
            <Form.Control as="select" multiple onChange={handlePropertySelection}>
              {properties.map((prop) => (
                <option key={prop._id} value={prop._id}>{prop.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Offer Image</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">Add Offer</Button>
          <Button variant="secondary" className="mt-3 ms-2" onClick={handleClose}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddOfferModal;
