const headingsCollection = require("../models/Heading");

exports.createOrUpdateHeadings = async (req, res) => {
  try {
    const { field, value } = req.body; // Example: { field: "copyrightHeading", value: "New text" }

    if (!field || value === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const updateQuery = { $set: { [field]: value } };

    const updatedHeadings = await headingsCollection.findOneAndUpdate(
      {},
      updateQuery,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: `Heading "${field}" updated successfully`,
      data: updatedHeadings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHeadings = async (req, res) => {
  try {
    const headings = await headingsCollection.findOne(); // Since it's a single document
    if (!headings) {
      return res
        .status(404)
        .json({ success: false, message: "No headings found" });
    }
    res.status(200).json({ success: true, data: headings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHeadingField = async (req, res) => {
  const { field } = req.params; // Example: 'aboutHeading'
  try {
    const updateQuery = { $unset: { [field]: 1 } }; // Remove only the specific field
    const updatedHeadings = await headingsCollection.findOneAndUpdate(
      {},
      updateQuery,
      { new: true }
    );

    if (!updatedHeadings) {
      return res
        .status(404)
        .json({ success: false, message: "Heading not found" });
    }

    res.status(200).json({
      success: true,
      message: `Heading "${field}" deleted successfully`,
      data: updatedHeadings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
