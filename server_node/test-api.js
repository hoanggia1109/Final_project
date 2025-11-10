const http = require('http');

async function testAPI() {
  console.log("🧪 === TEST API ĐĂNG KÝ ===\n");
  
  const testData = JSON.stringify({
    email: `test_api_${Date.now()}@example.com`,
    password: "123456"
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/dangky',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };

  console.log(" Gửi request đến:", `http://localhost:5000${options.path}`);
  console.log(" Data:", JSON.parse(testData));

  const req = http.request(options, (res) => {
    let data = '';

    console.log("\n Response Status:", res.statusCode);
    console.log(" Response Headers:", res.headers);

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log("\n Response Body:", data);
      
      try {
        const jsonData = JSON.parse(data);
        console.log(" Response JSON:", jsonData);
        
        if (res.statusCode === 200) {
          console.log("\n ĐĂNG KÝ THÀNH CÔNG!");
          console.log(" Hãy vào PHPMyAdmin kiểm tra bảng nguoi_dung!");
        } else {
          console.log("\n ĐĂNG KÝ THẤT BẠI!");
          console.log("Lý do:", jsonData.message);
        }
      } catch (e) {
        console.log("  Response không phải JSON");
      }
    });
  });

  req.on('error', (error) => {
    console.error("\n LỖI KẾT NỐI:");
    console.error(error.message);
    console.log("\n Kiểm tra:");
    console.log("  1. Server đã chạy chưa? (node index.js)");
    console.log("  2. Port 3000 có bị block không?");
  });

  req.write(testData);
  req.end();
}

testAPI();

