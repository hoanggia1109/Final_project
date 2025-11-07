const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🧩 Hàm tạo middleware upload theo thư mục con (vd: sanpham, thuonghieu...)
function createMulterUpload(folderName = "") {
  const uploadDir = path.join(__dirname, "../uploads", folderName);

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
}

module.exports = createMulterUpload;
