const jwt = require('jsonwebtoken');

function generatePaysprintJWT() {
  // Millisecond timestamp (more unique)
  const ts = Math.floor(Date.now() / 1000);

  // Create large random part to ensure unique reqid
  const reqid = Date.now().toString() + Math.floor(Math.random() * 1000000).toString();

  const payload = {
    timestamp: ts,
    partnerId: 'PS006226', // ✅ Apna exact live partnerId
    reqid: reqid           // ✅ Now truly unique
  };

  const secret = 'UFMwMDYyMjY0ZmJmYjIzYmNiMTliMDJjMmJjZWIxYjA5ZGUzNmJjYjE3NTEwMjI2Mzg='; // ✅ Apna exact live secret

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    header: {
      typ: "JWT"
    }
  });

  console.log("✅ Generated JWT Token:", token);
  console.log("✅ Payload:", payload);

  return token;
}

module.exports = generatePaysprintJWT;
