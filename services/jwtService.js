function encryptPidData(piddata, key, iv) {
  console.log("✅ [encryptPidData] Original PID Data length:", piddata.length);
  console.log("✅ [encryptPidData] Key Buffer:", key);
  console.log("✅ [encryptPidData] IV Buffer:", iv);

  const keyBuf = Buffer.isBuffer(key) ? key : Buffer.from(key, 'utf8');
  const ivBuf = Buffer.isBuffer(iv) ? iv : Buffer.from(iv, 'utf8');

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuf, ivBuf);
  const raw = Buffer.concat([
    cipher.update(piddata, 'utf8'),
    cipher.final()
  ]);

  const encryptedBase64 = raw.toString('base64');
  console.log("✅ [encryptPidData] Encrypted PID Data (base64) length:", encryptedBase64.length);

  return encryptedBase64;
}
