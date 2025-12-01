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
 *                 example: "123456"
 *               pass_new1:
 *                 type: string
 *                 example: "123456789"
 *               pass_new2:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */

/* ===================== SẢN PHẨM ===================== */
/**
 * @swagger
 * /api/sanpham:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số sản phẩm mỗi trang
 *       - in: query
 *         name: danhmuc_id
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: thuonghieu_id
 *         schema:
 *           type: string
 *         description: Lọc theo thương hiệu
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */

/**
 * @swagger
 * /api/sanpham/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Sản phẩm]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 */

/* ===================== GIỎ HÀNG ===================== */
/**
 * @swagger
 * /api/giohang:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     tags: [Giỏ hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm trong giỏ hàng
 */

 /**
 * @swagger
 * /api/giohang:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Giỏ hàng]
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
 *               soluong:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               soluong:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/* ===================== ĐƠN HÀNG ===================== */
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
 *     description: |
 *       Cho phép người dùng hủy đơn hàng khi trạng thái chưa giao hàng.
 *       Hệ thống sẽ tự động gửi email thông báo hủy đơn hàng đến customer.
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
 *       400:
 *         description: Không thể hủy đơn hàng đã được giao
 *       403:
 *         description: Không có quyền hủy đơn hàng này
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
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
 */

/**
 * @swagger
 * /api/review/bienthe/{bienthe_id}:
 *   post:
 *     summary: Tạo đánh giá mới (có upload ảnh)
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bienthe_id
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
 *                 example: "Sản phẩm rất đẹp, chất lượng tốt!"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Tạo đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
 *     summary: Lấy điểm đánh giá trung bình của biến thể
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bienthe_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Điểm đánh giá trung bình
 */

/* ===================== MÃ GIẢM GIÁ ===================== */
/**
 * @swagger
 * /api/magiamgia/kiemtra:
 *   post:
 *     summary: Kiểm tra mã giảm giá
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
 *                 example: "SALE10"
 *               tongtien:
 *                 type: number
 *                 example: 1000000
 *     responses:
 *       200:
 *         description: Mã giảm giá hợp lệ
 */

/* ===================== BÀI VIẾT ===================== */
/**
 * @swagger
 * /api/baiviet:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Bài viết]
 *     parameters:
 *       - in: query
 *         name: danhmuc_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 */

/**
 * @swagger
 * /api/baiviet/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết
 *     tags: [Bài viết]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 */

/* ===================== LIÊN HỆ ===================== */
/**
 * @swagger
 * /api/lienhe:
 *   post:
 *     summary: Gửi liên hệ
 *     tags: [Liên hệ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hoten:
 *                 type: string
 *               email:
 *                 type: string
 *               sdt:
 *                 type: string
 *               noidung:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gửi liên hệ thành công
 */

/* ===================== DANH MỤC ===================== */
/**
 * @swagger
 * /api/danhmuc:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags: [Danh mục]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */          

/**
 * @swagger
 * /api/danhmuc/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục
 *     tags: [Danh mục]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết danh mục
 */

/* ===================== ADMIN ===================== */
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
 *               mota:
 *                 type: string
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
 *               mota:
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

/* ===================== THƯƠNG HIỆU ===================== */
/**
 * @swagger
 * /api/thuonghieu:
 *   get:
 *     summary: Lấy danh sách thương hiệu
 *     tags: [Sản phẩm]
 *     responses:
 *       200:
 *         description: Danh sách thương hiệu
 */

/**
 * @swagger
 * /admin/thuonghieu:
 *   post:
 *     summary: (Admin) Thêm thương hiệu mới
 *     tags: [Sản phẩm]
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
 *               mota:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm thương hiệu thành công
 */

/**
 * @swagger
 * /admin/thuonghieu/{id}:
 *   put:
 *     summary: (Admin) Cập nhật thương hiệu
 *     tags: [Sản phẩm]
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
 *               mota:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thương hiệu thành công
 */

/**
 * @swagger
 * /admin/thuonghieu/{id}:
 *   delete:
 *     summary: (Admin) Xóa thương hiệu
 *     tags: [Sản phẩm]
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

/* ===================== BIẾN THỂ ===================== */
/**
 * @swagger
 * /api/bienthe:
 *   get:
 *     summary: Lấy danh sách tất cả biến thể sản phẩm
 *     tags: [Biến thể]
 *     responses:
 *       200:
 *         description: Danh sách biến thể
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   mausac:
 *                     type: string
 *                   kichthuoc:
 *                     type: string
 *                   chatlieu:
 *                     type: string
 *                   gia:
 *                     type: number
 *                   sl_tonkho:
 *                     type: integer
 *                   sanpham:
 *                     type: object
 *                   images:
 *                     type: array
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/bienthe/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một biến thể theo ID
 *     tags: [Biến thể]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của biến thể
 *     responses:
 *       200:
 *         description: Thông tin chi tiết biến thể
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 mausac:
 *                   type: string
 *                 kichthuoc:
 *                   type: string
 *                 chatlieu:
 *                   type: string
 *                 gia:
 *                   type: number
 *                 sl_tonkho:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 sanpham:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     tensp:
 *                       type: string
 *                     thumbnail:
 *                       type: string
 *                     mota:
 *                       type: string
 *                     danhmuc:
 *                       type: object
 *                     thuonghieu:
 *                       type: object
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       url:
 *                         type: string
 *       404:
 *         description: Không tìm thấy biến thể
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /admin/bienthe:
 *   post:
 *     summary: Thêm biến thể
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
 *               macdinh: { type: integer }
 *               loaidiachi: { type: string, enum: [home, office, other] }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /api/diachi/{id}:
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Địa chỉ]
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
 *         description: Xóa thành công
 */

/* ===================== THANH TOÁN ===================== */
/**
 * @swagger
 * /api/thanhtoan/stripe/create-payment-intent:
 *   post:
 *     summary: Tạo Payment Intent cho Stripe
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
 *               orderId:
 *                 type: string
 *                 example: "abc-123-def-456"
 *     responses:
 *       200:
 *         description: Tạo Payment Intent thành công
 */

/**
 * @swagger
 * /api/thanhtoan/stripe/confirm-payment:
 *   post:
 *     summary: Xác nhận thanh toán Stripe thành công
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
 *               orderId:
 *                 type: string
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận thanh toán thành công
 */

/**
 * @swagger
 * /api/thanhtoan/banking/confirm-transfer:
 *   post:
 *     summary: Xác nhận đã chuyển khoản
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
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xác nhận chuyển khoản thành công
 */

/**
 * @swagger
 * /api/thanhtoan/check-status/{orderId}:
 *   get:
 *     summary: Kiểm tra trạng thái thanh toán đơn hàng
 *     tags: [Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin trạng thái thanh toán
 */

/* ===================== ADMIN - THỐNG KÊ ===================== */
/**
 * @swagger
 * tags:
 *   - name: Admin - Thống kê
 *     description: API thống kê dành cho quản trị viên (doanh thu, đơn hàng, tồn kho, user online)
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Thống kê tổng quan dashboard
 *     description: Lấy thống kê tổng quan về sản phẩm, đơn hàng, người dùng và bài viết. Có thể filter đơn hàng theo khoảng ngày.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         description: Ngày bắt đầu để filter đơn hàng (YYYY-MM-DD). Nếu có, phải có to_date.
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *         description: Ngày kết thúc để filter đơn hàng (YYYY-MM-DD). Nếu có, phải có from_date.
 *     responses:
 *       200:
 *         description: Thống kê dashboard thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sanpham:
 *                   type: integer
 *                   example: 150
 *                   description: Tổng số sản phẩm
 *                 donhang:
 *                   type: integer
 *                   example: 1250
 *                   description: Tổng số đơn hàng (có filter nếu có from_date và to_date)
 *                 nguoidung:
 *                   type: integer
 *                   example: 500
 *                   description: Tổng số người dùng
 *                 baiviet:
 *                   type: integer
 *                   example: 45
 *                   description: Tổng số bài viết
 *                 period:
 *                   type: object
 *                   description: Khoảng thời gian filter (chỉ có khi có from_date và to_date)
 *                   properties:
 *                     from_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-01-01"
 *                     to_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-01-31"
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/revenue/daily:
 *   get:
 *     summary: Lấy doanh thu theo ngày
 *     description: Thống kê doanh thu và số đơn hàng trong một ngày cụ thể. Chỉ tính đơn hàng đã thanh toán.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-20"
 *         description: Ngày cần thống kê (YYYY-MM-DD). Nếu không có, mặc định là hôm nay.
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo ngày thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-20"
 *                 tong_doanh_thu:
 *                   type: number
 *                   example: 5000000
 *                   description: Tổng doanh thu trong ngày (VND)
 *                 so_don_hang:
 *                   type: integer
 *                   example: 25
 *                   description: Số lượng đơn hàng trong ngày
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/revenue/monthly:
 *   get:
 *     summary: Lấy doanh thu theo tháng
 *     description: Thống kê doanh thu và số đơn hàng trong một tháng cụ thể. Chỉ tính đơn hàng đã thanh toán.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: Năm cần thống kê. Nếu không có, mặc định là năm hiện tại.
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           example: 1
 *           minimum: 1
 *           maximum: 12
 *         description: Tháng cần thống kê (1-12). Nếu không có, mặc định là tháng hiện tại.
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo tháng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 year:
 *                   type: integer
 *                   example: 2025
 *                 month:
 *                   type: integer
 *                   example: 1
 *                 tong_doanh_thu:
 *                   type: number
 *                   example: 150000000
 *                   description: Tổng doanh thu trong tháng (VND)
 *                 so_don_hang:
 *                   type: integer
 *                   example: 750
 *                   description: Số lượng đơn hàng trong tháng
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/revenue/range:
 *   get:
 *     summary: Lấy doanh thu theo khoảng ngày (from-date to date)
 *     description: Thống kê doanh thu và số đơn hàng trong một khoảng thời gian tùy chọn. Chỉ tính đơn hàng đã thanh toán. Có thể trả về danh sách đơn hàng nếu cần.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         description: Ngày bắt đầu (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *         description: Ngày kết thúc (YYYY-MM-DD)
 *       - in: query
 *         name: include_orders
 *         schema:
 *           type: boolean
 *           example: false
 *         description: Có trả về danh sách đơn hàng không (true/false). Mặc định là false.
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo khoảng ngày thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-01"
 *                 to_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-31"
 *                 tong_doanh_thu:
 *                   type: number
 *                   example: 50000000
 *                   description: Tổng doanh thu trong khoảng thời gian (VND)
 *                 so_don_hang:
 *                   type: integer
 *                   example: 250
 *                   description: Số lượng đơn hàng trong khoảng thời gian
 *                 orders:
 *                   type: array
 *                   description: Danh sách đơn hàng (chỉ có khi include_orders=true)
 *                   items:
 *                     type: object
 *       400:
 *         description: Thiếu tham số hoặc ngày không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/products/low-stock:
 *   get:
 *     summary: Lấy sản phẩm có tồn kho thấp (< 8)
 *     description: Lấy danh sách các biến thể sản phẩm có số lượng tồn kho nhỏ hơn 8 (nhưng lớn hơn 0).
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm có tồn kho thấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 15
 *                   description: Số lượng biến thể có tồn kho thấp
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       sl_tonkho:
 *                         type: integer
 *                         example: 5
 *                       gia:
 *                         type: number
 *                       mausac:
 *                         type: string
 *                       sanpham:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           code:
 *                             type: string
 *                           tensp:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/products/out-of-stock:
 *   get:
 *     summary: Lấy sản phẩm hết hàng (tồn kho <= 0)
 *     description: Lấy danh sách các biến thể sản phẩm đã hết hàng (số lượng tồn kho nhỏ hơn hoặc bằng 0).
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm hết hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 8
 *                   description: Số lượng biến thể hết hàng
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       sl_tonkho:
 *                         type: integer
 *                         example: 0
 *                       gia:
 *                         type: number
 *                       mausac:
 *                         type: string
 *                       sanpham:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           code:
 *                             type: string
 *                           tensp:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/orders/today:
 *   get:
 *     summary: Lấy đơn hàng theo ngày
 *     description: Lấy danh sách tất cả đơn hàng được tạo trong một ngày cụ thể (từ 00:00:00 đến 23:59:59). Mặc định là hôm nay nếu không có query param date.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-20"
 *         description: Ngày cần lấy đơn hàng (YYYY-MM-DD). Nếu không có, mặc định là hôm nay.
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng hôm nay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-20"
 *                   description: Ngày được lấy đơn hàng
 *                 count:
 *                   type: integer
 *                   example: 42
 *                   description: Số lượng đơn hàng trong ngày
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       tongtien:
 *                         type: number
 *                       tongtien_sau_giam:
 *                         type: number
 *                       trangthai:
 *                         type: string
 *                         enum: [pending, confirmed, shipping, delivered, cancelled, returned]
 *                       trangthaithanhtoan:
 *                         type: string
 *                         enum: [pending, paid, failed, refunded, cancelled]
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           ho_ten:
 *                             type: string
 *                           email:
 *                             type: string
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/orders/pending:
 *   get:
 *     summary: Lấy đơn hàng đang chờ xử lý
 *     description: Lấy danh sách tất cả đơn hàng có trạng thái "pending" (chờ xác nhận).
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng đang chờ xử lý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 12
 *                   description: Số lượng đơn hàng đang chờ xử lý
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       tongtien:
 *                         type: number
 *                       tongtien_sau_giam:
 *                         type: number
 *                       trangthai:
 *                         type: string
 *                         enum: [pending, confirmed, shipping, delivered, cancelled, returned]
 *                       trangthaithanhtoan:
 *                         type: string
 *                         enum: [pending, paid, failed, refunded, cancelled]
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           ho_ten:
 *                             type: string
 *                           email:
 *                             type: string
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/users/online:
 *   get:
 *     summary: Lấy danh sách user đang online real-time
 *     description: Lấy danh sách người dùng đang hoạt động trong vòng 5 phút gần nhất. Dữ liệu được cập nhật real-time.
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách user đang online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 15
 *                   description: Tổng số user đang online
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ho_ten:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [admin, customer]
 *                       last_activity:
 *                         type: string
 *                         format: date-time
 *                         description: Thời gian hoạt động cuối cùng
 *                         example: "2025-01-20T10:30:00.000Z"
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/* ===================== ADMIN - QUẢN LÝ ĐƠN HÀNG ===================== */
/**
 * @swagger
 * /api/admin/donhang:
 *   get:
 *     summary: (Admin) Lấy danh sách đơn hàng với filter từ-đến ngày
 *     description: Lấy danh sách tất cả đơn hàng trong hệ thống. Có thể filter theo khoảng thời gian, trạng thái đơn hàng và trạng thái thanh toán.
 *     tags: [Admin - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         description: Ngày bắt đầu filter (YYYY-MM-DD). Lọc theo created_at của đơn hàng.
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *         description: Ngày kết thúc filter (YYYY-MM-DD). Lọc theo created_at của đơn hàng.
 *       - in: query
 *         name: trangthai
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipping, delivered, cancelled, returned]
 *           example: "pending"
 *         description: Lọc theo trạng thái đơn hàng
 *       - in: query
 *         name: trangthaithanhtoan
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed, refunded, cancelled]
 *           example: "paid"
 *         description: Lọc theo trạng thái thanh toán
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
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
 *                   trangthai:
 *                     type: string
 *                   trangthaithanhtoan:
 *                     type: string
 *                   tongtien_sau_giam:
 *                     type: number
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ho_ten:
 *                         type: string
 *                       email:
 *                         type: string
 *                   chitiet:
 *                     type: array
 *                     items:
 *                       type: object
 *       401:
 *         description: Chưa đăng nhập hoặc không có quyền admin
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/admin/donhang/{id}:
 *   put:
 *     summary: (Admin) Cập nhật trạng thái đơn hàng
 *     description: |
 *       Admin có thể cập nhật trạng thái đơn hàng (trangthai) và trạng thái thanh toán (trangthaithanhtoan).
 *       Khi trạng thái đơn hàng thay đổi, hệ thống sẽ tự động gửi email thông báo đến customer.
 *       **Chỉ cho phép cập nhật trạng thái, không thể cập nhật các thông tin khác như địa chỉ, ghi chú, v.v.**
 *     tags: [Admin - Thống kê]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trangthai:
 *                 type: string
 *                 enum: [pending, confirmed, shipping, delivered, cancelled, returned]
 *                 description: Trạng thái đơn hàng mới. Khi thay đổi sẽ gửi email cho customer.
 *                 example: "confirmed"
 *               trangthaithanhtoan:
 *                 type: string
 *                 enum: [pending, paid, failed, refunded, cancelled]
 *                 description: Trạng thái thanh toán
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái đơn hàng thành công"
 *       400:
 *         description: Không có dữ liệu để cập nhật hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */