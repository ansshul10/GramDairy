import express from 'express';
import {
  getStats,
  getRecentActivities,
  getAllUsers,
  sendNotificationToUser,
  getSettings,
  updateSettings,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  createSupportTicket,
  getMyTickets,
  trackTicket,
  getAllTickets,
  replyToTicket,
  getPublicProfile,
  getSystemStatus,
  getStoreLocations,
  createStoreLocation,
  updateStoreLocation,
  deleteStoreLocation,
  subscribeNewsletter,
  unsubscribeNewsletter,
  getNewsletterSubscribers,
  sendNewsletterBlast,
} from '../controllers/systemController.js';
import {
  getVendorApplications,
  approveVendorApplication,
  getVendorDetail,
  updateVendorStatus,
  deleteVendor
} from '../controllers/logisticsController.js';
import { protect, admin } from '../middlewares/index.js';

const router = express.Router();

// --- Admin Section ---
const adminRouter = express.Router();
adminRouter.use(protect);
adminRouter.use(admin);
adminRouter.get('/stats', getStats);
adminRouter.get('/activities', getRecentActivities);
adminRouter.get('/users', getAllUsers);
adminRouter.post('/notifications/send', sendNotificationToUser);
// Vendor Management (moved from original adminRoutes)
adminRouter.get('/vendors/applications', getVendorApplications);
adminRouter.post('/vendors/approve/:id', approveVendorApplication);
adminRouter.get('/vendors/:id', getVendorDetail);
adminRouter.patch('/vendors/:id/status', updateVendorStatus);
adminRouter.delete('/vendors/:id', deleteVendor);
// Store Locations
adminRouter.delete('/stores/:id', deleteStoreLocation);
adminRouter.get('/newsletter', getNewsletterSubscribers);
adminRouter.post('/newsletter/send', sendNewsletterBlast);

// --- Settings Section ---
const settingRouter = express.Router();
settingRouter.get('/', getSettings);
settingRouter.put('/', protect, admin, updateSettings);

// --- Notification Section ---
const notificationRouter = express.Router();
notificationRouter.get('/', protect, getMyNotifications);
notificationRouter.patch('/read-all', protect, markAllAsRead);
notificationRouter.patch('/:id/read', protect, markAsRead);
notificationRouter.delete('/purge-all', protect, deleteAllNotifications);
notificationRouter.delete('/:id', protect, deleteNotification);

// --- Support Section ---
const supportRouter = express.Router();
supportRouter.post('/', createSupportTicket);
supportRouter.post('/track', trackTicket);
supportRouter.get('/my-tickets', protect, getMyTickets);
supportRouter.get('/admin/all', protect, admin, getAllTickets);
supportRouter.post('/admin/reply/:id', protect, admin, replyToTicket);

// --- Public/App Section ---
const publicRouter = express.Router();
publicRouter.get('/profile/:id', getPublicProfile);
publicRouter.get('/status', getSystemStatus);
publicRouter.post('/newsletter/subscribe', subscribeNewsletter);
publicRouter.post('/newsletter/unsubscribe', unsubscribeNewsletter);

// --- Store Locator Section ---
const storeRouter = express.Router();
storeRouter.get('/', getStoreLocations);

router.use('/admin', adminRouter);
router.use('/settings', settingRouter);
router.use('/notifications', notificationRouter);
router.use('/support', supportRouter);
router.use('/public', publicRouter);
router.use('/stores', storeRouter);

export default router;
