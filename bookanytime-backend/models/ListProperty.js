const mongoose = require("mongoose");

const listPropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
});

const ListProperty = mongoose.model("ListProperty", listPropertySchema);
module.exports = ListProperty;
