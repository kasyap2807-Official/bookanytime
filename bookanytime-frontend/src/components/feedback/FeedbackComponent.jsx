import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const FeedbackComponent = () => {
  const [description, setDescription] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // New state to handle feedback submission

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !description.trim()) {
      alert("User not found or feedback is empty.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, {
        username: user.fullName,
        email: user.email,
        phone: user.phoneNumber, // phone now included
        description: description.trim(),
      });

      setFeedbackSubmitted(true); // Set feedbackSubmitted to true on successful submission
      setDescription(""); // Clear the description input after submission
    } catch (err) {
      console.error("Error submitting feedback", err);
      alert("Something went wrong.");
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
          <Typography variant="h4" color="primary" gutterBottom>
            Feedback for Property or Website
          </Typography>

          {feedbackSubmitted && ( // Display message only when feedback is submitted
            <Typography variant="h6" color="green" sx={{ mb: 2 }}>
              Thanks for sharing feedback!
            </Typography>
          )}

          <TextField
            label="Write your feedback here..."
            multiline
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              },
            }}
          />

          <Button
            onClick={handleSubmit}
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
        </Paper>
      </Container>
    </Box>
  );
};

export default FeedbackComponent;
