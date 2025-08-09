const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
