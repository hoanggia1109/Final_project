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

/* ===================== ĐƠN HÀNG ===================== */
/**
 * @swagger
 * tags:
 *   - name: Đơn hàng
 *     description: Quản lý và xử lý đơn hàng người dùng
 */

/**
 * @swagger
 * /api/donhang:
 *   post:
 *     summary: Tạo đơn hàng mới từ giỏ hàng người dùng
 *     description: API này lấy toàn bộ giỏ hàng của user, tính tổng tiền, áp dụng mã giảm giá (nếu có), và tạo đơn hàng.
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               magiamgia_code:
 *                 type: string
 *                 example: SALE10
 *     responses:
 *       200:
 *         description: Đặt hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đặt hàng thành công
 *                 donhang:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                       example: OD17323456789
 *                     tongtien:
 *                       type: number
 *                       example: 1500000
 *                     giamgia:
 *                       type: number
 *                       example: 150000
 *                     tongtien_sau_giam:
 *                       type: number
 *                       example: 1350000
 *                     magiamgia_code:
 *                       type: string
 *                       example: SALE10
 *       400:
 *         description: Giỏ hàng trống
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   code:
 *                     type: string
 *                   tongtien:
 *                     type: number
 *                   giamgia:
 *                     type: number
 *                   tongtien_sau_giam:
 *                     type: number
 *                   trangthai:
 *                     type: string
 *                     example: pending
 *                   DonHangChiTiets:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         bienthe_id:
 *                           type: string
 *                         soluong:
 *                           type: number
 *                         gia:
 *                           type: number
 *                         bienthe:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             sanpham:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 tensp:
 *                                   type: string
 *                                 thumbnail:
 *                                   type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 tongtien:
 *                   type: number
 *                 giamgia:
 *                   type: number
 *                 tongtien_sau_giam:
 *                   type: number
 *                 trangthai:
 *                   type: string
 *                   example: completed
 *                 DonHangChiTiets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bienthe_id:
 *                         type: string
 *                       soluong:
 *                         type: number
 *                       gia:
 *                         type: number
 *                       bienthe:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           sanpham:
 *                             type: object
 *                             properties:
 *                               tensp:
 *                                 type: string
 *                               thumbnail:
 *                                 type: string
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
 * /api/review:
 *   post:
 *     summary: Gửi đánh giá sản phẩm
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bienthe_id:
 *                 type: string
 *               rating:
 *                 type: integer
 *               binhluan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 */

/* ===================== MÃ GIẢM GIÁ ===================== */
/**
 * @swagger
 * tags:
 *   - name: Mã giảm giá
 *     description: Quản lý và áp dụng mã khuyến mãi
 */

/**
 * @swagger
 * /api/magiamgia:
 *   get:
 *     summary: Lấy danh sách mã giảm giá còn hiệu lực
 *     tags: [Mã giảm giá]
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: SALE10
 *                   mota:
 *                     type: string
 *                     example: Giảm 10% cho đơn hàng trên 500k
 *                   loai:
 *                     type: string
 *                     example: percent
 *                   giatrigiam:
 *                     type: number
 *                     example: 10
 *                   giatri_toithieu:
 *                     type: number
 *                     example: 500000
 *                   soluong:
 *                     type: integer
 *                     example: 100
 *                   ngaybatdau:
 *                     type: string
 *                     example: 2025-01-01
 *                   ngayketthuc:
 *                     type: string
 *                     example: 2025-12-31
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Áp dụng mã giảm giá thành công
 *                 code:
 *                   type: string
 *                   example: SALE20
 *                 loai:
 *                   type: string
 *                   example: percent
 *                 giatrigiam:
 *                   type: number
 *                   example: 20
 *                 giam:
 *                   type: number
 *                   example: 240000
 *                 tong_tien_sau_giam:
 *                   type: number
 *                   example: 960000
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   tendm:
 *                     type: string
 *                   anhien:
 *                     type: integer
 *                   slug:
 *                     type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 tendm:
 *                   type: string
 *                 sanpham:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       tensp:
 *                         type: string
 *                       thumbnail:
 *                         type: string
 */

/**
 * @swagger
 * /api/danhmuc:
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
 *               anhien:
 *                 type: integer
 *                 example: 1
 *               slug:
 *                 type: string
 *                 example: ghe-van-phong
 *     responses:
 *       200:
 *         description: Thêm danh mục thành công
 */

/**
 * @swagger
 * /api/danhmuc/{id}:
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
 * /api/danhmuc/{id}:
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
 * /api/sanpham/thuonghieu:
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
 * /api/admin/thuonghieu:
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
 * /api/admin/thuonghieu/{id}:
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
 * /api/admin/thuonghieu/{id}:
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

/**
 * @swagger
 * /api/bienthe/{id}:
 *   get:
 *     summary: Lấy chi tiết biến thể theo ID
 *     tags: [Biến thể]
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
 * /api/bienthe:
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
 * /api/bienthe/{id}:
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
 * /api/bienthe/{id}:
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