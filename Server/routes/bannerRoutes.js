const express = require("express");
const {
  createOrUpdateBannerContent,
  getBannerContent,
  uploadBannerImage,
  getAllBanners,
  deleteBannerImage,
} = require("../controllers/bannerController");
const authenticate = require("../middlewares/authMiddleware");
const { uploadBanner } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/bannerContent", authenticate, createOrUpdateBannerContent);
router.get("/bannerContent", getBannerContent);
router.post(
  "/upload/banner",
  authenticate,
  uploadBanner.single("file"),
  uploadBannerImage
);
router.get("/banners", getAllBanners);
router.delete("/delete/banner", authenticate, deleteBannerImage);

module.exports = router;
