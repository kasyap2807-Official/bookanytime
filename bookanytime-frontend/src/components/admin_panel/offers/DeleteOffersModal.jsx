import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const DeleteOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const fetchOffers = (category) => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers/category/${category}`)
      .then((res) => setOffers(res.data))
      .catch((err) => console.error("Error fetching offers:", err));
  };

  const handleDelete = async () => {
    if (!selectedOffer) {
      alert("Please select an offer to delete.");
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/offers/delete/${selectedOffer}`);
      alert("Offer deleted successfully!");
      handleClose();
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Offer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={(e) => {
              setSelectedCategory(e.target.value);
              fetchOffers(e.target.value);
            }}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                 <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Available Offers</Form.Label>
            <Form.Control as="select" value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)}>
              <option value="">Select Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer._id}>{offer.category} - {new Date(offer.startDate).toDateString()}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="danger" onClick={handleDelete} className="mt-3">Delete Offer</Button>
          <Button variant="secondary" className="mt-3 ms-2" onClick={handleClose}>
                      Cancel
                    </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteOfferModal;
