const express = require("express");
const {
  postEnquiry,
  getEnquiries,
  deleteEnquiry,
} = require("../controllers/enquiryController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/enquiries", postEnquiry);
router.get("/enquiries", authenticate, getEnquiries);
router.delete("/enquiries/:id", authenticate, deleteEnquiry);

module.exports = router;
