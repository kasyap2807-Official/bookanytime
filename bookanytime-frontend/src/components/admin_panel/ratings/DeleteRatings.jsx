import { useState, useEffect } from "react";
import { Button, Modal } from "@mui/material";
import axios from "axios";

const DeleteRatings = ({ open, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [ratings, setRatings] = useState([]); // Ensure this is an array
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${encodeURIComponent(selectedCategory)}`)
      .then((res) => setProperties(res.data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedProperty) return;

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${selectedProperty}`)
      .then((res) => {
        setRatings(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Error fetching ratings:", err));
  }, [selectedProperty]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setProperties([]); // Reset properties when category changes
    setSelectedProperty("");
    setRatings([]); // Reset ratings
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    setRatings([]); // Reset ratings when property changes
  };

  const handleRatingsChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const handleDelete = () => {
    if (!selectedRating) {
      alert("Please select a rating to delete");
      return;
    }

    axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${selectedRating}`)
      .then(() => {
        alert("Rating deleted successfully!");
        setRatings(ratings.filter(rating => rating._id !== selectedRating));
        setSelectedRating("");
      })
      .catch((err) => console.error("Error deleting rating:", err));
  };

  return (
    <div className="container mt-5 text-center">
      <Modal open={open} onClose={onClose}>
        <div className="position-absolute top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{ width: "350px" }}>
          <h5>Delete Ratings</h5>

          <select className="form-select my-2" onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select className="form-select my-2" onChange={handlePropertyChange} disabled={!properties.length}>
            <option value="">Select Property</option>
            {properties.map((prop) => (
              <option key={prop._id} value={prop._id}>{prop.name} - {prop.address}</option>
            ))}
          </select>

          <select className="form-select my-2" onChange={handleRatingsChange} disabled={!ratings.length}>
            <option value="">Select Rating</option>
            {ratings.map((rating) => (
              <option key={rating._id} value={rating._id}>
                {rating.username} - {rating.month} {rating.year} - {rating.rating}⭐
              </option>
            ))}
          </select>

          <div className="d-flex gap-2 mt-3">
            <Button variant="contained" color="primary" className="w-50" onClick={handleDelete} disabled={!selectedRating}>
              Delete
            </Button>
            <Button variant="contained" color="secondary" className="w-50" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteRatings;
