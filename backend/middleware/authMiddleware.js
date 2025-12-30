require("dotenv").config();

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("JWT_SECRET (VERIFY):", process.env.JWT_SECRET);

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    console.log("AUTH HEADER:", req.headers.authorization);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
