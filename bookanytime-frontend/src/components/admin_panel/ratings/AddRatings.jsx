import { useState, useEffect } from "react";
import { Button, Modal, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const AddRatings = ({ open, onClose }) => {
  const [ratings, setRatings] = useState({
    category: "",
    propertyId: "",
    username: "",
    month: "",
    year: "",
    rating: "",
    description: "",
  }); 
   const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (!ratings.category) return;

    const category =  ratings.category;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("delete data", data)
          setProperties(data);
        } else {
          setProperties([]);
        }
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [ratings.category]);

  const handleCategoryChange = (e ) => {
    setRatings({ category: e.target.value, propertyId: "" });
    
  };

  const handlePropertyChange = (e) => {
    setRatings((prev) => ({ ...prev, propertyId: e.target.value }));
    
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!ratings.propertyId || !ratings.username || !ratings.month || !ratings.year || !ratings.rating) {
      alert("Please fill all the required fields");
      return;
    }

    console.log("ratings", ratings)
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/ratings`, ratings)
      .then(() => {
        alert("Rating added successfully!");
        setRatings({ category: "", propertyId: "", username: "", month: "", year: "", rating: "", description: "" });
        onClose();
      })
      .catch((err) => console.error("Error adding rating:", err));
  };


  return (
    <div className="container mt-5 text-center">
      {/* Update Property Modal */}
      <Modal open={open} onClose={onClose}>
      <div className="position-absolute top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{ width: "350px" }}>
          <h5>Add Ratings</h5>
          <select className="form-select my-2" onChange={(e) => handleCategoryChange(e, "update")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
                 <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
          </select>
          <select className="form-select my-2" onChange={(e) => handlePropertyChange(e, "update")} disabled={!properties.length}>
            <option value="">Select Property</option>
            {properties.map((prop) => (
              <option key={prop._id} value={prop._id}>
                {prop.name} - {prop.address}
              </option>
            ))}
          </select>

          <TextField fullWidth className="my-2" label="Username" name="username" value={ratings.username} onChange={handleChange} />

<TextField fullWidth select className="my-2" label="Month" name="month" value={ratings.month} onChange={handleChange}>
  {months.map((month, index) => (
    <MenuItem key={index} value={month}>{month}</MenuItem>
  ))}
</TextField>

<TextField fullWidth className="my-2" label="Year" type="number" name="year" value={ratings.year} onChange={handleChange} />

<TextField fullWidth className="my-2" label="Rating (1-5)" type="number" name="rating" value={ratings.rating} onChange={handleChange} inputProps={{ min: "1", max: "5", step: "0.1" }} />

<TextField fullWidth multiline rows={3} className="my-2" label="Description" name="description" value={ratings.description} onChange={handleChange} />

          <div className="d-flex gap-2 mt-3">
            <Button variant="contained" color="primary" className="w-50" onClick={handleSubmit} disabled={!ratings.propertyId}>
              Submit
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

export default AddRatings;
