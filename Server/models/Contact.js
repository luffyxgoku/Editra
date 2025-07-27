const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  contactPath: { type: String, required: true },
  details: {
    address: { type: String, required: true },
    addressPath: { type: String, required: true },
    phone: { type: String, required: true },
    phonePath: { type: String, required: true },
    email: { type: String, required: true },
    emailPath: { type: String, required: true },
  },
});

const contactsCollection = mongoose.model("contacts", contactSchema);

module.exports = contactsCollection;
