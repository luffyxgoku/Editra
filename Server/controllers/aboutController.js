const aboutsCollection = require("../models/About");
const path = require("path");
const fs = require("fs");

exports.uploadAboutImage = async (req, res) => {
  const sectionId = req.body.sectionId;

  if (!req.file || !req.body.sectionId) {
    return res
      .status(400)
      .json({ message: "No file uploaded or section ID missing" });
  }

  try {
    const newFilePath = `/uploads/about/${req.file.filename}`;

    let section = await aboutsCollection.findOne({ sectionId });

    if (section) {
      if (section.filePath) {
        const oldImagePath = path.join(__dirname, section.filePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      section.filePath = newFilePath;
      await section.save();
    } else {
      section = new aboutsCollection({ sectionId, filePath: newFilePath });
      await section.save();
    }

    res.json({
      message: "File uploaded successfully",
      filePath: newFilePath,
      section,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAboutImage = async (req, res) => {
  try {
    const section = await aboutsCollection.findOne({
      sectionId: req.params.sectionId,
    });
    if (!section || !section.filePath) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json({ filePath: section.filePath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrUpdateAboutContent = async (req, res) => {
  const { sectionId, heading, paragraph } = req.body;

  try {
    let section = await aboutsCollection.findOne({ sectionId });

    if (section) {
      section.heading = heading;
      section.paragraph = paragraph;
      await section.save();
    } else {
      section = new aboutsCollection({ sectionId, heading, paragraph });
      await section.save();
    }

    res.json({ message: "About content updated successfully", section });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAboutContent = async (req, res) => {
  try {
    const section = await aboutsCollection.findOne({
      sectionId: req.params.sectionId,
    });
    if (!section) return res.status(404).json({ message: "Section not found" });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAboutImage = async (req, res) => {
  const sectionId = req.params.sectionId;

  try {
    let section = await aboutsCollection.findOne({ sectionId });

    if (!section || !section.filePath) {
      return res.status(404).json({ message: "File not found in database" });
    }

    // const filePath = path.join(__dirname, section.filePath);
    const filePath = path.join(__dirname, "..", section.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    section.filePath = undefined;
    await section.save();

    res.json({ message: "File deleted from server and database", sectionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
