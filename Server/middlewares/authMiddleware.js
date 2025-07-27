const jwt = require("jsonwebtoken");

const KEY = process.env.KEY;

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided or token expired" });

    jwt.verify(token, KEY, (err, decodedUserData) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid or expired token" });
      }
      req.user = decodedUserData;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error: Unable to verify token" });
  }
};

module.exports = authenticate;
