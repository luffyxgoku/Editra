const sociallinksCollection = require("../models/SocialLink");
const path = require("path");
const fs = require("fs");

exports.getSocialLinks = async (req, res) => {
  try {
    const socialLinks = await sociallinksCollection.findOne();
    if (!socialLinks) {
      return res.status(404).json({ message: "No social links found" });
    }
    res.status(200).json(socialLinks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postSocialLink = async (req, res) => {
  const { link } = req.body;
  const file = req.file;

  if (!file || !link) {
    return res.status(400).json({ message: "File and link are required" });
  }

  try {
    let socialLinksEntry = await sociallinksCollection.findOne();

    if (!socialLinksEntry) {
      socialLinksEntry = await sociallinksCollection.create({
        links: [{ filePath: `uploads/sociallink/${file.filename}`, link }],
      });
    } else {
      const existingIndex = socialLinksEntry.links.findIndex(
        (item) => item.link === link
      );

      if (existingIndex !== -1) {
        const prevFilePath = path.join(
          __dirname,
          "..",
          socialLinksEntry.links[existingIndex].filePath
        );
        if (fs.existsSync(prevFilePath)) {
          fs.unlinkSync(prevFilePath);
        }

        socialLinksEntry.links[existingIndex] = {
          filePath: `uploads/sociallink/${file.filename}`,
          link,
        };
      } else {
        socialLinksEntry.links.push({
          filePath: `uploads/sociallink/${file.filename}`,
          link,
        });
      }

      await socialLinksEntry.save();
    }

    res.json({
      message: "Social link updated successfully!",
      socialLinks: socialLinksEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update social link", error });
  }
};

exports.deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;

    let socialLinksEntry = await sociallinksCollection.findOne();
    if (!socialLinksEntry) {
      return res.status(404).json({ message: "No social links found" });
    }

    const linkIndex = socialLinksEntry.links.findIndex(
      (link) => link._id.toString() === id
    );

    if (linkIndex === -1) {
      return res.status(404).json({ message: "Social link not found" });
    }

    const filePathToDelete = path.join(
      __dirname,
      "..",
      socialLinksEntry.links[linkIndex].filePath
    );

    socialLinksEntry.links.splice(linkIndex, 1);

    await socialLinksEntry.save();

    if (fs.existsSync(filePathToDelete)) {
      fs.unlinkSync(filePathToDelete);
    }

    res.json({
      message: "Social link deleted successfully!",
      socialLinks: socialLinksEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete social link", error });
  }
};
