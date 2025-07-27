const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_ACC,
    pass: process.env.APP_PASS,
  },
});

module.exports = transporter;
