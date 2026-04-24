import jwt from 'jsonwebtoken';
import { User } from '../models/AccountModels.js';
import { verifyToken } from '../utils/jwtUtils.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import morgan from 'morgan';
import multer from 'multer';
import { productStorage, categoryStorage, deliveryStorage } from '../config/cloudinaryConfig.js';

/**
 * Protect middleware — verify access token in cookies
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
});

/**
 * Admin middleware — restrict to admin role
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
};

/**
 * Delivery Boy middleware — restrict to delivery-boy role
 */
export const deliveryBoy = (req, res, next) => {
  if (req.user && (req.user.role === 'delivery-boy' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as a delivery boy',
    });
  }
};

/**
 * Global Error Handling Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error
  logger.error(`${req.method} ${req.url} - ${message}`, {
    stack: err.stack,
    user: req.user?._id,
    ip: req.ip
  });

  // Handle Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  // Handle Mongoose Duplicate Key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Morgan HTTP Request Logger
 * Logs every request — method, url, status, response size, and timing.
 * Output is piped into Winston's `http` level and formatted in the terminal.
 */
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

export const morganMiddleware = morgan(
  // Parsed by logger.js prettyConsoleFormat → METHOD URL STATUS SIZE TIME
  ':method :url :status :res[content-length] - :response-time',
  { stream: morganStream }
);

/**
 * Middleware to validate request body using Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    console.error('Validation Error Details:', JSON.stringify(error.errors, null, 2));
    console.error('Request Body:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map((e) => ({
        path: e.path[0],
        message: e.message,
      })),
    });
  }
};

/**
 * File Upload Middlewares
 */
export const uploadProductImage = multer({ storage: productStorage }).array('images', 5);
export const uploadCategoryImage = multer({ storage: categoryStorage }).single('image');
export const uploadDeliveryDoc = multer({ storage: deliveryStorage }).single('idCardImage');
export const uploadAvatar = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 2 * 1024 * 1024 } 
}).single('avatar');
