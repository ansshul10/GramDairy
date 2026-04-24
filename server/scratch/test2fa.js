import { generateSecret, generateURI } from 'otplib';

try {
  const secret = generateSecret();
  console.log('Secret generated:', secret);
  const otpauth = generateURI({
    issuer: 'GramDairy',
    label: 'test@example.com',
    secret,
  });
  console.log('OTPAuth URI generated:', otpauth);
  process.exit(0);
} catch (err) {
  console.error('Error during 2FA generation test:', err);
  process.exit(1);
}
