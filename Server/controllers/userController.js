const usersCollection = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const KEY = process.env.KEY;

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Bad Request: All fields are required" });

  try {
    const userExist = await usersCollection.findOne({ email });
    if (userExist)
      return res
        .status(409)
        .json({ message: "Conflict: User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await usersCollection.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, KEY);
    return res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ message: "USER REGISTERED SUCCESSFULLY", user });
  } catch (error) {
    console.error("User REGISTRATION error:", error);
    res
      .status(500)
      .json({ message: "Server error: Unable to create and Register USER" });
  }
};

exports.signinUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Bad Request: Email and password are required" });

  try {
    const user = await usersCollection.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "Not Found: No user exists with this email" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res
        .status(401)
        .json({ message: "Unauthorized: Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, KEY);
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "USER SIGNED IN SUCCESSFULLY", user });
  } catch (error) {
    console.error("User signin error:", error);
    res.status(500).json({ message: "Server error: Unable to sign in user" });
  }
};

exports.signoutUser = (req, res) => {
  res
    .clearCookie("token", { httpOnly: true })
    .status(200)
    .json({ message: "USER SIGNOUT SUCCESSFUL" });
};
