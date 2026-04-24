import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import DailyOrder from '../models/DailyOrder.js';

dotenv.config();

const seed = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = 'ansshul10@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }
        console.log(`Found User: ${user.name} (${user._id})`);

        const product = await Product.findOne({});
        if (!product) {
            console.error('No products found in database.');
            process.exit(1);
        }
        console.log(`Found Product: ${product.name} (${product._id})`);

        let address = await Address.findOne({ user: user._id });
        if (!address) {
            console.log('No address found for user. Creating a default one...');
            address = await Address.create({
                user: user._id,
                fullName: user.name,
                phoneNumber: user.phoneNumber,
                addressLine1: 'Village Dairy Farm 1',
                city: 'Jaipur',
                state: 'Rajasthan',
                zipCode: '302001',
                country: 'India',
                isDefault: true,
                title: 'Home'
            });
        }
        console.log(`Using Address: ${address._id}`);

        // Set date to 30 days ago
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const subData = {
            user: user._id,
            product: product._id,
            address: address._id,
            quantity: 2,
            frequency: 'Daily',
            startDate,
            status: 'Active',
            pausedBy: 'User'
        };

        const existingSub = await DailyOrder.findOne({ user: user._id, product: product._id, status: 'Active' });
        if (existingSub) {
            console.log('Active subscription already exists. Updating its start date...');
            existingSub.startDate = startDate;
            await existingSub.save();
            console.log('Updated existing subscription.');
        } else {
            const newSub = await DailyOrder.create(subData);
            console.log('Created new subscription:', newSub._id);
        }

        console.log('Seed complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seed();
