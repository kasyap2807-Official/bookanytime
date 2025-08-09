const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }]
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
