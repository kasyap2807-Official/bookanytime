const express = require("express");
const router = express.Router();
const ListProperty = require("../models/ListProperty");

// Route to handle property listing form submission
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, category } = req.body;
    
    if (!name || !phone || !email || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProperty = new ListProperty({ name, phone, email, category });
    await newProperty.save();

    res.status(201).json({ message: "Thanks for sharing details, we will get back to you shortly" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const properties = await ListProperty.find().sort({ createdAt: -1 }); // Get latest first
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

module.exports = router;
