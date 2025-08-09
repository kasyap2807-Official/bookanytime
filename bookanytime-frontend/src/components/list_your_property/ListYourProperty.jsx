import React, { useState } from "react";
import axios from "axios";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Logo from "../../../public/lg.png"

const ListProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    const phoneRegEx = /^\+91\d{10}$/; // Check if the phone starts with +91 and is followed by 10 digits
    return phoneRegEx.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standard email regex
    return emailRegEx.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormErrors({ phone: "", email: "" }); // Reset errors before validation

    // Validate phone and email before submission
    let valid = true;

    if (!validatePhone(formData.phone)) {
      setFormErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number (+91 followed by 10 digits)." }));
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      setFormErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      valid = false;
    }

    if (!valid) {
      return; // Don't submit the form if validation fails
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/list-property`,
        formData
      );
      setMessage(response.data.message);
      setFormData({ name: "", phone: "", email: "", category: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(to right, #1E3C72, #2A5298)",
        padding: 2,
        marginTop:"50px"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5, // spacing between logo and text
              mb: 3, // margin bottom
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              sx={{ margin: 0 }}
            >
              List Your Property
            </Typography>
          </Box>

          {/* WhatsApp Button */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <a
              href="https://wa.me/918088183625"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
              }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<WhatsAppIcon />}
                sx={{
                  width: "200px",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Contact via WhatsApp
              </Button>
            </a>
          </Box>

          {/* Success/Error Message */}
          {message && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="+91 9876543210"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
              error={!!formErrors.phone} // Show error if validation fails
              helperText={formErrors.phone} // Show the error message
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
              error={!!formErrors.email} // Show error if validation fails
              helperText={formErrors.email} // Show the error message
            />
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: 600,
                backgroundColor: "#0072ff",
                "&:hover": { backgroundColor: "#005bb5" },
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ListProperty;
