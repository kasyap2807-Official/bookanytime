import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, MenuItem, Button, Grid, Paper, Typography, CircularProgress, Chip } from "@mui/material";

const UpdatePropertyPage = () => {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    house_rules: "",
    minPrice: "", // Use minPrice instead of price
    maxPrice: "", // Use maxPrice instead of price
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    amenities: [],
    capacity: {
      adults: "",
      bedrooms: "",
    },
    popularity:"",
    images: [],
    whatsappNumber: "",
    instagram: ""
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const amenitiesOptions = ["WiFi", "Swimming Pool", "Other"];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch property details when component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`);
        setFormData({
          ...response.data,
          capacity: response.data.capacity || { adults: "", bedrooms: "" }, // Ensure capacity is always an object
        });
        console.log("data from backend", response.data);
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is nested within capacity
    if (name === "adults" || name === "bedrooms") {
      setFormData((prev) => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  // Handle Amenity Selection
  const handleAmenitySelect = (e) => {
    const value = e.target.value;
    setSelectedAmenity(value);
    if (value !== "Other" && !formData.amenities.includes(value)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    }
  };

  // Handle Adding Custom Amenity
  const handleAddNewAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity("");
    }
  };

  // Handle Amenity Removal
  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove)
    }));
  };

  // Handle Form Submission (Update Property)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Append images if new ones are selected
    imageFiles.forEach((file) => formDataToSend.append("images", file));

    // Append other fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "capacity") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append nested capacity fields
    formDataToSend.append("capacity[adults]", formData.capacity.adults);
    formDataToSend.append("capacity[bedrooms]", formData.capacity.bedrooms);

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("data to update", formDataToSend)
      alert("Property updated successfully!");
      navigate("/"); // Redirect to admin properties page
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Update Property
      </Typography>
      {loading ? <CircularProgress /> : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required>
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

            {/* Price Range (Min & Max Price) */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Min Price" name="minPrice" value={formData.minPrice} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Max Price" name="maxPrice" value={formData.maxPrice} onChange={handleChange} required />
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

            {/* Bedrooms */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Bedrooms"
                name="bedrooms"
                value={formData.capacity.bedrooms}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Adults */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Adults"
                name="adults"
                value={formData.capacity.adults}
                onChange={handleChange}
                required
              />
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
            <Grid item xs={12}>
              {formData.images}
            </Grid>

            {/* WhatsApp Number */}
            <Grid item xs={12}>
              <TextField fullWidth label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
            </Grid>

            {/* Instagram */}
            <Grid item xs={12}>
              <TextField fullWidth label="Instagram UserID" name="instagram" value={formData.instagram} onChange={handleChange} required />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Update Property"}
              </Button>
              <Button variant="outlined" color="default" onClick={() => navigate("/admin/properties")}>
                Go Back
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default UpdatePropertyPage;
