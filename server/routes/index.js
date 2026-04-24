import express from 'express';
import accountRoutes from './accountRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import commerceRoutes from './commerceRoutes.js';
import logisticsRoutes from './logisticsRoutes.js';
import systemRoutes from './systemRoutes.js';

const router = express.Router();

// Mount domain-based routers
// Each router handles its own prefixes internally to maintain API compatibility
router.use('/', accountRoutes);   // Handles /auth, /addresses, /users
router.use('/', catalogRoutes);   // Handles /products, /categories, /reviews
router.use('/', commerceRoutes);  // Handles /orders, /subscriptions, /billing, /coupons
router.use('/', logisticsRoutes); // Handles /delivery, /cattle, /vendors
router.use('/', systemRoutes);    // Handles /admin, /settings, /notifications, /support, /chat, /public

export default router;
