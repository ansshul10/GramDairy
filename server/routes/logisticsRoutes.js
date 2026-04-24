import express from 'express';
import {
  getAssignedOrders,
  scanQrCode,
  generateDeliveryOtp,
  verifyDelivery,
  updateLocation,
  getDeliveryHistory,
  getMyDeliveryProfile,
  applyForDelivery,
  getApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getDeliveryBoys,
  getDeliveryBoyById,
  updateDeliveryBoyStatus,
  contactDeliveryBoy,
  deleteDeliveryBoy,
  submitPublicRating,
  getPublicVerificationProfile,
  getAllCattle,
  getCattleById,
  getPrivateInfo,
  createCattle,
  updateCattle,
  submitVendorApplication,
  getVendorApplications,
  approveVendorApplication,
  getVendorDetail,
  updateVendorStatus,
  deleteVendor,
} from '../controllers/logisticsController.js';
import { protect, admin, deliveryBoy, uploadDeliveryDoc } from '../middlewares/index.js';

const router = express.Router();

// --- Delivery Section ---
const deliveryRouter = express.Router();
deliveryRouter.post('/apply', uploadDeliveryDoc, applyForDelivery);
deliveryRouter.get('/public/verify/:id', getPublicVerificationProfile);
deliveryRouter.post('/public/rate/:id', submitPublicRating);
deliveryRouter.get('/orders', protect, deliveryBoy, getAssignedOrders);
deliveryRouter.post('/scan', protect, deliveryBoy, scanQrCode);
deliveryRouter.post('/otp/:id', protect, deliveryBoy, generateDeliveryOtp);
deliveryRouter.post('/verify/:id', protect, deliveryBoy, verifyDelivery);
deliveryRouter.post('/location', protect, deliveryBoy, updateLocation);
deliveryRouter.get('/history', protect, deliveryBoy, getDeliveryHistory);
deliveryRouter.get('/me', protect, deliveryBoy, getMyDeliveryProfile);
deliveryRouter.get('/applications', protect, admin, getApplications);
deliveryRouter.get('/applications/:id', protect, admin, getApplicationById);
deliveryRouter.post('/applications/:id/approve', protect, admin, approveApplication);
deliveryRouter.post('/applications/:id/reject', protect, admin, rejectApplication);
deliveryRouter.get('/boys', protect, admin, getDeliveryBoys);
deliveryRouter.get('/boys/:id', protect, admin, getDeliveryBoyById);
deliveryRouter.patch('/boys/:id/status', protect, admin, updateDeliveryBoyStatus);
deliveryRouter.post('/boys/:id/contact', protect, admin, contactDeliveryBoy);
deliveryRouter.delete('/boys/:id', protect, admin, deleteDeliveryBoy);

// --- Cattle Section ---
const cattleRouter = express.Router();
cattleRouter.get('/', getAllCattle);
cattleRouter.get('/:id', getCattleById);
cattleRouter.post('/:id/private', getPrivateInfo);
cattleRouter.post('/', protect, admin, createCattle);
cattleRouter.patch('/:id', protect, admin, updateCattle);

// --- Vendor/Farm Section (often handled via /admin or /public) ---
const vendorRouter = express.Router();
vendorRouter.post('/apply', submitVendorApplication);
// Admin vendor management routes traditionally might have been under /admin
// but for consolidation we can handle them here or in admin.
// If index.js points /admin/vendors here, it works.

router.use('/delivery', deliveryRouter);
router.use('/cattle', cattleRouter);
router.use('/vendors', vendorRouter); // This will handle /vendors/apply etc.

export default router;
