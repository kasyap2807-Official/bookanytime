import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { TextField, MenuItem, Button, Grid, Paper, Typography, CircularProgress, Chip } from "@mui/material";

const AdminPropertyForm = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    house_rules: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    amenities: [],
    adults: "",
    bedrooms: "",
    popularity: "", 
    images: [],
    whatsappNumber: "",
    instagram: "",
  });

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const amenitiesOptions = ["WiFi", "Swimming Pool","Kitchen","Air conditioning","Heating","Free washing machine","Dryer","HDTV with Netflix","Iron","Hair dryer","Dedicated workspace","Swimming Pool","Hot tub","Free parking on premises","Paid parking","Gym","BBQ grill","Box cricket","Barbeque setup","Projector","Jacuzzi","Camp fire","Smoking allowed","Pets allowed","Breakfast included","Security cameras","Fire extinguisher","First aid kit","Hot water","Private back garden – Fully fenced","Window AC unit","Patio or balcony","Bath tubs","Lawn","Outdoor barbeque","Other"];
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleAmenitySelect = (e) => {
    const value = e.target.value;
    setSelectedAmenity(value);
    if (value !== "Other" && !formData.amenities.includes(value)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    }
  };

  const handleAddNewAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setSelectedCategory(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Append images
    imageFiles.forEach((file) => formDataToSend.append("images", file));

    // Append other fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Remove previously appended values to avoid duplicates
    formDataToSend.delete("adults");
    formDataToSend.delete("bedrooms");

    // Append capacity fields separately
    formDataToSend.append("adults", String(Number(formData.adults) || 0));
    formDataToSend.append("bedrooms", String(Number(formData.bedrooms) || 0));

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/properties`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      house_rules: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      amenities: [],
      adults: "",
      bedrooms: "",
      popularity: "", 
      images: [],
      whatsappNumber: "",
      instagram: "",
    });
    setImageFiles([]);
    setSelectedAmenity("");
    setSelectedCategory("")
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add New Property
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Property Name */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Category" name="category" value={selectedCategory} onChange={handleChange} required>

              {categories.map((option) => (
                <MenuItem key={option._id} value={option.name}>{option.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} required />
          </Grid>

          {/* House Rules */}
          <Grid item xs={12}>
            <TextField fullWidth label="House Rules" name="house_rules" multiline rows={3} value={formData.house_rules} onChange={handleChange} required />
          </Grid>

          {/* Price Range (Min and Max Price) */}
          <Grid container spacing={2}>
            {/* Min Price */}
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="number"
                label="Min Price"
                name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                placeholder="Min Price"
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* To text */}
            <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
              <span>to</span>
            </Grid>

            {/* Max Price */}
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="number"
                label="Max Price"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                placeholder="Max Price"
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>




          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required />
          </Grid>

          {/* Latitude & Longitude */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Selected Amenities:</Typography>
            {formData.amenities.map((amenity, index) => (
              <Chip key={index} label={amenity} onDelete={() => handleRemoveAmenity(amenity)} style={{ margin: 4 }} />
            ))}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Select Amenity" value={selectedAmenity} onChange={handleAmenitySelect}>
              {amenitiesOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {selectedAmenity === "Other" && (
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Enter New Amenity" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} />
              <Button onClick={handleAddNewAmenity} variant="contained" color="primary" style={{ marginTop: 8 }}>
                Add Amenity
              </Button>
            </Grid>
          )}

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Adults Capacity" name="adults" value={formData.adults} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
          </Grid>

          {/* Popularity */}
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Popularity" name="popularity"  value={formData.popularity}  onChange={handleChange}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
            </TextField>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />
          </Grid>

          {/* WhatsApp Number */}
          <Grid item xs={12}>
            <TextField fullWidth label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
          </Grid>
          {/* Instagram */}
          <Grid item xs={12}>
            <TextField fullWidth label="Instagram UserID" name="instagram" value={formData.instagram} onChange={handleChange} required />
          </Grid>
          {/* Submit and Cancel Buttons */}
          <Grid item xs={12} style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="outlined" color="default" onClick={() => navigate("/admin/properties")}>
              Go Back
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AdminPropertyForm;
