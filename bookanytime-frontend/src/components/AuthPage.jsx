import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../public/lg.png"

const AuthPage = ({ isSignup }) => {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[+]?[0-9]{1,4}?[ -]?[0-9]{10}$/;  // Adjust regex if needed
    return phoneRegex.test(phone);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    // Phone number validation for signup
    if (isSignup && !validatePhoneNumber(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const apiUrl = isSignup 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup` 
      : `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;
  
    try {
      const response = await axios.post(apiUrl, formData);
      const data = response.data;
  
      if (!isSignup && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
      } else if (isSignup && data.message?.toLowerCase().includes("signup successful")) {
        navigate("/login");
      } else {
        setError(data.message || (isSignup ? "Signup failed" : "Login failed"));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed. Try again.");
      console.error("Request failed:", err);
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
              gap: 1.5,
              mb: 3,
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: "35px",
                height: "35px",
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h4"
              color="primary"
              gutterBottom
              sx={{ margin: 0 }}
            >
              {isSignup ? "Create an Account" : "Login"}
            </Typography>
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
            {isSignup && (
              <>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
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
                />
              </>
            )}
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
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              component="button"
              onClick={() => navigate(isSignup ? "/login" : "/signup")}
              sx={{ cursor: "pointer", color: "#0072ff", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
