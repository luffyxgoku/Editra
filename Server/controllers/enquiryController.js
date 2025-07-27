const enquiriesCollection = require("../models/Enquiry");
const transporter = require("../config/emailConfig");

exports.postEnquiry = async (req, res) => {
  const { name, email, phone, msg } = req.body;
  if (!name || !email || !phone || !msg) {
    return res.status(400).json({ message: "All Fields are Required" });
  }
  try {
    const enquiry = await enquiriesCollection.create({
      name,
      email,
      phone,
      msg,
    });

    const ownerMailOptions = {
      from: process.env.APP_ACC,
      to: process.env.ADMIN_ACC,
      subject: "New Enquiry Received",
      text: `A new enquiry has been submitted:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${msg}`,
      html: `
        <h1>New Enquiry Received With Details:</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${msg}</p>
      `,
    };

    const userMailOptions = {
      from: process.env.APP_ACC,
      to: email,
      subject: "Thank You for Your Enquiry",
      text: `Dear ${name},\n\nThank you for contacting us. We have received your enquiry and will get back to you shortly.\n\nBest regards,\nThe Team`,
      html: `
        <h1>Thank You for Your Enquiry</h1>
        <p>Dear ${name},</p>
        <p>Thank you for contacting us. We have received your enquiry and will get back to you shortly.</p>
        <p>Best regards,<br>The Team</p>
      `,
    };

    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(userMailOptions);

    return res.status(201).json({ message: "Enquriy Posted Successfully" });
  } catch (error) {
    console.error("Enquiry creation error:", error);
    res.status(500).json({ message: "Server error: Unable to create Enquiry" });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiriesCollection.find({});
    if (!enquiries || enquiries.length === 0) {
      return res.status(200).json({ message: "No enquiries found" });
    }
    res
      .status(200)
      .json({ message: "Enquiries retrieved successfully", enquiries });
  } catch (error) {
    console.error("Enquiries Retrieval error:", error);
    res.status(500).json({ message: "Server error: Unable to get ENQUIRIES" });
  }
};

exports.deleteEnquiry = async (req, res) => {
  const { id } = req.params;
  try {
    const enquiry = await enquiriesCollection.findById(id);
    if (!enquiry) {
      return res.status(400).json({ message: "Enquiry not found" });
    }
    await enquiriesCollection.deleteOne({ _id: id });
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Enquiry Deletion error:", error);
    res.status(500).json({ message: "Server error: Unable to delete ENQUIRY" });
  }
};
