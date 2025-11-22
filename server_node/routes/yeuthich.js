// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require("jsonwebtoken");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { YeuThichModel, SanPhamModel, SanPhamBienTheModel, ImageModel, LoaiModel, ThuongHieuModel } = require("../database");

const router = express.Router();

// Middleware xác thực token
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Thiếu header Authorization" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// GET /api/yeuthich - Lấy danh sách sản phẩm yêu thích
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await YeuThichModel.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: SanPhamModel,
          as: "sanpham",
          include: [
            {
              model: SanPhamBienTheModel,
              as: "bienthe",
              include: [
                {
                  model: ImageModel,
                  as: "images",
                  limit: 1,
                },
              ],
              limit: 1,
            },
            {
              model: LoaiModel,
              as: "danhmuc",
            },
            {
              model: ThuongHieuModel,
              as: "thuonghieu",
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(wishlist);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/yeuthich - Thêm sản phẩm vào yêu thích
router.post("/", auth, async (req, res) => {
  try {
    const { sanpham_id } = req.body;

    if (!sanpham_id) {
      return res.status(400).json({ message: "Thiếu sanpham_id" });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await SanPhamModel.findByPk(sanpham_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra đã có trong wishlist chưa
    const existing = await YeuThichModel.findOne({
      where: { user_id: req.userId, sanpham_id },
    });

    if (existing) {
      return res.status(400).json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
    }

    // Thêm vào wishlist
    const newWishlistItem = await YeuThichModel.create({
      id: uuidv4(),
      user_id: req.userId,
      sanpham_id,
    });

    res.json({
      message: "Đã thêm vào danh sách yêu thích",
      wishlistItem: newWishlistItem,
    });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/yeuthich/:sanpham_id - Xóa sản phẩm khỏi yêu thích
router.delete("/:sanpham_id", auth, async (req, res) => {
  try {
    const { sanpham_id } = req.params;

    const wishlistItem = await YeuThichModel.findOne({
      where: { user_id: req.userId, sanpham_id },
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: "Sản phẩm không có trong danh sách yêu thích" });
    }

    await wishlistItem.destroy();

    res.json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/yeuthich - Xóa tất cả sản phẩm yêu thích
router.delete("/", auth, async (req, res) => {
  try {
    await YeuThichModel.destroy({
      where: { user_id: req.userId },
    });

    res.json({ message: "Đã xóa tất cả sản phẩm yêu thích" });
  } catch (err) {
    console.error("Error clearing wishlist:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/yeuthich/check/:sanpham_id - Kiểm tra sản phẩm có trong wishlist không
router.get("/check/:sanpham_id", auth, async (req, res) => {
  try {
    const { sanpham_id } = req.params;

    const wishlistItem = await YeuThichModel.findOne({
      where: { user_id: req.userId, sanpham_id },
    });

    res.json({ isWishlisted: !!wishlistItem });
  } catch (err) {
    console.error("Error checking wishlist:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

