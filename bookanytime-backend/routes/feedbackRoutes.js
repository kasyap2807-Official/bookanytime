const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { username, email, phone, description } = req.body;

    const newFeedback = new Feedback({
      username,
      email,
      phone,
      description,
    });

    await newFeedback.save();
    res.status(201).send("Feedback saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving feedback");
  }
});


// GET /api/users
router.get('/feedback-logs', async (req, res) => {
  try {
    const users = await Feedback.find().sort({ createdAt: -1 });
    console.log("feedbacks", users)
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
