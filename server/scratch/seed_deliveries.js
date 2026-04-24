import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Order from '../models/Order.js';
import DailyOrder from '../models/DailyOrder.js';
import Product from '../models/Product.js';
import Bill from '../models/Bill.js';

dotenv.config();

const seedDeliveries = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = 'ansshul10@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User ${email} not found.`);
            process.exit(1);
        }

        const sub = await DailyOrder.findOne({ user: user._id }).populate('product');
        if (!sub) {
            console.error('No subscription found for user. Creating one...');
            const product = await Product.findOne({});
            const address = await Address.findOne({ user: user._id });
            sub = await DailyOrder.create({
                user: user._id,
                product: product._id,
                address: address._id,
                quantity: 2,
                frequency: 'Daily',
                startDate: new Date(),
                status: 'Active'
            });
        }
        
        // Ensure it's active
        sub.status = 'Active';
        await sub.save();
        
        console.log(`Found Subscription: ${sub._id} for ${sub.product.name}`);

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Clear existing orders for current and previous months to avoid duplicates
        const twoMonthsAgo = new Date(year, month - 1, 1);
        await Order.deleteMany({
            subscription: sub._id,
            createdAt: { $gte: twoMonthsAgo }
        });
        console.log('Cleared existing orders for last 60 days.');

        console.log('Creating 60 mock deliveries (30 in current month, 30 in previous month)...');
        
        // 30 in previous month
        for (let i = 1; i <= 30; i++) {
            const deliveryDate = new Date(year, month - 1, i, 7, 0, 0); 
            const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase() + 'P' + i;
            await Order.create({
                user: user._id,
                subscription: sub._id,
                shortCode,
                orderItems: [{
                    name: sub.product.name,
                    quantity: sub.quantity,
                    price: sub.product.discountPrice || sub.product.price,
                    image: sub.product.images[0] || '',
                    product: sub.product._id
                }],
                shippingAddress: {
                    address: 'Village Dairy Farm 1',
                    city: 'Jaipur',
                    postalCode: '302001',
                    country: 'India'
                },
                totalPrice: (sub.product.discountPrice || sub.product.price) * sub.quantity,
                isPaid: true,
                paidAt: deliveryDate,
                isDelivered: true,
                deliveredAt: deliveryDate,
                orderStatus: 'Delivered',
                paymentMethod: 'Online',
                createdAt: deliveryDate,
                updatedAt: deliveryDate
            });
        }

        // Create a BILL for the previous month so "Pay Now" logic is triggered
        const prevMonthTotal = (sub.product.discountPrice || sub.product.price) * sub.quantity * 30;
        await Bill.deleteMany({ subscription: sub._id, month: month, year: year }); // Month is 1-indexed, month - 1 + 1 = month
        await Bill.create({
            user: user._id,
            subscription: sub._id,
            month: month === 0 ? 12 : month, // 1-indexed previous month
            year: month === 0 ? year - 1 : year,
            totalAmount: prevMonthTotal,
            status: 'Pending',
            dueDate: new Date(year, month, 10)
        });
        
        // Update user's aggregate pending balance
        await User.findByIdAndUpdate(user._id, { $inc: { totalPendingBill: prevMonthTotal } });
        
        console.log('Generated a Pending Bill for the previous month and updated user balance.');

        // 30 in current month
        for (let i = 1; i <= 30; i++) {
            const deliveryDate = new Date(year, month, i, 7, 0, 0); 
            const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase() + 'C' + i;
            await Order.create({
                user: user._id,
                subscription: sub._id,
                shortCode,
                orderItems: [{
                    name: sub.product.name,
                    quantity: sub.quantity,
                    price: sub.product.discountPrice || sub.product.price,
                    image: sub.product.images[0] || '',
                    product: sub.product._id
                }],
                shippingAddress: {
                    address: 'Village Dairy Farm 1',
                    city: 'Jaipur',
                    postalCode: '302001',
                    country: 'India'
                },
                totalPrice: (sub.product.discountPrice || sub.product.price) * sub.quantity,
                isPaid: true,
                paidAt: deliveryDate,
                isDelivered: true,
                deliveredAt: deliveryDate,
                orderStatus: 'Delivered',
                paymentMethod: 'Online',
                createdAt: deliveryDate,
                updatedAt: deliveryDate
            });
        }

        console.log('Successfully seeded 60 deliveries and 1 bill.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seedDeliveries();
