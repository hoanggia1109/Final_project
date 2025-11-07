const { Sequelize, DataTypes } = require('sequelize');

// Kết nối database
const sequelize = new Sequelize('shopnoithat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Define UserModel
const UserModel = sequelize.define(
  'nguoi_dung',
  {
    id: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: true },
    ngaysinh: { type: DataTypes.DATEONLY, allowNull: true },
    gioitinh: { type: DataTypes.STRING, allowNull: true },
    ho_ten: { type: DataTypes.STRING, allowNull: true },
    sdt: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'customer'), defaultValue: 'customer' },
    trangthai: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'nguoi_dung', timestamps: false }
);

async function listAdmins() {
  try {
    console.log('🔍 DANH SÁCH ADMIN TRONG HỆ THỐNG\n');
    
    // Lấy tất cả admin
    const admins = await UserModel.findAll({ 
      where: { role: 'admin' },
      order: [['created_at', 'DESC']]
    });

    if (admins.length === 0) {
      console.log('⚠️  Không có admin nào trong hệ thống!');
      console.log('💡 Hãy chạy: node scripts/create-admin.js để tạo admin\n');
      return;
    }

    console.log(`📊 Tìm thấy ${admins.length} admin:\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  #  | Email                        | Tên                  | Ngày tạo');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    admins.forEach((admin, index) => {
      const email = admin.email.padEnd(28);
      const name = (admin.ho_ten || 'N/A').padEnd(20);
      const date = new Date(admin.created_at).toLocaleDateString('vi-VN');
      console.log(`  ${(index + 1).toString().padStart(2)}  | ${email} | ${name} | ${date}`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (err) {
    console.error('❌ LỖI:', err.message);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

// Chạy script
listAdmins();

