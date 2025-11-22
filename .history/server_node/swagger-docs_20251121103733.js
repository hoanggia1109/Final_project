/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Xác thực và quản lý tài khoản người dùng
 *   - name: Sản phẩm
 *     description: Hiển thị và tìm kiếm sản phẩm
 *   - name: Danh mục
 *     description: Quản lý danh mục sản phẩm
 *   - name: Giỏ hàng
 *     description: Xử lý giỏ hàng người dùng
 *   - name: Đơn hàng
 *     description: Quản lý đơn hàng của người dùng
 *   - name: Review
 *     description: Đánh giá sản phẩm
 *   - name: Mã giảm giá
 *     description: Mã khuyến mãi và giảm giá
 *   - name: Bài viết
 *     description: Tin tức, bài viết nội thất
 *   - name: Liên hệ
 *     description: Gửi liên hệ, góp ý
 *   - name: Upload
 *     description: Upload ảnh sản phẩm
 */

/* ===================== AUTH ===================== */
/**
 * @swagger
 * /api/auth/dangky:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 */

/**
 * @swagger
 * /api/auth/dangnhap:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token JWT
 */

/**
 * @swagger
 * /api/auth/quenpass:
 *   post:
 *     summary: Quên mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: Đã gửi mật khẩu mới qua email
 */

/**
 * @swagger
 * /api/auth/doipass:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pass_old:
 *                 type: string
 *               pass_new1:
 *                 type: string
 *               pass_new2:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */

/* ===================== SẢN PHẨM ===================== */
/**
 * @swagger
 * /api/sanpham:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/sanpham/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 */

/**
 * @swagger
 * /api/sanpham/timkiem:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tên
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách kết quả
 */

/**
 * @swagger
 * /api/sanpham/trongloai/{id}:
 *   get:
 *     summary: Lấy danh sách sản phẩm trong danh mục
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

// =============THUONG HIEU========================
/**
 * @swagger
 * /api/thuonghieu:
 *   get:
 *     summary: Lấy danh sách thương hiệu hiển thị
 *     tags: [Thương hiệu]
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   tenbrand:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   anhien:
 *                     type: integer
 */
/**
 * @swagger
 * /api/sanpham/thuonghieu/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo thương hiệu
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/sanpham/hot:
 *   get:
 *     summary: Lấy danh sách sản phẩm bán chạy
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/sanpham/moi:
 *   get:
 *     summary: Lấy danh sách sản phẩm mới
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/sanpham/xemnhieu:
 *   get:
 *     summary: Lấy top sản phẩm xem nhiều
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/sanpham/giamgia:
 *   get:
 *     summary: Lấy sản phẩm đang có mã giảm giá
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Thành công
 */

/* ===================== GIỎ HÀNG ===================== */
/**
 * @swagger
 * /api/giohang:
 *   get:
 *     summary: Xem giỏ hàng của người dùng
 *     tags: [Giỏ hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm trong giỏ hàng
 */

/**
 * @swagger
 /**
 * @swagger
 * /api/giohang:
 *   post:
 *     summary: Thêm nhiều sản phẩm vào giỏ hàng
 *     tags: [Giỏ hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 bienthe_id:
 *                   type: string
 *                 soluong:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Thêm nhiều sản phẩm thành công
 */

 /**
 * @swagger
 * /api/giohang/{id}:
 *   put:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [Giỏ hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm trong giỏ hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soluong:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật số lượng thành công
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */

/**
 * @swagger
 * /api/giohang/{id}:
 *   delete:
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     tags: [Giỏ hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm trong giỏ hàng
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ hàng thành công
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */

/* ===================== ĐƠN HÀNG ===================== */
/**
 * @swagger
 * tags:
 *   - name: Đơn hàng
 *     description: Quản lý và xử lý đơn hàng người dùng
 */

/**
 * @swagger
 /**
 * @swagger
 * /api/donhang:
 *   post:
 *     summary: Tạo đơn hàng từ giỏ hàng người dùng
 *     description: Tạo mới đơn hàng từ giỏ hàng hiện tại của user, có thể áp dụng mã giảm giá và phí vận chuyển.
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diachi_id:
 *                 type: string
 *                 example: "0e55aa1b-b321-11f0-b695-2a4b22e88692"
 *               ghichu:
 *                 type: string
 *                 example: "Giao hàng trong giờ hành chính"
 *               magiamgia_code:
 *                 type: string
 *                 example: "SALE10"
 *               tinh_thanh:
 *                 type: string
 *                 example: "Hà Nội"
 *     responses:
 *       200:
 *         description: Đặt hàng thành công
 *       400:
 *         description: Giỏ hàng trống hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */


 
/**
 * @swagger
 * /api/donhang:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     description: Trả về tất cả đơn hàng đã đặt của user hiện tại, bao gồm chi tiết sản phẩm.
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng trả về thành công
 */

/**
/**
 * @swagger
 * /api/donhang/tinh-tong-tien:
 *   post:
 *     summary: Tính tổng tiền tạm tính đơn hàng
 *     description: Tính tổng tiền hàng, áp dụng mã giảm giá (nếu có) và phí vận chuyển, nhưng **không tạo đơn hàng**.
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 * 
 * diachi_id :
 * type:string
 *               magiamgia_code:
 *                 type: string
 *                 description: Mã giảm giá hoặc mã freeship (nếu có)
 *                 example: "FREESHIP30"
 *               tinh_thanh:
 *                 type: string
 *                 description: Tỉnh/thành phố để tính phí vận chuyển
 *                 example: "Hà Nội"
 *     responses:
 *       200:
 *         description: Tính tổng tiền thành công
 *       400:
 *         description: Giỏ hàng trống hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
/**
 * @swagger
 * /api/donhang/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo ID
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng được trả về thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */

/**
 * @swagger
 * /api/donhang/{id}/huy:
 *   put:
 *     summary: Hủy đơn hàng
 *     description: Cho phép người dùng hủy đơn hàng khi trạng thái chưa giao.
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID đơn hàng cần hủy
 *     responses:
 *       200:
 *         description: Đơn hàng đã được hủy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đã hủy đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
/* ===================== REVIEW ===================== */
/**
 * @swagger
 * tags:
 *   name: Review
 *   description: API Quản lý đánh giá sản phẩm (có upload ảnh)

 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "7f12a3d9-abc3-4e11-9b98-2f61aa4e5cda"
 *         bienthe_id:
 *           type: string
 *           example: "f50e6aa9-b333-11f0-b695-2a4b22e88692"
 *         rating:
 *           type: integer
 *           example: 5
 *         binhluan:
 *           type: string
 *           example: "Sản phẩm chất lượng, giao hàng nhanh."
 *         created_at:
 *           type: string
 *           example: "2025-10-29T09:00:00Z"
 *         updated_at:
 *           type: string
 *           example: "2025-10-29T09:10:00Z"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             ho_ten:
 *               type: string
 *         hinhanh:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               url:
 *                 type: string
 *                 example: "/uploads/reviews/1730182233990-image1.jpg"
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Tạo đánh giá mới cho sản phẩm
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               chitiet_donhang_id:
 *                 type: string
 *                 example: "f50e6aa9-b333-11f0-b695-2a4b22e88692"
 *               rating:
 *                 type: integer
 *                 example: 4
 *               binhluan:
 *                 type: string
 *                 example: "Giao hàng nhanh, chất lượng ổn."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Tối đa 5 ảnh upload
 *     responses:
 *       200:
 *         description: Tạo đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Thiếu thông tin đánh giá
 *       401:
 *         description: Chưa đăng nhập
 */

/**
 * @swagger
 * /api/review/{sanpham_id}/average:
 *   get:
 *     summary: Lấy danh sách đánh giá theo sản phẩm biến thể
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: sanpham_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */

/**
 * @swagger
 * /api/review/{id}:
 *   put:
 *     summary: Cập nhật đánh giá
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               binhluan:
 *                 type: string
 *                 example: "Sau khi dùng 1 tuần thấy rất ổn!"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       403:
 *         description: Không có quyền sửa đánh giá
 *       404:
 *         description: Không tìm thấy đánh giá
 */

/**
 * @swagger
 * /api/review/{id}:
 *   delete:
 *     summary: Xóa đánh giá của người dùng
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa đánh giá thành công
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy đánh giá
 */

/**
 * @swagger
 * /api/review/bienthe/{bienthe_id}/average:
 *   get:
 *     summary: Lấy điểm trung bình đánh giá của sản phẩm biến thể
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bienthe_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Điểm trung bình rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average_rating:
 *                   type: number
 *                   example: 4.6
 */

/**
 * @swagger
 * /api/magiamgia/apply:
 *   post:
 *     summary: Áp dụng mã giảm giá vào đơn hàng
 *     tags: [Mã giảm giá]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: SALE20
 *               tongtien:
 *                 type: number
 *                 example: 1200000
 *     responses:
 *       200:
 *         description: Mã giảm giá hợp lệ, trả về kết quả giảm
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc đơn hàng chưa đủ điều kiện
 *       404:
 *         description: Mã không hợp lệ hoặc đã hết hạn
 */
/* ===================== BÀI VIẾT ===================== */
/**
 * @swagger
 * /api/baiviet:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Bài viết]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/baiviet/{slug}:
 *   get:
 *     summary: Lấy chi tiết bài viết
 *     tags: [Bài viết]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

/* ===================== LIÊN HỆ ===================== */
/**
 * @swagger
 * /api/lienhe:
 *   post:
 *     summary: Gửi liên hệ từ form
 *     tags: [Liên hệ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_ten:
 *                 type: string
 *               email:
 *                 type: string
 *               noi_dung:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload ảnh sản phẩm
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * tags:
 *   - name: Danh mục
 *     description: Quản lý và hiển thị danh mục sản phẩm
 */

/**
 * @swagger
 * /api/danhmuc:
 *   get:
 *     summary: Lấy danh sách danh mục hiển thị
 *     tags: [Danh mục]
 *     responses:
 *       200:
 *         description: Danh sách danh mục được trả về thành công
 * 
 */          
// ======DANH MỤC========================================
/**
 * @swagger
 * /api/danhmuc/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục và danh sách sản phẩm trong danh mục
 *     tags: [Danh mục]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục và danh sách sản phẩm
 */

/**
 * @swagger
 * /admin/danhmuc:
 *   post:
 *     summary: (Admin) Thêm danh mục mới
 *     tags: [Danh mục]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tendm:
 *                 type: string
 *                 example: Ghế Văn Phòng
 *               code:
 *                 type: string
 *                 example: DM009
 *               mota:
 *                 type: string
 *                 example: ghe-van-phong
 *     responses:
 *       200:
 *         description: Thêm danh mục thành công
 */

/**
 * @swagger
 * /admin/danhmuc/{id}:
 *   put:
 *     summary: (Admin) Cập nhật danh mục
 *     tags: [Danh mục]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tendm:
 *                 type: string
 *               anhien:
 *                 type: integer
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 */

/**
 * @swagger
 * /admin/danhmuc/{id}:
 *   delete:
 *     summary: (Admin) Xóa danh mục
 *     tags: [Danh mục]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 */
// ================= thương hiệu ====================
/**
 * @swagger
 * tags:
 *   - name: Thương hiệu
 *     description: Quản lý và hiển thị thương hiệu sản phẩm
 */



/**
 * @swagger
 * /api/thuonghieu/{id}:
 *   get:
 *     summary: Lấy danh sách sản phẩm theo thương hiệu
 *     tags: [Thương hiệu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID thương hiệu
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm của thương hiệu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   tensp:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 */

/**
 * @swagger
 * /admin/thuonghieu:
 *   post:
 *     summary: (Admin) Thêm thương hiệu mới
 *     tags: [Thương hiệu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenbrand:
 *                 type: string
 *                 example: Nội thất Hòa Phát
 *               logo:
 *                 type: string
 *                 example: https://example.com/logo.jpg
 *               anhien:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Thêm thương hiệu thành công
 */

/**
 * @swagger
 * /admin/thuonghieu/{id}:
 *   put:
 *     summary: (Admin) Cập nhật thương hiệu
 *     tags: [Thương hiệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenbrand:
 *                 type: string
 *               logo:
 *                 type: string
 *               anhien:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thương hiệu thành công
 */

/**
 * @swagger
 * /admin/thuonghieu/{id}:
 *   delete:
 *     summary: (Admin) Xóa thương hiệu
 *     tags: [Thương hiệu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thương hiệu thành công
 */
// ===========biến thể ================
/**
 * @swagger
 * tags:
 *   - name: Biến thể
 *     description: Quản lý các biến thể sản phẩm (màu, size, giá, tồn kho)
 */

/**
 * @swagger
 * /api/bienthe:
 *   get:
 *     summary: Lấy danh sách tất cả biến thể sản phẩm
 *     tags: [Biến thể]
 *     responses:
 *       200:
 *         description: Thành công
 */

// /**
//  * @swagger
//  * /api/bienthe/{id}:
//  *   get:
//  *     summary: Lấy chi tiết biến thể theo ID
//  *     tags: [Biến thể]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Thành công
//  */

/**
 * @swagger
 * /admin/bienthe:
 *   post:
 *     summary: Thêm biến thể mới
 *     tags: [Biến thể]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sanpham_id:
 *                 type: string
 *               mausac:
 *                 type: string
 *               sl_tonko:
 *                 type: integer
 *               gia:
 *                 type: number
 *     responses:
 *       200:
 *         description: Thêm biến thể thành công
 */

/**
 * @swagger
 * /admin/bienthe/{id}:
 *   put:
 *     summary: Cập nhật biến thể
 *     tags: [Biến thể]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mausac:
 *                 type: string
 *               sl_tonko:
 *                 type: integer
 *               gia:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /admin/bienthe/{id}:
 *   delete:
 *     summary: Xóa biến thể
 *     tags: [Biến thể]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa biến thể thành công
 */
/**
 * @swagger
 * tags:
 *   - name: Địa chỉ
 *     description: API quản lý địa chỉ giao hàng của người dùng
 */

/* ===================== ĐỊA CHỈ ===================== */

/**
 * @swagger
 * /api/diachi:
 *   get:
 *     summary: Lấy danh sách địa chỉ theo người dùng
 *     tags: [Địa chỉ]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *        description: Chưa đăng nhập hoặc không có quyền truy cập
 */

/**
 * @swagger
 * /api/diachi:
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Địa chỉ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hoten, sdt, diachichitiet, phuong_xa, quan_huyen, tinh_thanh]
 *             properties:
 *               hoten: { type: string, example: "Nguyễn Văn A" }
 *               sdt: { type: string, example: "0912345678" }
 *               diachichitiet: { type: string, example: "12A đường Hoa Sữa" }
 *               phuong_xa: { type: string, example: "Phường 7" }
 *               quan_huyen: { type: string, example: "Quận 3" }
 *               tinh_thanh: { type: string, example: "TP.HCM" }
 *               macdinh: { type: integer, example: 1, description: "0 hoặc 1" }
 *               loaidiachi:
 *                 type: string
 *                 enum: [home, office, other]
 *                 example: home
 *     responses:
 *       201:
 *         description: Thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 message: { type: string, example: "Thêm địa chỉ thành công" }
 */

/**
 * @swagger
 * /api/diachi/{id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Địa chỉ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID địa chỉ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hoten: { type: string }
 *               sdt: { type: string }
 *               diachichitiet: { type: string }
 *               phuong_xa: { type: string }
 *               quan_huyen: { type: string }
 *               tinh_thanh: { type: string }
 *               macdinh: { type: integer, example: 0 }
 *               loaidiachi:
 *                 type: string
 *                 enum: [home, office, other]
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *       404:
 *         description: Không tìm thấy địa chỉ
 */

/**
 * @swagger
 * /api/diachi/{id}:
 *   delete:
 *     summary: Xoá địa chỉ
 *     tags: [Địa chỉ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID địa chỉ
 *     responses:
 *       200:
 *         description: Xoá địa chỉ thành công
 *       404:
 *         description: Không tìm thấy địa chỉ
 */
// ==================thanh toán===================
/**
 * @swagger
 * tags:
 *   - name: Thanh toán
 *     description: Xử lý thanh toán đơn hàng (VNPay, MoMo, COD)
 */

/**
 * @swagger
 * /api/thanhtoan/vnpay:
 *   post:
 *     summary: Tạo link thanh toán VNPay
 *     tags: [Thanh toán]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donhang_id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: URL redirect tới VNPay
 */
/**
 * @swagger
 * /api/thanhtoan/vnpay/return:
 *   get:
 *     summary: Callback từ VNPay sau khi thanh toán
 *     tags: [Thanh toán]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thanh toán
 */

/**
 * @swagger
 * /api/thanhtoan/momo:
 *   post:
 *     summary: Tạo giao dịch MoMo
 *     tags: [Thanh toán]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donhang_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL redirect tới MoMo
 */
/**
 * @swagger
 * /api/thanhtoan/cod:
 *   post:
 *     summary: Thanh toán khi nhận hàng (COD)
 *     tags: [Thanh toán]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donhang_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái COD
 */
/**
 * @swagger
 * /api/thanhtoan/trangthai/{id}:
 *   get:
 *     summary: Kiểm tra trạng thái thanh toán đơn hàng
 *     tags: [Thanh toán]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin trạng thái thanh toán
 */

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Quản lý banner cho trang chủ 
 */

/**
 * @swagger
 * /api/banner:
 *   get:
 *     summary: Lấy danh sách banner hiển thị
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Trả về danh sách banner
 */

/**
 * @swagger
 * /admin/banners:
 *   post:
 *     summary: Thêm banner mới (Admin)
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tieude:
 *                 type: string
 *               url:
 *                 type: string
 *                 example: /images/banner1.jpg
 *               linksp:
 *                 type: string
 *               anhien:
 *                 type: boolean
 *               mota:
 *                 type: string
 *               thutu:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Banner được tạo thành công
 *       400:
 *         description: Thiếu dữ liệu đầu vào
 */
/**
 * @swagger
 * /api/banner/{id}:
 *   get:
 *     summary: Lấy chi tiết banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
/**
 * @swagger
 * /admin/banners/{id}:
 *   put:
 *     summary: Cập nhật banner (Admin)
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của banner cần sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tieude:
 *                 type: string
 *               anhien:
 *                 type: boolean
 *               thutu:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy banner
 */

/**
 * @swagger
 * /admin/banners/{id}:
 *   delete:
 *     summary: Xóa banner (Admin)
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID banner cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy banner
 */
