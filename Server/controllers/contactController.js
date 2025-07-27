const contactsCollection = require("../models/Contact");
const fs = require("fs");
const path = require("path");

exports.addOrUpdateContact = async (req, res) => {
  const { address, phone, email } = req.body;
  const contactPath = req.files["contactPath"]?.[0]?.path || "";
  const addressPath = req.files["addressPath"]?.[0]?.path || "";
  const phonePath = req.files["phonePath"]?.[0]?.path || "";
  const emailPath = req.files["emailPath"]?.[0]?.path || "";

  try {
    let contact = await contactsCollection.findOne();

    if (contact) {
      if (contactPath && contact.contactPath)
        fs.unlinkSync(contact.contactPath);
      if (addressPath && contact.details.addressPath)
        fs.unlinkSync(contact.details.addressPath);
      if (phonePath && contact.details.phonePath)
        fs.unlinkSync(contact.details.phonePath);
      if (emailPath && contact.details.emailPath)
        fs.unlinkSync(contact.details.emailPath);

      contact.contactPath = contactPath || contact.contactPath;
      contact.details.address = address || contact.details.address;
      contact.details.addressPath = addressPath || contact.details.addressPath;
      contact.details.phone = phone || contact.details.phone;
      contact.details.phonePath = phonePath || contact.details.phonePath;
      contact.details.email = email || contact.details.email;
      contact.details.emailPath = emailPath || contact.details.emailPath;

      await contact.save();
      return res
        .status(200)
        .json({ message: "Contact updated successfully", contact });
    } else {
      contact = await contactsCollection.create({
        contactPath,
        details: { address, addressPath, phone, phonePath, email, emailPath },
      });
      return res
        .status(201)
        .json({ message: "Contact added successfully", contact });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await contactsCollection.findOne();
    if (!contact) {
      return res.status(404).json({ message: "No contact data found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await contactsCollection.findOne();
    if (!contact) {
      return res.status(404).json({ message: "No contact found" });
    }

    // Delete stored files
    const filePaths = [
      contact.contactPath,
      contact.details?.addressPath,
      contact.details?.phonePath,
      contact.details?.emailPath,
    ].filter(Boolean); // Remove undefined or empty values

    filePaths.forEach((file) => {
      const absolutePath = path.join(__dirname, "..", file); // Ensure correct path
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    });

    await contactsCollection.deleteOne({ _id: contact._id });

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
