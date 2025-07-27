const express = require("express");
const {
  registerUser,
  signinUser,
  signoutUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/signin", signinUser);
router.post("/users/signout", signoutUser);

module.exports = router;
