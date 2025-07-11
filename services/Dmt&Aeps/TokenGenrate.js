const jwt = require('jsonwebtoken');

function generatePaysprintJWT() {
  const ts = Math.floor(Date.now() / 1000);

  // ✅ Truly unique reqid
  const reqid = ts.toString() + Math.floor(Math.random() * 1000).toString();

  const payload = {
    timestamp: ts,
    partnerId: 'PS006226', // ✅ Your live partnerId
    reqid: reqid
  };

  const secret = 'Your_LIVE_SECRET'; // ✅ Your live secret

  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    header: {
      typ: "JWT"
    }
  });

  return token;
}

module.exports = generatePaysprintJWT;
