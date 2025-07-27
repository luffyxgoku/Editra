const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Demo1");
    console.log("SERVER connected to Demo1DB");
  } catch (err) {
    console.log("ERROR: ", err);
  }
};

module.exports = connectDB;
