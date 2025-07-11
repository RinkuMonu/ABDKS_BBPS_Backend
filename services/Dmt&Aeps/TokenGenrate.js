const jwt = require('jsonwebtoken');

function generatePaysprintJWT() {
  const payload = {
    timestamp: Math.floor(Date.now() / 1000),
    partnerId: 'PS006226' // <-- Yeh apna actual partnerId daalo exactly Paysprint wale ka
  };

  const secret = 'UFMwMDYyMjY0ZmJmYjIzYmNiMTliMDJjMmJjZWIxYjA5ZGUzNmJjYjE3NTEwMjI2Mzg='; // <-- Apni actual secret key daalo

  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    header: {
      typ: 'JWT'
    }
  });

  return token;
}

module.exports = generatePaysprintJWT;
