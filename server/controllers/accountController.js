import { User, Address, RefreshToken } from '../models/AccountModels.js';
import { Setting } from '../models/SystemModels.js';
import { Order, Bill, DailyOrder } from '../models/CommerceModels.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwtUtils.js';
import { setTokensInCookies, clearAuthCookies } from '../utils/cookieHandler.js';
import { generateOtp, saveOtp, verifyOtp } from '../services/index.js';
import { sendOtpEmail, sendWelcomeEmail } from '../services/index.js';
import { storeRefreshToken, revokeRefreshToken, isTokenValidInDb } from '../services/index.js';
import { generateUserQRCode } from '../utils/qrUtils.js';
import * as userServices from '../services/userServices.js';

// --- Auth Section ---

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, appliedReferralCode } = req.body;

  const settings = await Setting.findOne();
  if (settings && !settings.enableRegistration) {
    return ApiResponse.error(res, 403, 'Registration is currently disabled by the administrator.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return ApiResponse.error(res, 400, 'User already exists');
  }

  let validReferralCode = null;
  if (appliedReferralCode) {
    const referrer = await User.findOne({ referralCode: appliedReferralCode });
    if (referrer) validReferralCode = appliedReferralCode;
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    appliedReferralCode: validReferralCode,
    referralCode: userServices.generateReferralCode(),
  });

  if (user) {
    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);

    return ApiResponse.success(res, 201, 'User registered successfully. Please verify your email with the OTP sent.', {
      email: user.email,
    });
  } else {
    return ApiResponse.error(res, 400, 'Invalid user data');
  }
});

/**
 * @desc    Verify OTP and log in
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
export const verifyUserOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const isValid = await verifyOtp(email, otp);
  if (!isValid) {
    return ApiResponse.error(res, 400, 'Invalid or expired OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  // Handle Referral Bonus on First Verification
  if (!user.isVerified && user.appliedReferralCode) {
    const referrer = await User.findOne({ referralCode: user.appliedReferralCode });
    if (referrer) {
      // Grant to Referrer
      referrer.walletBalance += 50;
      referrer.walletTransactions.unshift({
        amount: 50,
        type: 'Credit',
        description: `Referral bonus for signing up ${user.name}`
      });
      await referrer.save();

      // Grant to New User
      user.walletBalance += 50;
      user.walletTransactions.unshift({
        amount: 50,
        type: 'Credit',
        description: `Welcome bonus for using referral code ${user.appliedReferralCode}`
      });
    }
  }

  user.isVerified = true;

  if (!user.qrCode) {
    user.qrCode = await generateUserQRCode(user._id);
  }

  await user.save();

  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.error('Welcome email failed to send:', error.message);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const metadata = userServices.getSessionMetadata(req);
  await storeRefreshToken(user._id, refreshToken, metadata);
  
  // Track login history (keep last 10)
  user.loginHistory.unshift({ ...metadata, timestamp: new Date() });
  if (user.loginHistory.length > 10) user.loginHistory.pop();
  await user.save();

  setTokensInCookies(res, accessToken, refreshToken);

  return ApiResponse.success(res, 200, 'Email verified and logged in successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      qrCode: user.qrCode,
      supportStatus: user.supportStatus,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return ApiResponse.error(res, 401, 'Email is not registered');
  }

  if (await user.matchPassword(password)) {
    if (!user.isVerified) {
      const otp = generateOtp();
      await saveOtp(email, otp);
      await sendOtpEmail(email, otp);
      return ApiResponse.error(res, 403, 'Account not verified. OTP sent to email.', { needsVerification: true });
    }


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    if (!user.qrCode) {
      user.qrCode = await generateUserQRCode(user._id);
      await user.save();
    }

    const metadata = userServices.getSessionMetadata(req);
    await storeRefreshToken(user._id, refreshToken, metadata);

    // Track login history (keep last 10)
    user.loginHistory.unshift({ ...metadata, timestamp: new Date() });
    if (user.loginHistory.length > 10) user.loginHistory.pop();
    await user.save();

    setTokensInCookies(res, accessToken, refreshToken);

    return ApiResponse.success(res, 200, 'Logged in successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        qrCode: user.qrCode,
        supportStatus: user.supportStatus,
      },
    });
  } else {
    return ApiResponse.error(res, 401, 'Wrong credentials');
  }
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (via Refresh Cookie)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return ApiResponse.error(res, 401, 'No refresh token provided');
  }

  const isValidInDb = await isTokenValidInDb(incomingRefreshToken);
  if (!isValidInDb) {
    clearAuthCookies(res);
    return ApiResponse.error(res, 401, 'Invalid refresh token');
  }

  try {
    const decoded = verifyToken(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 401, 'User not found');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const metadata = userServices.getSessionMetadata(req);
    
    // Rotation: Revoke old and store new
    await revokeRefreshToken(incomingRefreshToken);
    await storeRefreshToken(user._id, newRefreshToken, metadata);

    setTokensInCookies(res, newAccessToken, newRefreshToken);

    return ApiResponse.success(res, 200, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh Token Error:', error.message);
    clearAuthCookies(res);
    return ApiResponse.error(res, 401, 'Refresh token expired or invalid');
  }
});

/**
 * @desc    Get Current Logged-in User (Me)
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  return ApiResponse.success(res, 200, 'User profile retrieved successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      qrCode: user.qrCode,
      supportStatus: user.supportStatus,
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  clearAuthCookies(res);
  return ApiResponse.success(res, 200, 'Logged out successfully');
});

/**
 * @desc    Forgot password — send reset OTP
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  const otp = generateOtp();
  await saveOtp(email, otp);
  await sendOtpEmail(email, otp);

  return ApiResponse.success(res, 200, 'Reset OTP sent to your email');
});

/**
 * @desc    Reset password using OTP
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  const isValid = await verifyOtp(email, otp);
  if (!isValid) {
    return ApiResponse.error(res, 400, 'Invalid or expired OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  user.password = password;
  await user.save();

  return ApiResponse.success(res, 200, 'Password reset successfully. You can now login.');
});

/**
 * @desc    Update User Profile
 * @route   PATCH /api/v1/auth/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    return ApiResponse.error(res, 404, 'User not found');
  }

  // Handle password change with current password verification
  if (newPassword) {
    if (!currentPassword) {
      return ApiResponse.error(res, 400, 'Current password is required to set a new password.');
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.error(res, 401, 'Invalid current password.');
    }
    user.password = newPassword;
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;

  if (req.body.notificationPreferences) {
    user.notificationPreferences = { ...user.notificationPreferences, ...req.body.notificationPreferences };
  }

  const updatedUser = await user.save();
  const completeness = await userServices.calculateCompleteness(updatedUser);

  return ApiResponse.success(res, 200, 'Profile updated successfully', {
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      qrCode: updatedUser.qrCode,
      avatar: updatedUser.avatar,
      referralCode: updatedUser.referralCode,
      notificationPreferences: updatedUser.notificationPreferences,
      completeness,
    }
  });
});

/**
 * @desc    Get Profile Stats and Overview
 * @route   GET /api/v1/auth/profile/stats
 * @access  Private
 */
export const getProfileStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalOrders = await Order.countDocuments({ user: userId });
  const activeSubscription = await DailyOrder.findOne({ user: userId, status: 'Active' });
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentBill = await Bill.findOne({ user: userId, month: currentMonth, year: currentYear });

  const user = await User.findById(userId);
  if (!user.referralCode) {
    user.referralCode = userServices.generateReferralCode();
    await user.save();
  }

  const completeness = await userServices.calculateCompleteness(user);

  return ApiResponse.success(res, 200, 'Profile stats retrieved', {
    totalOrders,
    subscriptionStatus: activeSubscription ? 'Active' : 'Inactive',
    currentBillAmount: currentBill ? currentBill.totalAmount : 0,
    referralCode: user.referralCode,
    walletBalance: user.walletBalance,
    walletTransactions: user.walletTransactions,
    memberSince: user.createdAt,
    completeness,
  });
});

/**
 * @desc    Get Active Sessions
 * @route   GET /api/v1/auth/profile/sessions
 * @access  Private
 */
export const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await RefreshToken.find({ user: req.user._id }).sort({ updatedAt: -1 });
  
  const formattedSessions = sessions.map(s => ({
    id: s._id,
    ip: s.ip || 'Unknown',
    device: s.deviceInfo || 'Unknown Device',
    lastActive: s.updatedAt,
    isCurrent: req.cookies.refreshToken === s.token,
  }));

  return ApiResponse.success(res, 200, 'Sessions retrieved successfully', formattedSessions);
});

/**
 * @desc    Revoke all sessions except current
 * @route   DELETE /api/v1/auth/profile/sessions
 * @access  Private
 */
export const revokeAllSessions = asyncHandler(async (req, res) => {
  const currentToken = req.cookies.refreshToken;
  await RefreshToken.deleteMany({ user: req.user._id, token: { $ne: currentToken } });
  
  return ApiResponse.success(res, 200, 'All other sessions have been logged out.');
});

/**
 * @desc    Delete Account (Hard Delete)
 * @route   POST /api/v1/auth/profile/delete-account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { confirmation } = req.body;
  
  if (confirmation !== 'DELETE') {
    return ApiResponse.error(res, 400, 'Please type DELETE to confirm account removal.');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return ApiResponse.error(res, 404, 'User not found.');
  }

  // 1. Delete associated data (Addresses & Tokens)
  await Address.deleteMany({ user: user._id });
  await RefreshToken.deleteMany({ user: user._id });

  // 2. Hard Delete the user
  await user.deleteOne();

  // 3. Clear auth cookies
  clearAuthCookies(res);

  return ApiResponse.success(res, 200, 'Account and all associated data have been permanently deleted.');
});

// --- Address Section ---

/**
 * @desc    Get all addresses for a user
 * @route   GET /api/v1/addresses
 * @access  Private
 */
export const getMyAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  return ApiResponse.success(res, 200, 'Addresses retrieved successfully', addresses);
});

/**
 * @desc    Create a new address
 * @route   POST /api/v1/addresses
 * @access  Private
 */
export const createAddress = asyncHandler(async (req, res) => {
  const { 
    name, 
    title,
    fullName,
    phone, 
    phoneNumber,
    address, 
    street,
    city, 
    state, 
    postalCode, 
    country, 
    isDefault 
  } = req.body;

  const addressData = {
    user: req.user._id,
    title: title || name,
    fullName: fullName || req.user.name,
    phoneNumber: phoneNumber || phone,
    street: street || address,
    city,
    state,
    postalCode,
    country: country || 'India',
    isDefault: !!isDefault
  };

  if (addressData.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const newAddress = await Address.create(addressData);

  return ApiResponse.success(res, 201, 'Address added successfully', newAddress);
});

/**
 * @desc    Update address
 * @route   PATCH /api/v1/addresses/:id
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const { isDefault } = req.body;
  const addressId = req.params.id;

  const address = await Address.findById(addressId);
  if (!address) {
    return ApiResponse.error(res, 404, 'Address not found');
  }

  if (address.user.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 403, 'Not authorized');
  }

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  const updatedAddress = await address.save();

  return ApiResponse.success(res, 200, 'Address updated successfully', updatedAddress);
});

/**
 * @desc    Delete address
 * @route   DELETE /api/v1/addresses/:id
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);
  if (!address) {
    return ApiResponse.error(res, 404, 'Address not found');
  }

  if (address.user.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 403, 'Not authorized');
  }

  await address.deleteOne();
  return ApiResponse.success(res, 200, 'Address deleted successfully');
});


