import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  regenerateOrderQr,
  getMySubscriptions,
  createSubscription,
  updateSubscription,
  getAllSubscriptions,
  adminToggleSubscription,
  requestReactivation,
  getSubscriptionSnapshot,
  generateMonthlyBills,
  getMyBills,
  getAllBills,
  submitPaymentProof,
  verifyPayment,
  createCoupon,
  getCoupons,
  getActiveCoupons,
  validateCoupon,
  deleteCoupon,
  getInvoiceHistory,
  setDayOverride,
  setVacationMode,
  walletTopUp,
  getWallet,
} from '../controllers/commerceController.js';
import { protect, admin } from '../middlewares/index.js';

const router = express.Router();

// --- Order Routes ---
const orderRouter = express.Router();
orderRouter.post('/', protect, createOrder);
orderRouter.get('/myorders', protect, getMyOrders);
orderRouter.get('/:id', protect, getOrderById);
orderRouter.patch('/:id/pay', protect, updateOrderToPaid);
orderRouter.get('/', protect, admin, getAllOrders);
orderRouter.patch('/:id/status', protect, admin, updateOrderStatus);
orderRouter.post('/:id/qr', protect, admin, regenerateOrderQr);

// --- Subscription Routes ---
const subscriptionRouter = express.Router();
subscriptionRouter.get('/', protect, getMySubscriptions);
subscriptionRouter.post('/', protect, createSubscription);
subscriptionRouter.patch('/:id', protect, updateSubscription);
subscriptionRouter.get('/all', protect, admin, getAllSubscriptions);
subscriptionRouter.patch('/admin/toggle/:id', protect, admin, adminToggleSubscription);
subscriptionRouter.post('/request-reactivation/:id', protect, requestReactivation);
subscriptionRouter.get('/:id/snapshot', protect, getSubscriptionSnapshot);
subscriptionRouter.post('/:id/day-override', protect, setDayOverride);
subscriptionRouter.post('/:id/vacation', protect, setVacationMode);

// --- Billing Routes ---
const billingRouter = express.Router();
billingRouter.post('/generate', protect, admin, generateMonthlyBills);
billingRouter.get('/my-bills', protect, getMyBills);
billingRouter.get('/history', protect, getInvoiceHistory);
billingRouter.get('/all', protect, admin, getAllBills);
billingRouter.patch('/submit-proof/:id', protect, submitPaymentProof);
billingRouter.patch('/verify/:id', protect, admin, verifyPayment);

// --- Coupon Routes ---
const couponRouter = express.Router();
couponRouter.post('/', protect, admin, createCoupon);
couponRouter.get('/', protect, admin, getCoupons);
couponRouter.get('/active', protect, getActiveCoupons);
couponRouter.post('/validate', protect, validateCoupon);
couponRouter.delete('/:id', protect, admin, deleteCoupon);

// --- Wallet Routes ---
const walletRouter = express.Router();
walletRouter.get('/', protect, getWallet);
walletRouter.post('/topup', protect, walletTopUp);

router.use('/orders', orderRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/billing', billingRouter);
router.use('/coupons', couponRouter);
router.use('/wallet', walletRouter);

export default router;
