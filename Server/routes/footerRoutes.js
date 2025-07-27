const express = require("express");
const {
  getFooter,
  postFooter,
  deleteFooter,
} = require("../controllers/footerController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadFooter } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post(
  "/footerOne",
  authenticate,
  uploadFooter.single("file"),
  postFooter
);
router.get("/footerOne", getFooter);
router.delete("/footerOne", authenticate, deleteFooter);

module.exports = router;
