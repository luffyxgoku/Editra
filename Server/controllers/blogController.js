const blogsCollection = require("../models/Blog");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogsCollection.find({});
    if (!blogs) return res.status(200).json({ message: "NO BLOGS", blogs });

    return res.status(200).json({ message: "GOT ALL BLOGS", blogs });
  } catch (error) {
    console.error("Blogs Retrieval error:", error);
    res.status(500).json({ message: "Server error: Unable to get BLOGS" });
  }
};

exports.getBlogById = async (req, res) => {
  const blogID = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(blogID)) {
    return res.status(400).json({ message: "Invalid blog ID format" });
  }

  try {
    const blog = await blogsCollection.findById(blogID);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "BLOG RETRIEVED", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: Unable to retrieve blog" });
  }
};

exports.createBlog = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { blogTitle, blogBody } = req.body;

  if (!blogTitle || !blogBody) {
    return res
      .status(400)
      .json({ message: "Bad Request: All fields are required" });
  }

  try {
    const blog = await blogsCollection.create({
      blogTitle,
      blogBody,
      blogImageLink: `/uploads/blog/${req.file.filename}`,
      blogCreatedBy: req.user.id,
    });

    return res.status(201).json({ message: "BLOG CREATED", blog });
  } catch (error) {
    console.error("Blog creation error:", error);
    res.status(500).json({ message: "Server error: Unable to create BLOG" });
  }
};

exports.updateBlog = async (req, res) => {
  const blogID = req.params.id;
  const userID = req.user.id;
  const { blogTitle, blogBody } = req.body;

  try {
    const blog = await blogsCollection.findOne({
      _id: blogID,
      blogCreatedBy: userID,
    });

    if (!blog) {
      return res.status(404).json({
        message:
          "Not Found: Blog does not exist or you do not have permission to update it",
      });
    }

    let blogImageLink = blog.blogImageLink;

    if (req.file) {
      const oldImagePath = path.join(__dirname, blog.blogImageLink);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      blogImageLink = `/uploads/blog/${req.file.filename}`;
    }

    const updatedBlog = await blogsCollection.findOneAndUpdate(
      { _id: blogID, blogCreatedBy: userID },
      { $set: { blogTitle, blogImageLink, blogBody } },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(403).json({
        message: "Failed to update: You are not authorized to edit this blog",
      });
    }

    return res
      .status(200)
      .json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.error("Blog Update error:", error);
    res.status(500).json({ message: "Server error: Unable to update BLOG" });
  }
};

exports.deleteBlog = async (req, res) => {
  const blogID = req.params.id;
  const userID = req.user.id;

  try {
    const blog = await blogsCollection.findOne({
      _id: blogID,
      blogCreatedBy: userID,
    });

    if (!blog) {
      return res.status(404).json({
        message:
          "Not Found: Blog does not exist or you do not have permission to delete it",
      });
    }

    // const imagePath = path.join(__dirname, blog.blogImageLink);
    const imagePath = path.join(__dirname, "..", blog.blogImageLink);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await blogsCollection.deleteOne({ _id: blogID, blogCreatedBy: userID });

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Blog Deletion error:", error);
    res.status(500).json({ message: "Server error: Unable to delete BLOG" });
  }
};
