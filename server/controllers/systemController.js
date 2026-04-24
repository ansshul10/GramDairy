import { Setting, Notification, SupportTicket, StoreLocation, NewsletterSubscriber } from '../models/SystemModels.js';
import { User } from '../models/AccountModels.js';
import { Order } from '../models/CommerceModels.js';
import { Product } from '../models/CatalogModels.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { 
  sendEmail, 
  getEmailTemplate, 
  sendSupportCreatedEmail, 
  sendSupportReplyEmail,
  sendNewsletterWelcomeEmail,
  sendNewsletterBlastEmail
} from '../services/index.js';

// --- Admin Section ---

/**
 * @desc    Get dashboard stats
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
export const getStats = asyncHandler(async (req, res) => {
  const totalRevenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);

  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();
  const activeSubscriptions = await Order.countDocuments({ isSubscription: true, orderStatus: 'Processing' });

  return ApiResponse.success(res, 200, 'Admin stats retrieved', {
    revenue: totalRevenue[0]?.total || 0,
    orders: totalOrders,
    users: totalUsers,
    products: totalProducts,
    activeSubscriptions
  });
});

/**
 * @desc    Get recent activities
 * @route   GET /api/v1/admin/activities
 * @access  Private/Admin
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  const recentUsers = await User.find({ role: 'user' })
    .sort({ createdAt: -1 })
    .limit(5);

  return ApiResponse.success(res, 200, 'Recent activities retrieved', {
    recentOrders,
    recentUsers
  });
});

/**
 * @desc    Get all users (Admin view)
 * @route   GET /api/v1/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'User list retrieved', users);
});

// --- Settings Section ---

/**
 * @desc    Get global settings
 * @route   GET /api/v1/settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  return ApiResponse.success(res, 200, 'Settings retrieved', settings);
});

/**
 * @desc    Update global settings
 * @route   PUT /api/v1/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  return ApiResponse.success(res, 200, 'Settings updated successfully', settings);
});

// --- Notification Section ---

/**
 * @desc    Get notifications for user
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);
  return ApiResponse.success(res, 200, 'Notifications retrieved', notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return ApiResponse.error(res, 404, 'Notification not found');
  notification.isRead = true;
  await notification.save();
  return ApiResponse.success(res, 200, 'Marked as read', notification);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
  return ApiResponse.success(res, 200, 'All marked as read');
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification || notification.recipient.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 404, 'Notification not found');
  }
  await notification.deleteOne();
  return ApiResponse.success(res, 200, 'Notification removed');
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });
  return ApiResponse.success(res, 200, 'All notifications purged');
});

/**
 * @desc    Create & emit a notification (Service helper)
 */
export const createNotification = async (io, userId, title, message, type = 'System') => {
  const notification = await Notification.create({ recipient: userId, title, message, type });
  if (io) io.to(userId.toString()).emit('new_notification', notification);
  return notification;
};

export const sendNotificationToUser = asyncHandler(async (req, res) => {
  const { userId, title, message, type = 'info' } = req.body;
  const io = req.app.get('io');
  const notification = await createNotification(io, userId, title, message, type);
  return ApiResponse.success(res, 201, 'Notification dispatched', notification);
});

// --- Support Section ---

export const createSupportTicket = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, category, priority, subject, message, metadata } = req.body;
  const ticket = await SupportTicket.create({
    user: req.user?._id || null,
    name, email, phoneNumber, category, priority, subject, message, metadata
  });

  try {
    const trackUrl = `${process.env.FRONTEND_URL}/support/track?id=${ticket.ticketId}`;
    await sendSupportCreatedEmail({ ...ticket.toObject(), name, email }, trackUrl);
  } catch (err) { console.error('Support created email failed:', err); }

  return ApiResponse.success(res, 201, 'Request submitted', ticket);
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Support history retrieved', tickets);
});

export const trackTicket = asyncHandler(async (req, res) => {
  const { ticketId, email } = req.body;
  const ticket = await SupportTicket.findOne({ ticketId, email: email?.toLowerCase() });
  if (!ticket) return ApiResponse.error(res, 404, 'Ticket not found');
  return ApiResponse.success(res, 200, 'Ticket found', ticket);
});

export const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find(req.query).populate('user', 'name phoneNumber').sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'All tickets retrieved', tickets);
});

export const replyToTicket = asyncHandler(async (req, res) => {
  const { message, internalNotes, status = 'Replied' } = req.body;
  const ticket = await SupportTicket.findById(req.params.id).populate('user');
  if (!ticket) return ApiResponse.error(res, 404, 'Ticket not found');

  if (message) {
    ticket.replies.push({ sender: 'Admin', message });
    ticket.status = status;
  }
  if (internalNotes !== undefined) ticket.internalNotes = internalNotes;
  await ticket.save();

  if (ticket.user) {
    await createNotification(req.app.get('io'), ticket.user._id, 'Support Replied', `New response to [${ticket.ticketId}]`);
  }

  if (message) {
    try {
      const trackUrl = `${process.env.FRONTEND_URL}/support/track?id=${ticket.ticketId}`;
      await sendSupportReplyEmail(ticket.toObject ? ticket.toObject() : ticket, message, trackUrl);
    } catch (e) { console.error('Support reply email failed:', e); }
  }

  return ApiResponse.success(res, 200, 'Reply sent', ticket);
});


// --- Public / App Section ---

export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name phone createdAt');
  if (!user) return ApiResponse.error(res, 404, 'User not found');

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const deliveryStats = await Order.aggregate([
    { $match: { user: user._id, orderStatus: 'Delivered', createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
    { $group: { _id: null, totalDeliveries: { $sum: 1 }, totalQuantity: { $sum: { $arrayElemAt: ['$orderItems.quantity', 0] } } } }
  ]);

  const stats = deliveryStats[0] || { totalDeliveries: 0, totalQuantity: 0 };
  return ApiResponse.success(res, 200, 'Public profile', { user, stats });
});

export const getSystemStatus = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const successfulDeliveries = await Order.countDocuments({ orderStatus: 'Delivered' });
  const successRate = totalOrders > 0 ? (successfulDeliveries / totalOrders * 100).toFixed(1) : "99.9";

  return ApiResponse.success(res, 200, 'System status', {
    health: { server: 'Healthy', database: 'Online' },
    metrics: { deliverySuccessRate: `${successRate}%`, activePartners: '740+', verifiedFarms: '12' },
    lastUpdated: new Date()
  });
});

// --- Store Locator Section ---

/**
 * @desc    Get all store locations (Public)
 * @route   GET /api/v1/system/stores
 */
export const getStoreLocations = asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.type) query.type = req.query.type;
  if (req.query.city) query.city = new RegExp(req.query.city, 'i');
  if (req.query.pinCode) query.pinCode = req.query.pinCode;

  const stores = await StoreLocation.find(query).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Stores retrieved', stores);
});

/**
 * @desc    Create a store location (Admin)
 * @route   POST /api/v1/system/stores
 */
export const createStoreLocation = asyncHandler(async (req, res) => {
  const store = await StoreLocation.create(req.body);
  return ApiResponse.success(res, 201, 'Store location created', store);
});

/**
 * @desc    Update a store location (Admin)
 * @route   PUT /api/v1/system/stores/:id
 */
export const updateStoreLocation = asyncHandler(async (req, res) => {
  const store = await StoreLocation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!store) return ApiResponse.error(res, 404, 'Store location not found');
  return ApiResponse.success(res, 200, 'Store location updated', store);
});

/**
 * @desc    Delete a store location (Admin)
 * @route   DELETE /api/v1/system/stores/:id
 */
export const deleteStoreLocation = asyncHandler(async (req, res) => {
  const store = await StoreLocation.findByIdAndDelete(req.params.id);
  if (!store) return ApiResponse.error(res, 404, 'Store location not found');
  return ApiResponse.success(res, 200, 'Store location deleted');
});

// --- Newsletter Section ---

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/v1/system/public/newsletter/subscribe
 */
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) return ApiResponse.error(res, 400, 'Email is required');

  let subscriber = await NewsletterSubscriber.findOne({ email });

  if (subscriber) {
    if (subscriber.status === 'subscribed') {
      return ApiResponse.error(res, 400, 'You are already subscribed');
    }
    // Re-subscribe
    subscriber.status = 'subscribed';
    await subscriber.save();
  } else {
    subscriber = await NewsletterSubscriber.create({ email });
  }

  // Send advanced welcome email
  try {
    const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?email=${email}`;
    await sendNewsletterWelcomeEmail(email, unsubscribeUrl);
  } catch (err) {
    console.error('Newsletter welcome email failed:', err);
  }

  return ApiResponse.success(res, 201, 'Subscribed successfully', subscriber);
});

/**
 * @desc    Unsubscribe from newsletter
 * @route   POST /api/v1/system/public/newsletter/unsubscribe
 */
export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return ApiResponse.error(res, 400, 'Email is required');

  const subscriber = await NewsletterSubscriber.findOne({ email });
  if (!subscriber) return ApiResponse.error(res, 404, 'Subscriber not found');

  subscriber.status = 'unsubscribed';
  await subscriber.save();

  return ApiResponse.success(res, 200, 'Unsubscribed successfully');
});

/**
 * @desc    Get all newsletter subscribers (Admin)
 */
export const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Subscribers retrieved', subscribers);
});

/**
 * @desc    Send newsletter blast (Admin)
 */
export const sendNewsletterBlast = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return ApiResponse.error(res, 400, 'Subject and message are required');

  const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' });
  
  if (subscribers.length === 0) {
    return ApiResponse.error(res, 400, 'No active subscribers found');
  }

  // Send in background
  const sendBlasts = async () => {
    for (const sub of subscribers) {
      try {
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?email=${sub.email}`;
        await sendNewsletterBlastEmail(sub.email, subject, message, unsubscribeUrl);
      } catch (err) {
        console.error(`Blast failed for ${sub.email}:`, err);
      }
    }
  };

  sendBlasts(); // Fire and forget for speed, logs will catch failures

  return ApiResponse.success(res, 200, `Blast initiated for ${subscribers.length} subscribers`);
});
