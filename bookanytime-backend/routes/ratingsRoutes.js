const express = require("express");
const Rating = require("../models/Ratings");

const router = express.Router();

// Add Rating
router.post("/", async (req, res) => {
  try {
    const { category, propertyId, username, month, year, rating, description } = req.body;

    if (!category || !propertyId || !username || !month || !year || !rating) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const newRating = new Rating({
      category,
      propertyId,
      username,
      month,
      year,
      rating,
      description,
    });

    await newRating.save();
    res.status(201).json({ message: "Rating added successfully" });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Ratings by Property ID
router.get("/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;
    const ratings = await Rating.find({ propertyId });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ratings" });
  }
});


// DELETE a rating by ID
router.delete("/:ratingId", async (req, res) => {
  try {
    const { ratingId } = req.params;

    // Check if rating exists
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ success: false, message: "Rating not found" });
    }

    // Delete the rating
    await Rating.findByIdAndDelete(ratingId);

    return res.json({ success: true, message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
