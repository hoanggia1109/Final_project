const express = require("express");
const { ReviewModel } = require("../database");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { bienthe_id, rating, binhluan } = req.body;
  const rv = await ReviewModel.create({
    id: uuidv4(),
    user_id: req.user.id,
    bienthe_id,
    rating,
    binhluan,
  });
  res.json(rv);
});

router.get("/:bienthe_id", async (req, res) => {
  const rv = await ReviewModel.findAll({ where: { bienthe_id: req.params.bienthe_id } });
  res.json(rv);
});

router.delete("/:id", auth, async (req, res) => {
  await ReviewModel.destroy({ where: { id: req.params.id } });
  res.json({ message: "Đã xóa đánh giá" });
});

module.exports = router;