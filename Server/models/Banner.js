const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  tagline: { type: String, required: true },
  bannerPaths: [{ type: String, required: true }],
});

const bannersCollection = mongoose.model("banners", bannerSchema);

module.exports = bannersCollection;
