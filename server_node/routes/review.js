const express = require("express");

const multer = require("multer");

const path = require("path");

const { v4: uuidv4 } = require("uuid");

const { auth } = require("../middleware/auth");

const {

  DanhGiaModel,

  ReviewImageModel,

  DonHangModel,

  DonHangChiTietModel,

  SanPhamBienTheModel,

  SanPhamModel,

} = require("../database");



const router = express.Router();



/* ------------------- CẤU HÌNH MULTER ------------------- */

const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, "uploads/reviews"),

  filename: (req, file, cb) => {

    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));

  },

});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });



/* ------------------- TẠO REVIEW ------------------- */

router.post("/", auth, upload.array("images", 5), async (req, res) => {

  try {

    console.log("[Review] Request body:", req.body);
    console.log("[Review] Request files:", req.files ? req.files.length : 0);
    
    const { chitiet_donhang_id, rating, binhluan } = req.body;
    
    if (!chitiet_donhang_id) {
      return res.status(400).json({ message: "Thiếu chitiet_donhang_id" });
    }
    
    if (!rating) {
      return res.status(400).json({ message: "Thiếu rating" });
    }
    
    console.log("[Review] Creating review with:", { chitiet_donhang_id, rating, binhluan, user_id: req.user.id });



    // Kiểm tra user có sở hữu chi tiết đơn hàng này không

    const chiTiet = await DonHangChiTietModel.findOne({

      where: { id: chitiet_donhang_id },

      include: [{ model: DonHangModel, as: "donhang" }],

    });
    
    console.log("[Review] Found chiTiet:", chiTiet ? chiTiet.id : "null");



    if (!chiTiet)

      return res.status(404).json({ message: "Không tìm thấy chi tiết đơn hàng" });



    if (chiTiet.donhang.user_id !== req.user.id)

      return res.status(403).json({ message: "Bạn không có quyền đánh giá đơn hàng này" });



    if (chiTiet.donhang.trangthai !== "delivered")

      return res.status(400).json({ message: "Chỉ được đánh giá sau khi đơn hàng đã giao thành công" });



    // Kiểm tra xem đã có review cho chitiet_donhang_id này chưa
    const existingReview = await DanhGiaModel.findOne({
      where: {
        user_id: req.user.id,
        chitiet_donhang_id: chitiet_donhang_id,
      },
    });
    
    if (existingReview) {
      console.log("[Review] Review already exists for chitiet_donhang_id:", chitiet_donhang_id);
      return res.status(400).json({ 
        message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi" 
      });
    }

    // Tạo đánh giá - Lấy bienthe_id từ chi tiết đơn hàng
    const bienthe_id = chiTiet.bienthe_id;
    
    if (!bienthe_id) {
      return res.status(400).json({ message: "Không tìm thấy biến thể sản phẩm trong chi tiết đơn hàng" });
    }
    
    console.log("[Review] Creating review with bienthe_id:", bienthe_id);
    const review = await DanhGiaModel.create({

      id: uuidv4(),

      user_id: req.user.id,

      chitiet_donhang_id, // Lưu chitiet_donhang_id để biết review thuộc về đơn hàng nào

      bienthe_id, // Vẫn cần bienthe_id vì database có foreign key constraint

      rating,

      binhluan,

    });
    
    console.log("[Review] Review created successfully:", review.id);



    // Lưu ảnh nếu có

    if (req.files && req.files.length > 0) {

      const images = req.files.map((file) => ({

        id: uuidv4(),

        danhgia_id: review.id,

        url: `http://localhost:3000/uploads/reviews/${file.filename}`,

      }));

      await ReviewImageModel.bulkCreate(images);

      review.dataValues.hinhanh = images;

    }



    res.json({ message: "Thêm đánh giá thành công", review });

  } catch (err) {

    console.error("[Review] Lỗi tạo đánh giá:", err);
    console.error("[Review] Error details:", {
      message: err.message,
      name: err.name,
      sql: err.sql,
      original: err.original,
      stack: err.stack
    });

    // Kiểm tra nếu lỗi là do thiếu cột trong database
    if (err.message && err.message.includes("Unknown column")) {
      return res.status(500).json({ 
        message: "Database chưa được cập nhật. Vui lòng chạy migration script để thêm cột chitiet_donhang_id vào bảng danh_gia",
        error: err.message
      });
    }

    res.status(500).json({ 
      message: "Lỗi server", 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });

  }

});



/* ------------------- LẤY REVIEW THEO SẢN PHẨM ------------------- */

router.get("/sanpham/:sanpham_id", async (req, res) => {

  try {

    const reviews = await DanhGiaModel.findAll({

      include: [

        {

          model: DonHangChiTietModel,

          as: "chitiet_donhang",

          required: true, // Phải có chitiet_donhang

          include: [

            {

              model: SanPhamBienTheModel,

              as: "bienthe",

              required: true, // Phải có bienthe

              where: { sanpham_id: req.params.sanpham_id }, // Filter theo sanpham_id

              include: [{ model: SanPhamModel, as: "sanpham", required: false }],

            },

          ],

        },

        { 

          model: ReviewImageModel, 

          as: "hinhanh",

          required: false // Images là optional

        },

      ],

      order: [["created_at", "DESC"]],

    });



    // Convert Sequelize instances to plain objects
    const plainReviews = reviews.map(review => {
      const plain = review.get({ plain: true });
      // Đảm bảo hinhanh là array ngay cả khi null
      if (!plain.hinhanh) {
        plain.hinhanh = [];
      }
      return plain;
    });

    console.log(`[Review] Found ${plainReviews.length} reviews for product ${req.params.sanpham_id}`);
    res.json(plainReviews);

  } catch (err) {

    console.error("Lỗi lấy review:", err);
    
    // Nếu lỗi do bảng không tồn tại, vẫn cố lấy reviews không có images
    if (err.message && err.message.includes("hinhanh_danhgia")) {
      console.log("⚠️ Bảng hinhanh_danhgia chưa tồn tại, lấy reviews không có images");
      try {
        const reviewsWithoutImages = await DanhGiaModel.findAll({

          include: [

            {

              model: DonHangChiTietModel,

              as: "chitiet_donhang",

              required: false,

              include: [

                {

                  model: SanPhamBienTheModel,

                  as: "bienthe",

                  required: false,

                  where: { sanpham_id: req.params.sanpham_id },

                  include: [{ model: SanPhamModel, as: "sanpham", required: false }],

                },

              ],

            },

          ],

          order: [["created_at", "DESC"]],

        });

        const plainReviews = reviewsWithoutImages.map(review => {
          const plain = review.get({ plain: true });
          plain.hinhanh = []; // Set empty array cho images
          return plain;
        });

        return res.json(plainReviews);
      } catch (fallbackErr) {
        console.error("Lỗi fallback:", fallbackErr);
      }
    }

    res.status(500).json({ message: "Lỗi server", error: err.message });

  }

});



/* ------------------- CẬP NHẬT REVIEW ------------------- */

router.put("/:id", auth, upload.array("images", 5), async (req, res) => {

  try {

    const { rating, binhluan } = req.body;

    const rv = await DanhGiaModel.findByPk(req.params.id);



    if (!rv) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    if (rv.user_id !== req.user.id)

      return res.status(403).json({ message: "Không có quyền sửa đánh giá này" });



    rv.rating = rating;

    rv.binhluan = binhluan;

    await rv.save();



    // Cập nhật ảnh nếu có

    if (req.files && req.files.length > 0) {

      await ReviewImageModel.destroy({ where: { danhgia_id: rv.id } });

      const imgs = req.files.map((f) => ({

        id: uuidv4(),

        danhgia_id: rv.id,

        url: `http://localhost:3000/uploads/reviews/${f.filename}`,

      }));

      await ReviewImageModel.bulkCreate(imgs);

      rv.dataValues.hinhanh = imgs;

    }



    res.json({ message: "Cập nhật đánh giá thành công", review: rv });

  } catch (err) {

    res.status(500).json({ message: "Lỗi server", error: err.message });

  }

});



// ---------------TRUNG BÌNH RATING---------------------

router.get("/:sanpham_id/average", async (req, res) => {

  try {

    const sanphamId = req.params.sanpham_id;

    console.log(`[Review Average] Calculating average for product: ${sanphamId}`);

    const reviews = await DanhGiaModel.findAll({

      include: [

        {

          model: DonHangChiTietModel,

          as: "chitiet_donhang",

          required: true, // Phải có chitiet_donhang

          include: [

            {

              model: require("../database").SanPhamBienTheModel,

              as: "bienthe",

              required: true, // Phải có bienthe

              where: { sanpham_id: sanphamId }, // Filter chính xác theo sanpham_id

            },

          ],

        },

      ],

    });

    console.log(`[Review Average] Found ${reviews.length} reviews for product ${sanphamId}`);

    if (!reviews.length) {
      console.log(`[Review Average] No reviews found for product ${sanphamId}`);
      return res.json({ sanpham_id: sanphamId, average_rating: 0, count: 0 });
    }

    // Đảm bảo chỉ tính reviews có rating hợp lệ và thuộc về sản phẩm đúng
    const validReviews = reviews.filter(r => {
      // Kiểm tra rating hợp lệ
      if (!r.rating || r.rating <= 0 || r.rating > 5) return false;
      
      // Kiểm tra bienthe có sanpham_id đúng không (double check)
      if (r.chitiet_donhang && r.chitiet_donhang.bienthe) {
        return r.chitiet_donhang.bienthe.sanpham_id === sanphamId;
      }
      return false;
    });
    
    if (!validReviews.length) {
      console.log(`[Review Average] No valid reviews found for product ${sanphamId}`);
      return res.json({ sanpham_id: sanphamId, average_rating: 0, count: 0 });
    }

    const total = validReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const average = Number((total / validReviews.length).toFixed(1));

    console.log(`[Review Average] Product ${sanphamId}: ${validReviews.length} valid reviews, average: ${average}`);

    res.json({

      sanpham_id: sanphamId,

      average_rating: average,

      count: validReviews.length,

    });

  } catch (err) {

    console.error(" Lỗi tính trung bình rating sản phẩm:", err);

    res.status(500).json({ message: "Lỗi server", error: err.message });

  }

});



/* ------------------- XÓA REVIEW ------------------- */

router.delete("/:id", auth, async (req, res) => {

  try {

    const rv = await DanhGiaModel.findByPk(req.params.id);

    if (!rv) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    if (rv.user_id !== req.user.id)

      return res.status(403).json({ message: "Không có quyền xóa đánh giá này" });



    await ReviewImageModel.destroy({ where: { danhgia_id: rv.id } });

    await rv.destroy();



    res.json({ message: "Đã xóa đánh giá" });

  } catch (err) {

    res.status(500).json({ message: "Lỗi server", error: err.message });

  }

});



module.exports = router;
