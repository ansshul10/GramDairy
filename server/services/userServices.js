import { v4 as uuidv4 } from 'uuid';
import { Address } from '../models/AccountModels.js';

/**
 * Generate a unique referral code for a new user
 */
export const generateReferralCode = () => {
  return `GD${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

/**
 * Calculate Profile Completeness Percentage
 */
export const calculateCompleteness = async (user) => {
  let score = 0;
  const total = 5; // name, phone, email, address, avatar

  if (user.name) score++;
  if (user.phoneNumber) score++;
  if (user.email) score++;
  if (user.avatar) score++;

  // Check if user has at least one address
  const addressCount = await Address.countDocuments({ user: user._id });
  if (addressCount > 0) score++;

  return Math.round((score / total) * 100);
};

/**
 * Capture Login Session Metadata
 */
export const getSessionMetadata = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown Device';

  let deviceInfo = 'Unknown Device';
  if (userAgent.includes('Mobi')) deviceInfo = 'Mobile Device';
  else if (userAgent.includes('Windows')) deviceInfo = 'Windows PC';
  else if (userAgent.includes('Macintosh')) deviceInfo = 'Mac PC';
  else if (userAgent.includes('Linux')) deviceInfo = 'Linux PC';

  return { ip, userAgent, deviceInfo };
};
