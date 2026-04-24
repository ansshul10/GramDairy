import QRCode from 'qrcode';

/**
 * Generate QR code as Base64 string
 * @param {string} text Data to encode
 * @returns {Promise<string>} Base64 data URL
 */
export const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      color: {
        dark: '#0369a1', // Primary 700
        light: '#ffffff'
      },
      width: 400,
      margin: 2
    });
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw err;
  }
};
