const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  category: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  username: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String },
});

module.exports = mongoose.model("Rating", RatingSchema);
