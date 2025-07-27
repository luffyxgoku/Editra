const mongoose = require("mongoose");

const footerSchemaThree = new mongoose.Schema({
  heading: { type: String, required: true },
  details: {
    address: { type: String, required: true },
    addressPath: { type: String, required: true },
    phone: { type: String, required: true },
    phonePath: { type: String, required: true },
    email: { type: String, required: true },
    emailPath: { type: String, required: true },
  },
});

const footersCollectionThree = mongoose.model(
  "footercolumnthrees",
  footerSchemaThree
);

module.exports = footersCollectionThree;
