import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
  try {
    console.log('Connecting to MongoDB far away in the galaxy...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const collection = mongoose.connection.collection('deliveryboys');
    
    // Check if the index exists
    const indexes = await collection.indexes();
    const hasEmailIndex = indexes.some(idx => idx.name === 'email_1');

    if (hasEmailIndex) {
      console.log('Found orphan index "email_1". Dropping it now...');
      await collection.dropIndex('email_1');
      console.log('✅ Index "email_1" dropped successfully.');
    } else {
      console.log('ℹ️ Index "email_1" not found. No cleanup needed.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
    process.exit(1);
  }
};

cleanup();
