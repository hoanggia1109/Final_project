const { Sequelize, DataTypes } = require('sequelize');
const readline = require('readline');

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

// Tạo interface đọc input từ console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function promoteToAdmin() {
  try {
    console.log('--- CÔNG CỤ NÂNG CẤP USER LÊN ADMIN ---\n');
    
    // Nhập email
    const email = await question('📧 Nhập email của user cần nâng cấp: ');
    
    if (!email) {
      console.log('--- Email không được để trống!');
      return;
    }

    console.log('\n--- Đang tìm kiếm user...');
    
    // Tìm user
    const user = await UserModel.findOne({ where: { email } });
    
    if (!user) {
      console.log(`--- Không tìm thấy user với email: ${email}`);
      return;
    }

    console.log('\n--- THÔNG TIN USER:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Tên:      ', user.ho_ten || 'N/A');
    console.log('📧 Email:    ', user.email);
    console.log('📱 SĐT:      ', user.sdt || 'N/A');
    console.log('🎭 Role:     ', user.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Kiểm tra xem đã là admin chưa
    if (user.role === 'admin') {
      console.log('---  User này đã là admin rồi!');
      return;
    }

    // Xác nhận
    const confirm = await question('---  Bạn có chắc muốn nâng user này lên admin? (y/n): ');
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('--- Đã hủy thao tác.');
      return;
    }

    // Cập nhật role
    console.log('\n--- Đang cập nhật role...');
    await user.update({ role: 'admin' });

    console.log('\n--- NÂNG CẤP THÀNH CÔNG!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', user.email);
    console.log('🎭 Role mới: ', 'admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n--- User này giờ có thể truy cập trang admin tại: http://localhost:3000/admin\n');
    
  } catch (err) {
    console.error('--- LỖI:', err.message);
  } finally {
    rl.close();
    await sequelize.close();
    process.exit();
  }
}

// Chạy script
promoteToAdmin();

