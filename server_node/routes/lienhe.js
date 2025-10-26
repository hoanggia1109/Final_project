const express = require("express");
const { LienHeModel } = require("../database");
const router = express.Router();

router.post("/", async (req, res) => {
  const lh = await LienHeModel.create(req.body);
  res.json({ message: "Gửi liên hệ thành công", lh });
});


module.exports = router;