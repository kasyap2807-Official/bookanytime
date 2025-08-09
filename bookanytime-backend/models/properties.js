const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    house_rules: { type: String, required: true },
    minPrice: { type: Number, required: true },  
    maxPrice: { type: Number, required: true },  
    city: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    amenities: { type: [String], default: [] },
    capacity: {
      adults: { type: Number, required: true },
      bedrooms: { type: Number, required: true }
    },
    popularity: { type: Number },
    images: { type: [String], default: [] },
    whatsappNumber: { type: String, required: true },
    instagram: { type: String, required: true }

  },
  { collection: "properties_collection" }
);

module.exports = mongoose.model("Property", propertySchema);
