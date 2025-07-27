const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { uploadFooterThree } = require("../middlewares/uploadMiddleware");
const {
  getFooterThree,
  postFooterThree,
  deleteFooterThree,
} = require("../controllers/footerThreeController");

const router = express.Router();

router.get("/footerThree", getFooterThree);

router.post(
  "/footerThree",
  authenticate,
  uploadFooterThree.fields([
    { name: "addressPath", maxCount: 1 },
    { name: "phonePath", maxCount: 1 },
    { name: "emailPath", maxCount: 1 },
  ]),
  postFooterThree
);

router.delete("/footerThree", authenticate, deleteFooterThree);

module.exports = router;
