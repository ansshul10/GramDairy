import cron from 'node-cron';
import { DailyOrder } from '../models/CommerceModels.js';
import { Order } from '../models/CommerceModels.js';
import { User } from '../models/AccountModels.js';
import { Notification } from '../models/SystemModels.js';
import { Product } from '../models/CatalogModels.js';

/**
 * Initialize all cron jobs
 */
const initCronJobs = (io) => {
  
  // 1. Daily Order Generation (At 00:00 every day)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running Daily Order Generation Job...');
    try {
      const activeSubscriptions = await DailyOrder.find({ status: 'Active' }).populate('product');
      
      for (const sub of activeSubscriptions) {
        // Skip if user is blacklisted for non-payment
        const user = await User.findById(sub.user);
        if (user?.isSubscriptionBlacklisted) continue;

        const product = sub.product;
        const price = product.discountPrice || product.price;
        const totalPrice = price * sub.quantity;

        await Order.create({
          user: sub.user,
          subscription: sub._id,
          orderItems: [{
            name: product.name,
            quantity: sub.quantity,
            image: product.images[0] || '/placeholder.jpg',
            price: price,
            product: sub.product
          }],
          shippingAddress: {
             address: 'Subscription Address', // Should ideally fetch from Address model
             city: 'Local',
             postalCode: '000000',
             country: 'India'
          },
          paymentMethod: 'Subscription',
          totalPrice: totalPrice,
          itemsPrice: totalPrice,
          isPaid: false,
          orderStatus: 'Processing'
        });

        // Notify user
        await Notification.create({
          user: sub.user,
          title: 'Daily Delivery Scheduled',
          message: `Your subscription item for today has been scheduled for delivery in ${sub.deliverySlot}`,
          type: 'subscription'
        });
        
        io.to(sub.user.toString()).emit('new_notification');
      }
    } catch (err) {
      console.error('Error in Daily Order Generation Job:', err);
    }
  });

  // 2. Cleanup Old Notifications/OTPs (At 03:00 every Sunday)
  cron.schedule('0 3 * * 0', async () => {
    console.log('Running Cleanup Job...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await Notification.deleteMany({ isRead: true, createdAt: { $lt: thirtyDaysAgo } });
      console.log('Cleanup complete: Deleted old notifications');
    } catch (err) {
      console.error('Error in Cleanup Job:', err);
    }
  });

  console.log('Cron Scheduler Initialized');
};

export default initCronJobs;
