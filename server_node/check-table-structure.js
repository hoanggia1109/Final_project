const { sequelize } = require("./database");

async function checkTable() {
  try {
    console.log("🔍 Kiểm tra cấu trúc bảng nguoi_dung...\n");
    
    const [columns] = await sequelize.query("DESCRIBE nguoi_dung");
    
    console.log("📋 Các cột trong bảng nguoi_dung:");
    console.table(columns.map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null,
      Key: col.Key,
      Default: col.Default
    })));
    
    console.log("\n📝 Model trong database.js yêu cầu:");
    console.log("  - id");
    console.log("  - email");
    console.log("  - password");
    console.log("  - ho_ten ❌ (KHÔNG TỒN TẠI!)");
    console.log("  - sdt");
    console.log("  - ngaysinh");
    console.log("  - gioitinh");
    console.log("  - role");
    console.log("  - trangthai");
    console.log("  - created_at");
    console.log("  - updated_at");
    
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkTable();

