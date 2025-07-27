const express = require("express");
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadBlog } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", authenticate, uploadBlog.single("file"), createBlog);
router.put("/blogs/:id", authenticate, uploadBlog.single("file"), updateBlog);
router.delete("/blogs/:id", authenticate, deleteBlog);

module.exports = router;
