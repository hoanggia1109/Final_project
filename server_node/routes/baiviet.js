

const express = require("express");
const mysql = require("mysql2/promise");
const router = express.Router();

// Tạo pool kết nối
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "shopnoithat",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// Lấy tất cả bài viết
router.get("/", async (_, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        bv.id, 
        bv.tieude, 
        bv.hinh_anh AS thumbnail, 
        0 AS luotxem, 
        bv.created_at,
        dm.tendanhmuc AS danh_muc,
        u.email AS tacgia   -- dùng email thay vì hoten
      FROM bai_viet bv
      LEFT JOIN danhmuc_baiviet dm ON dm.id = bv.danhmuc_baiviet_id
      LEFT JOIN nguoi_dung u ON u.id = bv.user_id
      WHERE bv.anhien = 1
      ORDER BY bv.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Ví dụ: router.js (Giả sử bạn đã có pool kết nối đến database)

// Lấy chi tiết bài viết theo ID VÀ TĂNG LƯỢT XEM
router.get("/chitiet/:id", async (req, res) => {
  const baiVietId = req.params.id;

  try {
    // 🔍 Lấy chi tiết bài viết
    const [rows] = await pool.query(
      `
        SELECT 
          bv.id, 
          bv.tieude, 
          bv.noidung, 
          bv.hinh_anh AS thumbnail, 
          0 AS luotxem,
          bv.created_at,
          dm.tendanhmuc AS danh_muc,
          u.email AS tacgia
        FROM bai_viet bv
        LEFT JOIN danhmuc_baiviet dm ON dm.id = bv.danhmuc_baiviet_id
        LEFT JOIN nguoi_dung u ON u.id = bv.user_id
        WHERE bv.id = ? AND bv.anhien = 1
        LIMIT 1
      `,
      [baiVietId]
    );

    // Kiểm tra nếu không có bài viết
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Bài viết không tồn tại hoặc chưa được hiển thị" });
    }

    const baiVietChiTiet = rows[0];
    baiVietChiTiet.noidung = baiVietChiTiet.noidung || ""; // tránh lỗi null

    return res.json(baiVietChiTiet);
  } catch (err) {
    console.error(" Lỗi server khi lấy chi tiết bài viết:", err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


// module.exports = router; // Đừng quên export router

// 3️⃣ Lấy tất cả danh mục bài viết
router.get("/danhmucbaiviet/all", async (_, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        tendanhmuc, 
        mota, 
        created_at, 
        updated_at
      FROM danhmuc_baiviet
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
