const express = require("express");
const router = express.Router();
const {
  getSocialLinks,
  postSocialLink,
  deleteSocialLink,
} = require("../controllers/socialLinkController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadLink } = require("../middlewares/uploadMiddleware");

router.get("/socialLinks", getSocialLinks);
router.post(
  "/socialLinks",
  authenticate,
  uploadLink.single("file"),
  postSocialLink
);
router.delete("/socialLinks/:id", authenticate, deleteSocialLink);

module.exports = router;
