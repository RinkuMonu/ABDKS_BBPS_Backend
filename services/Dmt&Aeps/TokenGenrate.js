const jwt = require("jsonwebtoken");

function generatePaysprintJWT() {
  const ts = Math.floor(Date.now() / 1000);

  // Truly unique reqid
  const reqid = Date.now().toString() + Math.floor(Math.random() * 1000000).toString();

  const payload = {
    timestamp: ts,
    partnerId: "PS006226", // ✅ Tumhara exact live PartnerId
    reqid: reqid
  };

  const secret = "UFMwMDYyMjY0ZmJmYjIzYmNiMTliMDJjMmJjZWIxYjA5ZGUzNmJjYjE3NTEwMjI2Mzg="; // ✅ Tumhara live secret

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    header: {
      typ: "JWT"
    }
  });

  console.log("✅ Payload:", payload);
  return token;
}

module.exports = generatePaysprintJWT;
