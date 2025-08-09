const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhoneNumber: { type: String, required: true },
  propertyId: { type: String, required: true },
  propertyName: { type: String, required: true },
  propertyAddress: { type: String, required: true },
  contactDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrackData", contactSchema);
