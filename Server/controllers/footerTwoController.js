const footersCollectionTwo = require("../models/FooterTwo");

exports.getFooterTwo = async (req, res) => {
  try {
    const footer = await footersCollectionTwo.findOne();
    if (!footer) {
      return res.status(404).json({ message: "No footer data found" });
    }
    res.status(200).json({
      heading: footer.heading,
      links: footer.links,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postFooterTwo = async (req, res) => {
  const { heading, links } = req.body;

  try {
    let footer = await footersCollectionTwo.findOne();

    if (footer) {
      footer.heading = heading;
      footer.links = links;
      await footer.save();
    } else {
      footer = await footersCollectionTwo.create({ heading, links });
    }
    res.json({ message: "Footer column updated successfully!", footer });
  } catch (error) {
    res.status(500).json({ message: "Failed to update footer column", error });
  }
};

exports.deleteFooterTwo = async (req, res) => {
  try {
    const footer = await footersCollectionTwo.findOne();
    if (!footer) {
      return res.status(404).json({ message: "No footer data found" });
    }
    await footersCollectionTwo.deleteOne();
    res.json({ message: "Footer column deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting footer:", error);
    res.status(500).json({ message: "Failed to delete footer column", error });
  }
};
