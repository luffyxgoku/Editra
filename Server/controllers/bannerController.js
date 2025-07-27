const bannersCollection = require("../models/Banner");
const path = require("path");
const fs = require("fs");

exports.createOrUpdateBannerContent = async (req, res) => {
  const { heading, tagline } = req.body;

  try {
    const banner = await bannersCollection.findOne();
    if (!banner) {
      await bannersCollection.create({ heading, tagline });
    } else {
      await bannersCollection.updateOne(
        { _id: banner._id },
        { $set: { heading, tagline } }
      );
    }

    res.status(201).json({ message: "Banner Content Posted Successfully" });
  } catch (error) {
    console.error("Banner Content creation error:", error);
    res
      .status(500)
      .json({ message: "Server error: Unable to create Banner Content" });
  }
};

exports.getBannerContent = async (req, res) => {
  try {
    const bannerContent = await bannersCollection.findOne();
    res.status(200).json(bannerContent || {});
  } catch (error) {
    console.error("BannerContent fetch error:", error);
    res
      .status(500)
      .json({ message: "Server error: Unable to fetch Banner content" });
  }
};

exports.uploadBannerImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const filePath = `/uploads/banner/${req.file.filename}`;

    const banner = await bannersCollection.findOneAndUpdate(
      {},
      { $push: { bannerPaths: filePath } },
      { new: true, upsert: true }
    );

    res.status(201).json({ filePath, banner });
  } catch (error) {
    console.error("Error uploading banner:", error);
    res.status(500).json({ message: "Server error: Unable to upload banner" });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await bannersCollection.find({}, "bannerPaths");
    if (banners.length === 0)
      return res.status(404).json({ message: "No banners found" });

    const imagePaths = banners.flatMap((banner) => banner.bannerPaths);
    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Server error: Unable to fetch banners" });
  }
};

exports.deleteBannerImage = async (req, res) => {
  const { filePath } = req.body;
  if (!filePath)
    return res.status(400).json({ message: "File path is required" });

  try {
    await bannersCollection.updateOne({}, { $pull: { bannerPaths: filePath } });

    const absolutePath = path.join(__dirname, "..", filePath);
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);

    res.status(200).json({ message: "Banner image deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner image:", error);
    res
      .status(500)
      .json({ message: "Server error: Unable to delete banner image" });
  }
};
