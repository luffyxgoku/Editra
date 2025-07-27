const footersCollectionOne = require("../models/Footer");
const path = require("path");
const fs = require("fs");

exports.postFooter = async (req, res) => {
  try {
    const { heading, description } = req.body;
    const existingFooter = await footersCollectionOne.findOne();
    let footerPath = existingFooter?.footerPath || "";

    if (req.file) {
      if (existingFooter?.footerPath) {
        const filePath = path.join(__dirname, existingFooter.footerPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      footerPath = req.file.path;
    }

    if (existingFooter) {
      const updatedFooter = await footersCollectionOne.findOneAndUpdate(
        { _id: existingFooter._id },
        {
          $set: {
            footerPath,
            "columnOne.heading": heading || existingFooter.columnOne.heading,
            "columnOne.description":
              description || existingFooter.columnOne.description,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Footer updated successfully",
        footer: updatedFooter,
      });
    }

    const footer = await footersCollectionOne.create({
      footerPath,
      columnOne: { heading, description },
    });
    res.status(201).json({ message: "Footer posted successfully", footer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFooter = async (req, res) => {
  try {
    const footer = await footersCollectionOne.findOne();
    if (!footer)
      return res.status(404).json({ message: "No footer data found" });
    res.status(200).json({
      footerPath: footer.footerPath,
      heading: footer.columnOne.heading,
      description: footer.columnOne.description,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFooter = async (req, res) => {
  try {
    const existingFooter = await footersCollectionOne.findOne();
    if (!existingFooter)
      return res.status(404).json({ message: "Footer not found" });

    if (existingFooter.footerPath) {
      const filePath = path.join(__dirname, "..", existingFooter.footerPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await footersCollectionOne.deleteOne({ _id: existingFooter._id });
    res.json({ message: "Footer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
