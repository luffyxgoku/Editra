const express = require("express");

const {
  createOrUpdateHeadings,
  getHeadings,
  deleteHeadingField,
} = require("../controllers/headingController");

const router = express.Router();

router.post("/headings", createOrUpdateHeadings);

router.get("/headings", getHeadings);

router.delete("/headings/:field", deleteHeadingField);

module.exports = router;
