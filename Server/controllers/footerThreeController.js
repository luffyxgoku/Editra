const fs = require("fs");
const path = require("path");
const footersCollectionThree = require("../models/FooterThree");

exports.getFooterThree = async (req, res) => {
  try {
    const footer = await footersCollectionThree.findOne();
    if (!footer) {
      return res.status(404).json({ message: "No footer data found" });
    }
    res.status(200).json({ footer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postFooterThree = async (req, res) => {
  const { heading, details } = req.body;

  try {
    let footer = await footersCollectionThree.findOne();

    const parsedDetails = details ? JSON.parse(details) : {};

    const uploadedFiles = {
      addressPath:
        req.files["addressPath"]?.[0]?.path || footer?.details.addressPath,
      phonePath: req.files["phonePath"]?.[0]?.path || footer?.details.phonePath,
      emailPath: req.files["emailPath"]?.[0]?.path || footer?.details.emailPath,
    };

    if (footer) {
      ["addressPath", "phonePath", "emailPath"].forEach((field) => {
        if (req.files[field] && footer.details[field]) {
          const oldFilePath = path.join(__dirname, "..", footer.details[field]);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath); // Delete old file
          }
        }
      });

      footer.heading = heading;
      footer.details = { ...parsedDetails, ...uploadedFiles };

      await footer.save();
    } else {
      footer = await footersCollectionThree.create({
        heading,
        details: { ...parsedDetails, ...uploadedFiles },
      });
    }
    res.json({ message: "Footer column updated successfully!", footer });
  } catch (error) {
    res.status(500).json({ message: "Failed to update footer column", error });
  }
};

exports.deleteFooterThree = async (req, res) => {
  try {
    const footer = await footersCollectionThree.findOne();
    if (!footer) {
      return res.status(404).json({ message: "No footer data found" });
    }
    await footersCollectionThree.deleteOne();
    res.json({ message: "Footer column deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting footer:", error);
    res.status(500).json({ message: "Failed to delete footer column", error });
  }
};
