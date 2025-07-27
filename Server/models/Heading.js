const mongoose = require("mongoose");

const headingSchema = new mongoose.Schema({
  aboutHeading: { type: String },
  blogHeading: { type: String },
  copyrightHeading: { type: String },
  contactHeading: { type: String },
  createblogHeading: { type: String },
  enquiriesHeading: { type: String },
  signupHeading: { type: String },
  signinHeading: { type: String },
});

const headingsCollection = mongoose.model("headings", headingSchema);

module.exports = headingsCollection;
