const mongoose = require("mongoose");

const footerSchemaTwo = new mongoose.Schema({
  heading: { type: String, required: true },
  links: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const footersCollectionTwo = mongoose.model(
  "footercolumntwos",
  footerSchemaTwo
);

module.exports = footersCollectionTwo;
