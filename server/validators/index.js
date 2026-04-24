import { z } from 'zod';

/**
 * Registration Validation Schema
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

/**
 * Login Validation Schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * OTP Verification Schema
 */
export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Category Validation Schema
 */
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isActive: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional()),
});

/**
 * Product Validation Schema
 */
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  discountPrice: z.coerce.number().nonnegative('Discount price cannot be negative').optional(),
  category: z.string().length(24, 'Invalid Category ID'), // MongoDB ObjectId length
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  unit: z.enum(['L', 'ml', 'kg', 'g', 'pc', 'pack']),
  isFeatured: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional()),
  isDailyEssential: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional()),
});
