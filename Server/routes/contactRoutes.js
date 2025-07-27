const express = require("express");
const {
  addOrUpdateContact,
  getContact,
  deleteContact,
} = require("../controllers/contactController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadContact } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post(
  "/contact",
  authenticate,
  uploadContact.fields([
    { name: "contactPath", maxCount: 1 },
    { name: "addressPath", maxCount: 1 },
    { name: "phonePath", maxCount: 1 },
    { name: "emailPath", maxCount: 1 },
  ]),
  addOrUpdateContact
);

router.get("/contact", getContact);

router.delete("/contact", authenticate, deleteContact);

module.exports = router;
