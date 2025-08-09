const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    properties: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
      },
    ], // Array of properties
    image: {
      type: [String], // Will store image URL
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { collection: "offers_collection" }
);

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;
