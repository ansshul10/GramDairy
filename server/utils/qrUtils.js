import QRCode from 'qrcode';

/**
 * Generate a QR code for a user profile
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - Base64 data URL
 */
export const generateUserQRCode = async (userId) => {
  try {
    // The link that the QR code will direct to
    const publicUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/public/profile/${userId}`;
    
    // Generate QR code as a data URL
    const qrDataUrl = await QRCode.toDataURL(publicUrl, {
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      width: 400,
      margin: 2,
    });
    
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};
