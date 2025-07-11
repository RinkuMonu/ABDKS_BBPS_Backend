const jwt = require('jsonwebtoken');



function generatePaysprintJWT() {
  const ts =  ts.toString() + Math.floor(Math.random() * 1000).toString();

  const payload = {
    timestamp: ts,
    partnerId: 'PS006226', // ✅ Your exact live PartnerId here
    reqid: ts   // ✅ Unique request ID (can use timestamp as string)
  };

const secret = 'UFMwMDYyMjY0ZmJmYjIzYmNiMTliMDJjMmJjZWIxYjA5ZGUzNmJjYjE3NTEwMjI2Mzg=';  // ✅ Your exact live secret here

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    header: {
      typ: "JWT"
    }
  });

  return token;
}

module.exports = generatePaysprintJWT;
