import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async (retries = 3, delay = 3000) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const options = {
    // Connection pool size — tune based on expected concurrency
    maxPoolSize: isProduction ? 20 : 5,
    // How long to wait for a connection from the pool
    serverSelectionTimeoutMS: 5000,
    // How long to wait for a query to complete
    socketTimeoutMS: 45000,
    // Buffering — in production, fail fast on connection issues
    bufferCommands: !isProduction,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      logger.info(`[DB] MongoDB connected → ${conn.connection.host}`);
      return;
    } catch (error) {
      const isConnRefused =
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('querySrv');

      logger.error(
        `[DB] Connection attempt ${attempt}/${retries} failed: ${error.message}`
      );

      if (isConnRefused) {
        logger.warn(
          '[DB] Fix: MongoDB Atlas → Security → Network Access → whitelist your IP (or 0.0.0.0/0 for dev)'
        );
      }

      if (attempt < retries) {
        logger.info(`[DB] Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        logger.error('[DB] All connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

export default connectDB;
