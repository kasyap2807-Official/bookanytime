const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String } 
},
{ collection: "categories_collection" }

);

module.exports = mongoose.model("Category", CategorySchema);
