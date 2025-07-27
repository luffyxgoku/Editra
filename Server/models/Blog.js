const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blogTitle: { type: String, required: true, unique: true },
  blogImageLink: { type: String, required: true },
  blogBody: { type: String, required: true },
  blogCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const blogsCollection = mongoose.model("blogs", blogSchema);

module.exports = blogsCollection;
