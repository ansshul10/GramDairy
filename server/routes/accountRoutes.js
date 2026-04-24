import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  verifyUserOtp,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  getProfileStats,
  getActiveSessions,
  revokeAllSessions,
  deleteAccount,
  getMe,
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/accountController.js';
import { protect, validate } from '../middlewares/index.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '../validators/index.js';

const router = express.Router();

// ── Auth Rate Limiters ────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many refresh attempts. Please try again later.' },
});

// --- Auth Routes (relative to /auth) ---
const authRouter = express.Router();
authRouter.post('/register', authLimiter, validate(registerSchema), register);
authRouter.post('/verify-otp', authLimiter, validate(verifyOtpSchema), verifyUserOtp);
authRouter.post('/login', authLimiter, validate(loginSchema), login);
authRouter.post('/refresh-token', refreshLimiter, refreshAccessToken);
authRouter.get('/me', protect, getMe);
authRouter.post('/logout', protect, logout);
authRouter.post('/forgot-password', authLimiter, forgotPassword);
authRouter.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);
authRouter.get('/profile/stats', protect, getProfileStats);
authRouter.get('/profile/sessions', protect, getActiveSessions);
authRouter.delete('/profile/sessions', protect, revokeAllSessions);
authRouter.post('/profile/delete-account', protect, deleteAccount);
authRouter.patch('/profile', protect, updateUserProfile);

// --- Address Routes (relative to /addresses) ---
const addressRouter = express.Router();
addressRouter.get('/', protect, getMyAddresses);
addressRouter.post('/', protect, createAddress);
addressRouter.patch('/:id', protect, updateAddress);
addressRouter.delete('/:id', protect, deleteAddress);

// --- User Routes (Some apps have /users/profile as well) ---
const userRouter = express.Router();
userRouter.patch('/profile', protect, updateUserProfile);

router.use('/auth', authRouter);
router.use('/addresses', addressRouter);
router.use('/users', userRouter);

export default router;
