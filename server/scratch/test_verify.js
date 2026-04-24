import { generateSecret, verifySync } from 'otplib';

const secret = 'JBSWY3DPEHPK3PXP'; // Example base32 secret
const token = '123456'; // Incorrect token

const isValid = verifySync({ token, secret });

console.log(`Secret: ${secret}`);
console.log(`Token: ${token}`);
console.log(`Is Valid: ${isValid}`);

if (isValid === true) {
  console.log('BUG DETECTED: Incorrect token marked as valid!');
} else {
  console.log('Token correctly identified as invalid.');
}
