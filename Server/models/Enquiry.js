const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  msg: { type: String, required: true },
});

const enquiriesCollection = mongoose.model("enquiries", enquirySchema);

module.exports = enquiriesCollection;
