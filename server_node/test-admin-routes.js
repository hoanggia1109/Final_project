// Script test admin routes
// Chạy: node test-admin-routes.js

const jwt = require('jsonwebtoken');

// Tạo token admin test
const testToken = jwt.sign(
  { id: 'test-admin-id', email: 'admin@admin.com', role: 'admin' },
  'SECRET_KEY',
  { expiresIn: '1h' }
);

console.log('🔑 Test Admin Token:');
console.log(testToken);
console.log('\n📋 Test với curl:');
console.log(`\ncurl -H "Authorization: Bearer ${testToken}" http://localhost:5001/admin/users\n`);
console.log('\n📋 Test với browser console:');
console.log(`
fetch('http://localhost:5001/admin/users', {
  headers: {
    'Authorization': 'Bearer ${testToken}'
  }
}).then(r => r.json()).then(console.log)
`);

