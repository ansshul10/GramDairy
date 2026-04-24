import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import { Order } from '../models/CommerceModels.js';

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const orders = await Order.find({ shortCode: { $exists: false } });
    console.log(`Found ${orders.length} orders without shortCode.`);

    for (const order of orders) {
      order.shortCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      await order.save();
      console.log(`Generated shortCode for Order ${order._id}: ${order.shortCode}`);
    }

    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
