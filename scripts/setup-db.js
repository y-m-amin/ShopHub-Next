import https from 'https';

const postData = JSON.stringify({});

const options = {
  hostname: 'nexus-techhub.vercel.app',
  port: 443,
  path: '/api/setup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('Initializing database...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', response);

      if (res.statusCode === 200) {
        console.log('✅ Database setup completed successfully!');
      } else {
        console.log('❌ Database setup failed:', response.message);
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();
