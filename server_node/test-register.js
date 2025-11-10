const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { sequelize, UserModel } = require("./database");

async function testRegister() {
  console.log(" === BẮT ĐẦU KIỂM TRA ĐĂNG KÝ ===");
  
  try {
    // 1. Kiểm tra kết nối database
    console.log("\n Kiểm tra kết nối database...");
    await sequelize.authenticate();
    console.log(" Kết nối database thành công!");

    // 2. Kiểm tra bảng nguoi_dung có tồn tại không
    console.log("\n Kiểm tra bảng nguoi_dung...");
    const [results] = await sequelize.query("SHOW TABLES LIKE 'nguoi_dung'");
    if (results.length === 0) {
      console.log(" Bảng nguoi_dung KHÔNG TỒN TẠI!");
      console.log("Bạn cần import file SQL vào PHPMyAdmin!");
      process.exit(1);
    }
    console.log(" Bảng nguoi_dung đã tồn tại!");

    // 3. Kiểm tra cấu trúc bảng
    console.log("\n Kiểm tra cấu trúc bảng nguoi_dung...");
    const [columns] = await sequelize.query("DESCRIBE nguoi_dung");
    console.log("Các cột trong bảng:", columns.map(c => c.Field).join(", "));

    // 4. Test tạo user mới
    console.log("\n Test tạo user mới...");
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "123456";
    
    console.log(" Email test:", testEmail);
    console.log(" Đang hash password...");
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log(" Password đã hash!");
    
    console.log(" Đang tạo user...");
    const newUser = await UserModel.create({
      id: uuidv4(),
      email: testEmail,
      password: hashedPassword,
    });
    
    console.log(" User đã được tạo thành công!");
    console.log(" Thông tin user:", {
      id: newUser.id,
      email: newUser.email,
    });

    // 5. Kiểm tra user đã được lưu vào database chưa
    console.log("\n Kiểm tra user trong database...");
    const [dbCheck] = await sequelize.query(
      `SELECT id, email FROM nguoi_dung WHERE email = '${testEmail}'`
    );
    
    if (dbCheck.length > 0) {
      console.log(" User ĐÃ ĐƯỢC LƯU vào database!");
      console.log(" Data từ DB:", dbCheck[0]);
    } else {
      console.log(" User KHÔNG ĐƯỢC LƯU vào database!");
    }

    // 6. Đếm tổng số user
    console.log("\n Tổng số user trong database:");
    const [countResult] = await sequelize.query("SELECT COUNT(*) as total FROM nguoi_dung");
    console.log(" Tổng số user:", countResult[0].total);

    console.log("\n === KIỂM TRA HOÀN TẤT ===");
    console.log(" Vào PHPMyAdmin và kiểm tra bảng nguoi_dung để xem user mới!");
    
  } catch (error) {
    console.error("\n === LỖI XẢY RA ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    if (error.name === "SequelizeConnectionError") {
      console.log("\n  LỖI KẾT NỐI DATABASE!");
      console.log("Kiểm tra:");
      console.log("  1. XAMPP MySQL đã bật chưa?");
      console.log("  2. Database 'shopnoithat' đã tạo chưa?");
      console.log("  3. Username/password trong database.js đúng chưa?");
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testRegister();

