const mongoose = require("mongoose");

const footerSchemaOne = new mongoose.Schema({
  footerPath: { type: String, required: true },
  columnOne: {
    heading: { type: String, required: true },
    description: { type: String, required: true },
  },
});

const footersCollectionOne = mongoose.model(
  "footercolumnones",
  footerSchemaOne
);

module.exports = footersCollectionOne;
