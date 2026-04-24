import crypto from 'crypto';
import QRCode from 'qrcode';
import { Order, DailyOrder, Bill, Coupon } from '../models/CommerceModels.js';
import { Product, Review } from '../models/CatalogModels.js';
import { User, Address } from '../models/AccountModels.js';
import { Setting, Notification } from '../models/SystemModels.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { 
  sendOrderConfirmationEmail,
  sendEmail,
  generateOtp,
  sendSubscriptionStatusEmail,
  sendPaymentConfirmedEmail,
} from '../services/index.js';

// --- Helper Functions ---

const generateQrToken = (orderId) => {
  const timestamp = Date.now().toString();
  const payload = `${orderId}:${timestamp}`;
  const secret = process.env.QR_SECRET || process.env.JWT_ACCESS_SECRET;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
};

export const verifyQrToken = (token) => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };

    const [orderId, timestamp, receivedHmac] = parts;
    const payload = `${orderId}:${timestamp}`;
    const secret = process.env.QR_SECRET || process.env.JWT_ACCESS_SECRET;
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    const valid = crypto.timingSafeEqual(
      Buffer.from(receivedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
    return { valid, orderId };
  } catch {
    return { valid: false };
  }
};

const createInternalNotification = async (io, recipient, title, message, type) => {
  try {
    const notification = await Notification.create({ recipient, title, message, type });
    if (io) io.to(recipient.toString()).emit('new_notification', notification);
    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
  }
};

// --- Order Section ---

/**
 * @desc    Create new order
 */
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: initialTotalPrice,
    pointsToRedeem = 0,
    couponCode,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return ApiResponse.error(res, 400, 'No order items');
  }

  const settings = await Setting.findOne();
  if (settings) {
    if (!settings.enableOrdering) {
      return ApiResponse.error(res, 403, 'The store is currently closed. Ordering is disabled.');
    }
    if (settings.minimumOrderValue > 0 && itemsPrice < settings.minimumOrderValue) {
      return ApiResponse.error(res, 400, `Minimum order value must be at least ₹${settings.minimumOrderValue}`);
    }
  }

  for (const item of orderItems) {
    const product = await Product.findById(item._id);
    if (!product) {
      return ApiResponse.error(res, 404, `Product not found: ${item.name}`);
    }
    if (product.stock < item.quantity) {
      return ApiResponse.error(res, 400, `Insufficient stock for ${item.name}`);
    }
    product.stock -= item.quantity;
    await product.save();
  }

  // 0. Process Coupon Verification
  let couponAppliedObj = null;
  if (couponCode) {
    couponAppliedObj = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, endDate: { $gt: Date.now() } });
    if (!couponAppliedObj) {
      return ApiResponse.error(res, 400, 'Invalid or expired coupon');
    }

    const previousUsage = await Order.findOne({ user: req.user._id, couponCode: couponAppliedObj.code });
    if (previousUsage) {
      return ApiResponse.error(res, 400, 'You have already used this coupon on a previous order.');
    }

    if (itemsPrice < couponAppliedObj.minPurchase) {
      return ApiResponse.error(res, 400, `Min purchase of ₹${couponAppliedObj.minPurchase} required to use this coupon`);
    }
  }

  // 1. Process Wallet Redemption
  const userObj = await User.findById(req.user._id);
  let finalTotalPrice = initialTotalPrice;
  let pointsUsed = 0;

  if (pointsToRedeem > 0) {
    if (userObj.walletBalance < pointsToRedeem) {
      return ApiResponse.error(res, 400, 'Insufficient wallet balance');
    }
    if (pointsToRedeem > initialTotalPrice) {
      return ApiResponse.error(res, 400, 'Points redeemed cannot exceed the total price');
    }
    
    pointsUsed = pointsToRedeem;
    finalTotalPrice -= pointsUsed;

    // Debit transaction
    userObj.walletBalance -= pointsUsed;
    userObj.walletTransactions.unshift({
      amount: pointsUsed,
      type: 'Debit',
      description: 'Points used for order payment'
    });
  }

  // 2. Process Cashback Earning (2% of final total price)
  const pointsEarned = Math.floor(finalTotalPrice * 0.02);
  
  if (pointsEarned > 0) {
    userObj.walletBalance += pointsEarned;
    userObj.walletTransactions.unshift({
      amount: pointsEarned,
      type: 'Credit',
      description: 'Cashback earned from order purchase'
    });
  }

  await userObj.save();

  // 3. Mark Coupon Usage
  if (couponAppliedObj) {
    couponAppliedObj.usedCount += 1;
    if (couponAppliedObj.usageLimit > 0 && couponAppliedObj.usedCount >= couponAppliedObj.usageLimit) {
      couponAppliedObj.isActive = false;
    }
    await couponAppliedObj.save();
  }

  const order = new Order({
    user: req.user._id,
    orderItems: orderItems.map((x) => ({
      ...x,
      product: x._id,
      _id: undefined,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice: finalTotalPrice,
    pointsUsed,
    pointsEarned,
    discountPrice: couponAppliedObj ? couponAppliedObj.discountAmount : 0,
    couponCode: couponAppliedObj ? couponAppliedObj.code : undefined,
  });

  const createdOrder = await order.save();

  try {
    const qrToken = generateQrToken(createdOrder._id.toString());
    const qrData = JSON.stringify({ token: qrToken, app: 'gramdairy' });
    const qrCode = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: { dark: '#1a3c1a', light: '#ffffff' },
    });

    createdOrder.qrToken = qrToken;
    createdOrder.qrCode = qrCode;
    createdOrder.shortCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    await createdOrder.save();
  } catch (err) {
    console.error('QR Code generation failed:', err.message);
  }

  const populatedOrder = await Order.findById(createdOrder._id).populate('user', 'name email');
  try {
    await sendOrderConfirmationEmail(populatedOrder);
  } catch (error) {
    console.error('Order confirmation email failed:', error.message);
  }

  try {
    const io = req.app.get('io');
    await createInternalNotification(
      io, 
      req.user._id, 
      'Order Confirmed', 
      `Your order #${createdOrder.shortCode || createdOrder._id} has been successfully placed.`,
      'Order'
    );
  } catch (error) {
    console.error('Order notification failed:', error.message);
  }

  return ApiResponse.success(res, 201, 'Order created successfully', createdOrder);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .select('+deliveryOtp');

  if (!order) return ApiResponse.error(res, 404, 'Order not found');

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isDeliveryBoy = req.user.role === 'delivery-boy';

  if (!isOwner && !isAdmin && !isDeliveryBoy) {
    return ApiResponse.error(res, 403, 'Not authorized to view this order');
  }

  const data = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .select('+qrToken +deliveryOtp');
  
  return ApiResponse.success(res, 200, 'Order retrieved successfully', data.toObject({ getters: true }));
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return ApiResponse.error(res, 404, 'Order not found');

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  const updatedOrder = await order.save();
  return ApiResponse.success(res, 200, 'Order payment updated', updatedOrder);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Orders retrieved successfully', orders);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'All orders retrieved', orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return ApiResponse.error(res, 404, 'Order not found');

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  try {
    const io = req.app.get('io');
    await createInternalNotification(
      io, 
      updatedOrder.user, 
      `Order ${updatedOrder.orderStatus}`, 
      `Status Update: Your order #${updatedOrder.shortCode || updatedOrder._id} is now ${updatedOrder.orderStatus}.`,
      'Order'
    );
  } catch (error) {
    console.error('Status update notification failed:', error.message);
  }

  return ApiResponse.success(res, 200, `Order status updated to ${req.body.status}`, updatedOrder);
});

export const regenerateOrderQr = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).select('+qrToken');
  if (!order) return ApiResponse.error(res, 404, 'Order not found');

  const qrToken = generateQrToken(order._id.toString());
  const qrData = JSON.stringify({ token: qrToken, app: 'gramdairy' });
  const qrCode = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 400,
    color: { dark: '#1a3c1a', light: '#ffffff' },
  });

  order.qrToken = qrToken;
  order.qrCode = qrCode;
  await order.save();

  return ApiResponse.success(res, 200, 'QR code regenerated', { qrCode });
});

// --- Subscription Section ---

export const getMySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await DailyOrder.find({ user: req.user._id }).populate('product', 'name images price discountPrice unit');
  return ApiResponse.success(res, 200, 'Subscriptions retrieved successfully', subscriptions);
});

export const createSubscription = asyncHandler(async (req, res) => {
  let { product, quantity, startDate, frequency, deliverySlot, address } = req.body;

  if (!address) {
    const defaultAddress = await Address.findOne({ user: req.user._id, isDefault: true }) || await Address.findOne({ user: req.user._id });
    if (!defaultAddress) return ApiResponse.error(res, 400, 'Please add a delivery address before subscribing');
    address = defaultAddress._id;
  }

  const subscriptionExists = await DailyOrder.findOne({ user: req.user._id, product, status: 'Active' });
  if (subscriptionExists) return ApiResponse.error(res, 400, 'You already have an active subscription for this product');

  const subscription = await DailyOrder.create({
    user: req.user._id, product, address, quantity, startDate, frequency, deliverySlot, status: 'Active'
  });

  return ApiResponse.success(res, 201, 'Subscription created successfully', subscription);
});

export const updateSubscription = asyncHandler(async (req, res) => {
  const { status, quantity, deliverySlot, frequency } = req.body;
  const subscription = await DailyOrder.findById(req.params.id);

  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');
  if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return ApiResponse.error(res, 403, 'Not authorized');
  }

  if (status) {
    if (status === 'Active' && subscription.status === 'Paused' && subscription.pausedBy === 'Admin' && req.user.role !== 'admin') {
      return ApiResponse.error(res, 403, 'This plan is currently stopped by the farm team.');
    }
    
    if (status === 'Active' && subscription.status === 'Paused') {
      const lastPause = subscription.pauseHistory[subscription.pauseHistory.length - 1];
      if (lastPause && !lastPause.endDate) lastPause.endDate = new Date();
    }
    
    if (status === 'Paused' && subscription.status !== 'Paused') {
      subscription.pausedBy = req.user.role === 'admin' ? 'Admin' : 'User';
      subscription.pauseHistory.push({ startDate: new Date() });
    }
    subscription.status = status;
  }
  if (quantity) subscription.quantity = quantity;
  if (deliverySlot) subscription.deliverySlot = deliverySlot;
  if (frequency) subscription.frequency = frequency;

  const updatedSubscription = await subscription.save();
  return ApiResponse.success(res, 200, 'Subscription updated', updatedSubscription);
});

export const getAllSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await DailyOrder.find({}).populate('user', 'name address phoneNumber').populate('product', 'name unit');
  return ApiResponse.success(res, 200, 'All subscriptions retrieved', subscriptions);
});

export const adminToggleSubscription = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const subscription = await DailyOrder.findById(req.params.id).populate('user', 'name email phoneNumber').populate('product', 'name');

  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');

  subscription.status = status;
  if (status === 'Paused') {
    subscription.pausedBy = 'Admin';
    subscription.pauseHistory.push({ startDate: new Date(), reason });
  } else if (status === 'Active') {
    subscription.pausedBy = 'User';
    const lastPause = subscription.pauseHistory[subscription.pauseHistory.length - 1];
    if (lastPause && !lastPause.endDate) lastPause.endDate = new Date();
  }

  await subscription.save();

  const io = req.app.get('io');
  await createInternalNotification(io, subscription.user._id, `Milk Plan ${status}`, `Your plan is now ${status}. Reason: ${reason}`, 'Subscription');

  try {
    await sendSubscriptionStatusEmail(subscription.user.email, {
      userName:    subscription.user.name,
      productName: subscription.product.name,
      status,
      reason,
    });
  } catch (err) {
    console.error('Subscription email failed:', err);
  }

  return ApiResponse.success(res, 200, `Subscription ${status} successfully`, subscription);
});

export const requestReactivation = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const subscription = await DailyOrder.findById(req.params.id).populate('user', 'name').populate('product', 'name');
  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');

  const adminUser = await User.findOne({ role: 'admin' });
  await createInternalNotification(null, adminUser?._id, `Plan Restart Request`, `Customer ${subscription.user.name} wants to restart plan.`, 'System');

  subscription.lastReactivationMessage = message || 'Customer requested reactivation.';
  await subscription.save();
  return ApiResponse.success(res, 200, 'Reactivation request sent');
});

export const getSubscriptionSnapshot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { month: queryMonth, year: queryYear } = req.query;
  const subscription = await DailyOrder.findById(id).populate('product', 'name price discountPrice unit images');

  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');
  if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') return ApiResponse.error(res, 403, 'Unauthorized');

  const now = new Date();
  const targetYear = queryYear ? parseInt(queryYear) : now.getFullYear();
  const targetMonth = queryMonth ? parseInt(queryMonth) - 1 : now.getMonth();
  const startOfMonth = new Date(targetYear, targetMonth, 1);
  const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

  const bill = await Bill.findOne({ subscription: id, month: targetMonth + 1, year: targetYear });
  const orders = await Order.find({ subscription: id, createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
  const accruedAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const daysInMonth = endOfMonth.getDate();
  const calendar = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(targetYear, targetMonth, d);
    date.setHours(0, 0, 0, 0);
    let status = 'Upcoming';
    const isPaused = subscription.pauseHistory.some(event => {
      const start = new Date(event.startDate); start.setHours(0,0,0,0);
      const end = event.endDate ? new Date(event.endDate) : new Date(); end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });
    if (isPaused) status = 'Paused';
    else {
      const orderForDay = orders.find(o => new Date(o.createdAt).getDate() === d);
      if (orderForDay) status = orderForDay.orderStatus === 'Delivered' ? 'Delivered' : 'Scheduled';
      else if (date < now) status = 'History';
    }
    if (date > now && !isPaused) status = 'Scheduled';
    calendar.push({ day: d, date: date.toISOString(), status });
  }

  return ApiResponse.success(res, 200, 'Snapshot generated', { subscription, accruedAmount, calendar, monthName: startOfMonth.toLocaleString('default', { month: 'long' }), month: targetMonth + 1, year: targetYear, bill, isCurrentMonth: targetMonth === now.getMonth() && targetYear === now.getFullYear() });
});

// --- Billing Section ---

export const generateMonthlyBills = asyncHandler(async (req, res) => {
  const { month, year } = req.body;
  if (!month || !year) return ApiResponse.error(res, 400, 'Month and Year required');

  const subscriptions = await DailyOrder.find({ status: { $ne: 'Cancelled' } });
  let generatedCount = 0;

  for (const sub of subscriptions) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      const orders = await Order.find({ subscription: sub._id, createdAt: { $gte: startDate, $lte: endDate }, orderStatus: 'Delivered' });
      if (orders.length === 0) continue;

      const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const dueDate = new Date(); dueDate.setDate(10);

      const bill = await Bill.create({ user: sub.user, subscription: sub._id, month, year, totalAmount, dueDate, status: 'Pending' });
      await User.findByIdAndUpdate(sub.user, { $inc: { totalPendingBill: totalAmount } });
      await Notification.create({ recipient: sub.user, title: 'New Bill Ready', message: `Bill for ${month}/${year} is ₹${totalAmount}.`, type: 'System' });
      generatedCount++;
    } catch (err) {
      if (err.code !== 11000) console.error(`Error generating bill:`, err);
    }
  }
  return ApiResponse.success(res, 200, `Generated ${generatedCount} bills`, { count: generatedCount });
});

export const getMyBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ user: req.user._id }).populate('subscription', 'product').sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Bills retrieved', bills);
});

export const getAllBills = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const bills = await Bill.find(filter).populate('user', 'name phone email').populate({ path: 'subscription', populate: { path: 'product', select: 'name' } }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'All bills retrieved', bills);
});

export const submitPaymentProof = asyncHandler(async (req, res) => {
  const { transactionId, imageUrl } = req.body;
  const bill = await Bill.findById(req.params.id);
  if (!bill || bill.user.toString() !== req.user._id.toString()) return ApiResponse.error(res, 404, 'Bill not found');

  bill.paymentProof = { transactionId, imageUrl, submittedAt: new Date() };
  bill.status = 'Review';
  await bill.save();
  return ApiResponse.success(res, 200, 'Proof submitted', bill);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const bill = await Bill.findById(req.params.id).populate('user', 'name email');
  if (!bill) return ApiResponse.error(res, 404, 'Bill not found');

  bill.status = status;
  bill.verifiedAt = new Date();
  bill.verifiedBy = req.user._id;
  await bill.save();

  if (status === 'Paid') {
    await User.findByIdAndUpdate(bill.user._id, { $inc: { totalPendingBill: -bill.totalAmount }, $set: { isSubscriptionBlacklisted: false } });
    await Notification.create({ recipient: bill.user._id, title: 'Payment Received', message: `Payment of ₹${bill.totalAmount} confirmed.`, type: 'System' });
    try {
      await sendPaymentConfirmedEmail(bill.user.email, {
        userName:   bill.user.name,
        amount:     bill.totalAmount,
        billMonth:  bill.month,
        billYear:   bill.year,
      });
    } catch (err) { console.error('Payment email failed:', err); }
  }
  return ApiResponse.success(res, 200, `Marked as ${status}`, bill);
});

// --- Coupon Section ---

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountAmount, endDate, minPurchase, isActive } = req.body;
  if (await Coupon.findOne({ code: code.toUpperCase() })) return ApiResponse.error(res, 400, 'Coupon exists');
  const coupon = await Coupon.create({ code: code.toUpperCase(), discountAmount, endDate, minPurchase, isActive });
  return ApiResponse.success(res, 201, 'Coupon created', coupon);
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'All coupons retrieved', coupons);
});

export const getActiveCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ isActive: true, endDate: { $gt: Date.now() } }).sort({ discountAmount: -1 });
  return ApiResponse.success(res, 200, 'Active coupons retrieved', coupons);
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, endDate: { $gt: Date.now() } });
  if (!coupon) return ApiResponse.error(res, 404, 'Invalid coupon');

  const previousUsage = await Order.findOne({ user: req.user._id, couponCode: coupon.code });
  if (previousUsage) return ApiResponse.error(res, 400, 'You have already used this coupon on a previous order.');

  if (amount < coupon.minPurchase) return ApiResponse.error(res, 400, `Min purchase of ${coupon.minPurchase} required`);
  return ApiResponse.success(res, 200, 'Coupon applied', { discountAmount: coupon.discountAmount, code: coupon.code });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return ApiResponse.error(res, 404, 'Coupon not found');
  return ApiResponse.success(res, 200, 'Coupon deleted');
});

/**
 * @desc    Get bill/invoice history for the last 6 months
 * @route   GET /api/v1/billing/history
 * @access  Private
 */
export const getInvoiceHistory = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const bills = await Bill.find({
    user: req.user._id,
    createdAt: { $gte: sixMonthsAgo }
  })
  .populate('subscription', 'product')
  .sort({ createdAt: -1 });

  return ApiResponse.success(res, 200, 'Invoice history retrieved', bills);
});
/**
 * @desc    Set a day override on a subscription (Skip or Extra)
 * @route   POST /api/v1/subscriptions/:id/day-override
 * @access  Private
 */
export const setDayOverride = asyncHandler(async (req, res) => {
  const { date, action, quantity = 1, reason = '' } = req.body;
  const subscription = await DailyOrder.findById(req.params.id);

  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');
  if (subscription.user.toString() !== req.user._id.toString()) return ApiResponse.error(res, 403, 'Unauthorized');
  if (subscription.status !== 'Active') return ApiResponse.error(res, 400, 'Cannot modify a paused or cancelled subscription');

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (targetDate <= today) return ApiResponse.error(res, 400, 'Can only modify future delivery dates');

  // Remove existing override for that date (toggle behaviour)
  const existingIndex = subscription.dayOverrides.findIndex(
    (o) => new Date(o.date).setHours(0,0,0,0) === targetDate.getTime()
  );

  if (existingIndex !== -1) {
    // If same action → remove (toggle off)
    if (subscription.dayOverrides[existingIndex].action === action) {
      subscription.dayOverrides.splice(existingIndex, 1);
      await subscription.save();
      return ApiResponse.success(res, 200, `${action} removed for ${date}`);
    }
    // Different action → replace
    subscription.dayOverrides[existingIndex] = { date: targetDate, action, quantity, reason };
  } else {
    subscription.dayOverrides.push({ date: targetDate, action, quantity, reason });
  }

  // If this is a Skip, credit back to wallet (instant refund)
  if (action === 'Skip') {
    const productPrice = (await DailyOrder.findById(req.params.id).populate('product', 'discountPrice price')).product;
    const refundAmount = Math.round((productPrice.discountPrice || productPrice.price) * subscription.quantity);
    const user = await User.findById(req.user._id);
    user.walletBalance += refundAmount;
    user.walletTransactions.unshift({
      amount: refundAmount,
      type: 'Credit',
      description: `Refund for skipped delivery on ${new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`,
    });
    await user.save();
  }

  await subscription.save();
  return ApiResponse.success(res, 200, `${action} set for ${date}`, subscription);
});

/**
 * @desc    Set vacation mode on a subscription (pause a date range)
 * @route   POST /api/v1/subscriptions/:id/vacation
 * @access  Private
 */
export const setVacationMode = asyncHandler(async (req, res) => {
  const { startDate, endDate, active } = req.body;
  const subscription = await DailyOrder.findById(req.params.id);

  if (!subscription) return ApiResponse.error(res, 404, 'Subscription not found');
  if (subscription.user.toString() !== req.user._id.toString()) return ApiResponse.error(res, 403, 'Unauthorized');

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date(); today.setHours(0,0,0,0);

  if (active !== false) {
    if (start < today) return ApiResponse.error(res, 400, 'Vacation start date must be today or in the future');
    if (end <= start) return ApiResponse.error(res, 400, 'End date must be after start date');

    subscription.vacationMode = { isActive: true, startDate: start, endDate: end };

    // Also push a pause entry into pauseHistory for the cron job to respect
    subscription.pauseHistory.push({ startDate: start, endDate: end, reason: 'Vacation Mode' });
  } else {
    subscription.vacationMode = { isActive: false };
  }

  await subscription.save();
  return ApiResponse.success(res, 200, active !== false ? 'Vacation mode activated' : 'Vacation mode cancelled', subscription);
});

/**
 * @desc    Wallet top-up with 5% cashback bonus for top-ups over ₹1000
 * @route   POST /api/v1/wallet/topup
 * @access  Private
 */
export const walletTopUp = asyncHandler(async (req, res) => {
  const { amount, transactionId } = req.body;

  if (!amount || amount <= 0) return ApiResponse.error(res, 400, 'Please provide a valid top-up amount');

  const user = await User.findById(req.user._id);
  if (!user) return ApiResponse.error(res, 404, 'User not found');

  let cashback = 0;
  const topUpAmount = Number(amount);

  // 5% bonus for top-ups over ₹1000
  if (topUpAmount >= 1000) {
    cashback = Math.round(topUpAmount * 0.05);
  }

  const totalCredit = topUpAmount + cashback;

  user.walletBalance += totalCredit;

  // Log the top-up
  user.walletTransactions.unshift({
    amount: topUpAmount,
    type: 'Credit',
    description: `Wallet top-up${transactionId ? ` (Txn: ${transactionId})` : ''}`,
  });

  // Log the cashback as a separate transaction if applicable
  if (cashback > 0) {
    user.walletTransactions.unshift({
      amount: cashback,
      type: 'Credit',
      description: `🎁 5% Cashback Bonus on ₹${topUpAmount} top-up`,
    });
  }

  await user.save();

  return ApiResponse.success(res, 200, `Wallet topped up! ₹${topUpAmount} added${cashback > 0 ? ` + ₹${cashback} cashback bonus` : ''}.`, {
    newBalance: user.walletBalance,
    amountAdded: topUpAmount,
    cashback,
    transactions: user.walletTransactions.slice(0, 3),
  });
});

/**
 * @desc    Get wallet balance and transaction history
 * @route   GET /api/v1/wallet
 * @access  Private
 */
export const getWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('walletBalance walletTransactions');
  if (!user) return ApiResponse.error(res, 404, 'User not found');

  return ApiResponse.success(res, 200, 'Wallet retrieved', {
    balance: user.walletBalance,
    transactions: user.walletTransactions,
  });
});
