const express = require("express");
const {
  uploadAboutImage,
  getAboutImage,
  createOrUpdateAboutContent,
  getAboutContent,
  deleteAboutImage,
} = require("../controllers/aboutController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadAbout } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/upload/about", uploadAbout.single("file"), uploadAboutImage);
router.get("/about/:sectionId", getAboutImage);
router.post("/aboutContent", authenticate, createOrUpdateAboutContent);
router.get("/aboutContent/:sectionId", getAboutContent);
router.delete("/upload/about/:sectionId", deleteAboutImage);

module.exports = router;
