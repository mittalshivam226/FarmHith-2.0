const https = require('https');
const options = {
  hostname: 'identitytoolkit.googleapis.com',
  port: 443,
  method: 'GET'
};
const req = https.request(options, res => {
  const cert = res.socket.getPeerCertificate();
  console.log('Valid From:', cert.valid_from);
  console.log('Valid To:', cert.valid_to);
  process.exit(0);
});
req.on('error', e => {
  console.error("error:", e);
});
req.end();
