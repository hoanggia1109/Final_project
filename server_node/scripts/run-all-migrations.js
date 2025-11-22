/**
 * Script để chạy tất cả các migration
 * Tự động kiểm tra và chạy các migration chưa được thực hiện
 */

const { sequelize } = require('../database');
const fs = require('fs');
const path = require('path');

async function runMigrationFile(filePath, description) {
  try {
    console.log(`\n📄 ${description}`);
    console.log(`   Đang chạy: ${path.basename(filePath)}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Loại bỏ các comment và câu lệnh không cần thiết
    const cleanSql = sql
      .replace(/--.*$/gm, '') // Loại bỏ comment
      .replace(/\/\*[\s\S]*?\*\//g, '') // Loại bỏ block comment
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.toLowerCase().startsWith('select') && !s.toLowerCase().startsWith('describe') && !s.toLowerCase().startsWith('show'));
    
    for (const query of cleanSql) {
      if (query.trim()) {
        try {
          // Xử lý các câu lệnh có IF NOT EXISTS hoặc IF EXISTS
          let finalQuery = query;
          
          // Xử lý CHANGE COLUMN - kiểm tra cột cũ có tồn tại không
          if (finalQuery.includes('CHANGE COLUMN')) {
            const changeMatch = finalQuery.match(/CHANGE COLUMN\s+(\w+)\s+(\w+)/i);
            if (changeMatch) {
              const oldColumnName = changeMatch[1];
              const newColumnName = changeMatch[2];
              const tableMatch = finalQuery.match(/ALTER TABLE\s+(\w+)/i);
              if (tableMatch) {
                const tableName = tableMatch[1];
                const [columns] = await sequelize.query(`
                  SHOW COLUMNS FROM ${tableName} LIKE '${oldColumnName}'
                `);
                if (columns.length === 0) {
                  console.log(`   ⏭️  Cột ${oldColumnName} không tồn tại, bỏ qua CHANGE COLUMN`);
                  continue;
                }
                // Kiểm tra xem cột mới đã tồn tại chưa
                const [newColumns] = await sequelize.query(`
                  SHOW COLUMNS FROM ${tableName} LIKE '${newColumnName}'
                `);
                if (newColumns.length > 0) {
                  console.log(`   ⏭️  Cột ${newColumnName} đã tồn tại, bỏ qua CHANGE COLUMN`);
                  continue;
                }
              }
            }
          }
          
          // MySQL không hỗ trợ IF NOT EXISTS trong ALTER TABLE, cần xử lý riêng
          if (finalQuery.includes('ADD COLUMN IF NOT EXISTS')) {
            const match = finalQuery.match(/ADD COLUMN IF NOT EXISTS\s+(\w+)\s+([^A]+)/i);
            if (match) {
              const columnName = match[1];
              const tableMatch = finalQuery.match(/ALTER TABLE\s+(\w+)/i);
              if (tableMatch) {
                const tableName = tableMatch[1];
                // Kiểm tra xem cột đã tồn tại chưa
                const [columns] = await sequelize.query(`
                  SHOW COLUMNS FROM ${tableName} LIKE '${columnName}'
                `);
                if (columns.length > 0) {
                  console.log(`   ⏭️  Cột ${columnName} đã tồn tại, bỏ qua`);
                  continue;
                } else {
                  finalQuery = finalQuery.replace('IF NOT EXISTS', '');
                }
              }
            }
          }
          
          // Xử lý CREATE TABLE IF NOT EXISTS
          if (finalQuery.includes('CREATE TABLE IF NOT EXISTS')) {
            finalQuery = finalQuery.replace('IF NOT EXISTS', '');
          }
          
          // Xử lý CREATE INDEX IF NOT EXISTS
          if (finalQuery.includes('CREATE INDEX IF NOT EXISTS')) {
            const indexMatch = finalQuery.match(/CREATE INDEX IF NOT EXISTS\s+(\w+)/i);
            if (indexMatch) {
              const indexName = indexMatch[1];
              try {
                await sequelize.query(finalQuery.replace('IF NOT EXISTS', ''));
              } catch (err) {
                if (err.message.includes('Duplicate key')) {
                  console.log(`   ⏭️  Index ${indexName} đã tồn tại, bỏ qua`);
                  continue;
                }
                throw err;
              }
              continue;
            }
          }
          
          await sequelize.query(finalQuery);
        } catch (err) {
          // Bỏ qua lỗi duplicate column, table exists, etc.
          if (err.message.includes('Duplicate column') || 
              err.message.includes('Duplicate key') ||
              err.message.includes('already exists') ||
              err.message.includes('Unknown column') && err.message.includes('CHANGE COLUMN')) {
            console.log(`   ⚠️  ${err.message.split('\n')[0]}`);
            continue;
          }
          throw err;
        }
      }
    }
    
    console.log(`   ✅ Hoàn thành: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`   ❌ Lỗi khi chạy ${path.basename(filePath)}:`, err.message);
    throw err;
  }
}

async function runAllMigrations() {
  try {
    console.log('🚀 Bắt đầu chạy tất cả migration...\n');
    
    const migrations = [
      {
        file: path.join(__dirname, '../migrations/add_user_fields.sql'),
        description: 'Thêm các cột cho user (ho_ten, sdt, avatar)'
      },
      {
        file: path.join(__dirname, '../../database_scripts/create_yeu_thich_avatar.sql'),
        description: 'Tạo bảng yeu_thich và thêm cột avatar'
      },
      {
        file: path.join(__dirname, '../../database_scripts/create_danhmuc_baiviet.sql'),
        description: 'Tạo bảng danhmuc_baiviet'
      },
      {
        file: path.join(__dirname, '../migrations/update_donhang_table.sql'),
        description: 'Cập nhật bảng don_hang (Stripe payment)'
      },
      {
        file: path.join(__dirname, '../../database_scripts/create_phieu_nhap_xuat_kho.sql'),
        description: 'Tạo bảng phieu_nhap_xuat_kho'
      }
    ];
    
    for (const migration of migrations) {
      if (fs.existsSync(migration.file)) {
        await runMigrationFile(migration.file, migration.description);
      } else {
        console.log(`⚠️  File không tồn tại: ${migration.file}`);
      }
    }
    
    console.log('\n✅ Tất cả migration đã hoàn thành!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Lỗi khi chạy migration:', err.message);
    console.error('   Stack:', err.stack);
    process.exit(1);
  }
}

runAllMigrations();

