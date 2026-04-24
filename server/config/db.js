import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async (retries = 3, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
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
