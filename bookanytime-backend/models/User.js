const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, // ✅ Added phoneNumber
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isAdmin: { type: Boolean, default: false },  // ✅ Ensure isAdmin exists
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
