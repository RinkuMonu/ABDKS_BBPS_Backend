const jwt = require('jsonwebtoken');

function generatePaysprintJWT() {
    const timestamp = Math.floor(Date.now() / 1000);
    const requestId = Math.floor(Math.random() * 1000000000);
    const payload = {
        timestamp: timestamp,
        partnerId: 'PS0016226',
        reqid: requestId.toString()
    };
    const token = jwt.sign(payload, 'UFMwMDYyMjY0ZmJmYjIzYmNiMTliMDJjMmJjZWIxYjA5ZGUzNmJjYjE3NTEwMjI2Mzg=', {
        algorithm: 'HS256',
        header: {
            typ: 'JWT',
            alg: 'HS256'
        }
    });

    return token;
}

module.exports = generatePaysprintJWT; 
