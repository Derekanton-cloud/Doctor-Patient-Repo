// middleware/adminAuth.js
const jwt = require("jsonwebtoken");

exports.adminAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
