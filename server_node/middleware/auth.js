const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ message: "Thiếu token" });
  try {
    req.user = jwt.verify(token, "SECRET_KEY");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = { auth };