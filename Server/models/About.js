const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true },
  heading: { type: String, required: true },
  paragraph: { type: String, required: true },
  filePath: { type: String },
});

const aboutsCollection = mongoose.model("abouts", aboutSchema);

module.exports = aboutsCollection;
