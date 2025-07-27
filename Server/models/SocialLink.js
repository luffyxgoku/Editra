const mongoose = require("mongoose");

const SocialLinkSchema = new mongoose.Schema({
  links: [
    {
      filePath: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
});

const sociallinksCollection = mongoose.model("sociallinks", SocialLinkSchema);

module.exports = sociallinksCollection;
