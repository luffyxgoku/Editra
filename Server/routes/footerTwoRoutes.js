const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const {
  getFooterTwo,
  postFooterTwo,
  deleteFooterTwo,
} = require("../controllers/footerTwoController");

const router = express.Router();

router.get("/footerTwo", getFooterTwo);
router.post("/footerTwo", authenticate, postFooterTwo);
router.delete("/footerTwo", authenticate, deleteFooterTwo);

module.exports = router;
