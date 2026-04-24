import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/AccountModels.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const adminEmail = 'admin@gramdairy.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    // Attempt to drop the problematic index if it exists
    try {
      await User.collection.dropIndex('username_1');
      console.log('Dropped stale username index.');
    } catch (err) {
      // Index might not exist, ignore
    }

    const admin = new User({
      name: 'GramDairy Admin',
      email: adminEmail,
      password: '@Ansshul10',
      phoneNumber: '9685527839',
      role: 'admin',
      isVerified: true
    });

    await admin.save();
    console.log('Admin seeded successfully!');
    console.log('Email: admin@gramdairy.com');
    console.log('Password: AdminPassword123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
