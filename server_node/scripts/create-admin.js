const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Import database connection
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

async function createAdmin() {
  try {
    // Thông tin admin mặc định
    const email = 'admin@admin.com';
    const password = 'admin123';
    const fullName = 'Administrator';

    console.log('🔍 Kiểm tra email admin...');
    
    // Kiểm tra xem admin đã tồn tại chưa
    const existed = await UserModel.findOne({ where: { email } });
    
    if (existed) {
      console.log('⚠️  Admin đã tồn tại trong hệ thống!');
      console.log('📧 Email:', email);
      console.log('👤 Role:', existed.role);
      
      // Nếu user tồn tại nhưng không phải admin, cập nhật role
      if (existed.role !== 'admin') {
        console.log('🔄 Cập nhật role thành admin...');
        await existed.update({ role: 'admin' });
        console.log('✅ Đã cập nhật role thành admin!');
      }
      
      return;
    }

    console.log('🔐 Mã hóa mật khẩu...');
    const hashed = await bcrypt.hash(password, 10);
    
    console.log('💾 Tạo tài khoản admin...');
    const admin = await UserModel.create({
      id: uuidv4(),
      email,
      password: hashed,
      ho_ten: fullName,
      role: 'admin',
      trangthai: 1,
    });

    console.log('\n✅ TẠO ADMIN THÀNH CÔNG!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', email);
    console.log('🔑 Password: ', password);
    console.log('👤 Tên:      ', fullName);
    console.log('🎭 Role:     ', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Bạn có thể đăng nhập với tài khoản này tại: http://localhost:3000/login\n');
    
  } catch (err) {
    console.error('❌ LỖI:', err.message);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

// Chạy script
console.log('🚀 Khởi động script tạo admin...\n');
createAdmin();

