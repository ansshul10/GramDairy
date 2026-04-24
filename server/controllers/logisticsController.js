import crypto from 'crypto';
import { Order } from '../models/CommerceModels.js';
import { DeliveryBoy, DeliveryApplication, Cattle, Vendor, VendorApplication } from '../models/LogisticsModels.js';
import { User, Address } from '../models/AccountModels.js';
import { Notification } from '../models/SystemModels.js';
import { Product } from '../models/CatalogModels.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { verifyQrToken } from './commerceController.js';
import { 
  sendDeliveryCredentialsEmail, 
  sendDeliveryRejectionEmail, 
  sendAdminContactEmail,
  sendVendorWelcomeEmail
} from '../services/index.js';

// --- Helpers ---

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateEmployeeId = async () => {
  let isUnique = false;
  let employeeId;
  while (!isUnique) {
    const random = Math.floor(10000 + Math.random() * 90000);
    employeeId = `DB-${random}`;
    const existing = await DeliveryBoy.findOne({ employeeId });
    if (!existing) isUnique = true;
  }
  return employeeId;
};

const generateSecurePassword = () => {
  const words = ['Milk', 'Farm', 'Fresh', 'Dairy', 'Green', 'Pure', 'Grade'];
  const nums = Math.floor(100 + Math.random() * 900);
  const sym = ['@', '#', '!', '$'][Math.floor(Math.random() * 4)];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  return `${w1}${sym}${w2}${nums}`;
};

// --- Delivery Section ---

export const getAssignedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 
    assignedDeliveryUser: req.user._id,
    isDelivered: false 
  })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phoneNumber')
    .select('+deliveryOtp');
    
  return ApiResponse.success(res, 200, 'Assigned orders retrieved', orders);
});

export const scanQrCode = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) return ApiResponse.error(res, 400, 'Verification token is required');

  const { valid, orderId } = verifyQrToken(token);
  let order;

  if (valid) {
    order = await Order.findById(orderId).populate('user', 'name email phoneNumber');
  } else {
    const cleanToken = token.replace(/^(GD-|ORDER-)/i, '').toUpperCase();
    order = await Order.findOne({ shortCode: cleanToken }).populate('user', 'name email phoneNumber');
  }

  if (!order) return ApiResponse.error(res, 404, `No order found matching code "${token}".`);
  if (order.isDelivered) return ApiResponse.error(res, 400, 'This order has already been delivered');

  order.qrScanned = true;
  await order.save();

  return ApiResponse.success(res, 200, 'QR scanned successfully', {
    _id: order._id,
    orderStatus: order.orderStatus,
    qrScanned: order.qrScanned,
    customer: order.user,
    shippingAddress: order.shippingAddress,
    orderItems: order.orderItems,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    isPaid: order.isPaid,
    deliveryOtp: order.deliveryOtp,
    createdAt: order.createdAt,
  });
});

export const generateDeliveryOtp = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return ApiResponse.error(res, 404, 'Order not found');
  if (order.isDelivered) return ApiResponse.error(res, 400, 'Order is already delivered');
  if (order.orderStatus !== 'Out for Delivery') return ApiResponse.error(res, 400, 'OTP can only be generated when "Out for Delivery"');

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  order.deliveryOtp = otp;
  order.deliveryOtpExpires = otpExpires;
  order.deliveryOtpUsed = false;
  await order.save();

  await Notification.deleteMany({
    recipient: order.user._id,
    type: 'OTP',
    'metadata.orderId': order._id.toString(),
  });

  const notification = await Notification.create({
    recipient: order.user._id,
    title: '🔐 Delivery OTP',
    message: `Your delivery OTP is: ${otp}`,
    type: 'OTP',
    link: `/orders/${order._id}`,
    metadata: { otp, orderId: order._id.toString(), expiresAt: otpExpires },
  });

  const io = req.app.get('io');
  if (io) io.to(order.user._id.toString()).emit('new_notification', notification);

  return ApiResponse.success(res, 200, 'OTP sent to customer', { otpGenerated: true, expiresAt: otpExpires });
});

export const verifyDelivery = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) return ApiResponse.error(res, 400, 'OTP is required');

  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return ApiResponse.error(res, 404, 'Order not found');
  if (order.isDelivered) return ApiResponse.error(res, 400, 'Order is already delivered');
  if (!order.deliveryOtp) return ApiResponse.error(res, 400, 'OTP not generated');
  if (order.deliveryOtpExpires && order.deliveryOtpExpires < new Date()) return ApiResponse.error(res, 401, 'OTP expired');

  if (otp.toString() !== order.deliveryOtp) return ApiResponse.error(res, 401, 'Invalid OTP');

  order.orderStatus = 'Delivered';
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.deliveryOtpUsed = true;
  order.deliveryOtp = undefined;

  if (order.paymentMethod === 'COD') {
    order.isPaid = true;
    order.paidAt = Date.now();
  }

  await order.save();

  await Notification.deleteMany({
    recipient: order.user._id,
    type: 'OTP',
    'metadata.orderId': order._id.toString(),
  });

  const io = req.app.get('io');
  if (io) {
    io.to(order.user._id.toString()).emit('otp_cleared', { orderId: order._id.toString() });
    io.to(order.user._id.toString()).emit('order_status_updated', { orderId: order._id.toString(), status: 'Delivered', isPaid: order.isPaid });
  }

  return ApiResponse.success(res, 200, 'Delivery completed successfully', order);
});

export const updateLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  await DeliveryBoy.findOneAndUpdate(
    { user: req.user._id },
    { currentLocation: { type: 'Point', coordinates: [lng, lat] } }
  );
  const io = req.app.get('io');
  if (io) io.emit(`location_update_${req.user._id}`, { lat, lng });
  return ApiResponse.success(res, 200, 'Location updated');
});

export const getDeliveryHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    assignedDeliveryUser: req.user._id,
    isDelivered: true
  }).populate('user', 'name email').sort('-updatedAt');

  return ApiResponse.success(res, 200, 'History retrieved', { orders, total: orders.length });
});

// --- Delivery Application Section ---

export const applyForDelivery = asyncHandler(async (req, res) => {
  const { fullName, email, phone, address, vehicleType, vehicleNumber, licenseNumber } = req.body;

  const existing = await DeliveryApplication.findOne({ email });
  if (existing && existing.status !== 'Rejected') {
    return ApiResponse.error(res, 409, 'Application already exists');
  }

  const applicationData = {
    fullName, email, phone, address, vehicleType, vehicleNumber, licenseNumber,
    status: 'Pending'
  };
  if (req.file) applicationData.idCardImage = req.file.path;

  const application = existing 
    ? await DeliveryApplication.findByIdAndUpdate(existing._id, applicationData, { new: true })
    : await DeliveryApplication.create(applicationData);

  return ApiResponse.success(res, 201, 'Application submitted', application);
});

export const getApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const applications = await DeliveryApplication.find(filter)
    .populate('processedBy', 'name')
    .sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Applications retrieved', applications);
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await DeliveryApplication.findById(req.params.id).populate('processedBy', 'name');
  if (!application) return ApiResponse.error(res, 404, 'Application not found');
  return ApiResponse.success(res, 200, 'Application retrieved', application);
});

export const approveApplication = asyncHandler(async (req, res) => {
  const application = await DeliveryApplication.findById(req.params.id);
  if (!application || application.status === 'Approved') return ApiResponse.error(res, 404, 'Invalid application');

  let user = await User.findOne({ email: application.email });
  const rawPassword = user ? '********' : generateSecurePassword();
  const employeeId = await generateEmployeeId();

  if (!user) {
    user = await User.create({
      name: application.fullName, email: application.email, password: rawPassword,
      phoneNumber: application.phone, role: 'delivery-boy', isVerified: true
    });
  } else {
    user.role = 'delivery-boy';
    await user.save();
  }

  const deliveryBoy = await DeliveryBoy.create({
    user: user._id, employeeId, vehicleType: application.vehicleType,
    vehicleNumber: application.vehicleNumber, licenseNumber: application.licenseNumber,
    phone: application.phone, address: application.address, idCardImageUrl: application.idCardImage,
    status: 'active', application: application._id,
  });

  application.status = 'Approved';
  application.processedBy = req.user._id;
  await application.save();

  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/delivery-boy/${deliveryBoy._id}`;
    await sendDeliveryCredentialsEmail(application.email, {
      name: application.fullName, employeeId, loginEmail: application.email, password: rawPassword,
      verificationUrl
    });
  } catch (err) { console.error('Email failed:', err); }

  return ApiResponse.success(res, 200, 'Approved', { deliveryBoy, employeeId });
});

export const rejectApplication = asyncHandler(async (req, res) => {
  const application = await DeliveryApplication.findById(req.params.id);
  if (!application) return ApiResponse.error(res, 404, 'Application not found');
  application.status = 'Rejected';
  application.processedBy = req.user._id;
  await application.save();
  try {
    await sendDeliveryRejectionEmail(application.email, application.fullName, req.body.reason || '');
  } catch (err) { console.error('Rejection email failed:', err); }
  return ApiResponse.success(res, 200, 'Rejected', application);
});

export const getDeliveryBoys = asyncHandler(async (req, res) => {
  const boys = await DeliveryBoy.find({})
    .populate('user', 'name email phoneNumber avatar createdAt')
    .populate('application', 'idCardImage')
    .sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Delivery boys retrieved', boys);
});

export const getDeliveryBoyById = asyncHandler(async (req, res) => {
  const boy = await DeliveryBoy.findById(req.params.id)
    .populate('user', 'name email phoneNumber avatar createdAt')
    .populate('application');
  if (!boy) return ApiResponse.error(res, 404, 'Delivery boy not found');
  return ApiResponse.success(res, 200, 'Delivery boy retrieved', boy);
});

export const updateDeliveryBoyStatus = asyncHandler(async (req, res) => {
  const boy = await DeliveryBoy.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!boy) return ApiResponse.error(res, 404, 'Delivery boy not found');
  return ApiResponse.success(res, 200, 'Status updated', boy);
});

export const contactDeliveryBoy = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const boy = await DeliveryBoy.findById(req.params.id).populate('user', 'name email');
  if (!boy) return ApiResponse.error(res, 404, 'Delivery boy not found');
  await sendAdminContactEmail(boy.user.email, { name: boy.user.name, adminName: req.user.name, subject, message });
  return ApiResponse.success(res, 200, 'Email sent');
});

export const getMyDeliveryProfile = asyncHandler(async (req, res) => {
  const profile = await DeliveryBoy.findOne({ user: req.user._id }).populate('user', 'name email phoneNumber avatar');
  if (!profile) return ApiResponse.error(res, 404, 'Profile not found');
  return ApiResponse.success(res, 200, 'Profile retrieved', profile);
});

export const deleteDeliveryBoy = asyncHandler(async (req, res) => {
  const boy = await DeliveryBoy.findById(req.params.id);
  if (!boy) return ApiResponse.error(res, 404, 'Profile not found');
  if (boy.user) await User.findByIdAndDelete(boy.user);
  await DeliveryBoy.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 200, 'Deleted successfully');
});

export const submitPublicRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const boy = await DeliveryBoy.findById(req.params.id);
  if (!boy) return ApiResponse.error(res, 404, 'Not found');
  boy.ratingSum = (boy.ratingSum || 0) + Number(rating);
  boy.ratingCount = (boy.ratingCount || 0) + 1;
  boy.ratings = Number((boy.ratingSum / boy.ratingCount).toFixed(1));
  await boy.save();
  return ApiResponse.success(res, 200, 'Rated successfully', { ratings: boy.ratings });
});

export const getPublicVerificationProfile = asyncHandler(async (req, res) => {
  const boy = await DeliveryBoy.findById(req.params.id).populate('user', 'name avatar createdAt');
  if (!boy) return ApiResponse.error(res, 404, 'Not found');
  return ApiResponse.success(res, 200, 'Profile found', boy);
});

// --- Cattle Section ---

export const getAllCattle = asyncHandler(async (req, res) => {
  const cattle = await Cattle.find({ isPublic: true }).select('-privateInfo');
  return ApiResponse.success(res, 200, 'Cattle list retrieved', cattle);
});

export const getCattleById = asyncHandler(async (req, res) => {
  const cattle = await Cattle.findById(req.params.id);
  if (!cattle) return ApiResponse.error(res, 404, 'Cattle not found');
  const publicData = cattle.toObject();
  delete publicData.privateInfo;
  return ApiResponse.success(res, 200, 'Cattle detail retrieved', publicData);
});

export const getPrivateInfo = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const cattle = await Cattle.findById(req.params.id);
  if (!cattle) return ApiResponse.error(res, 404, 'Cattle not found');
  if (password !== (process.env.CATTLE_DETAILS_PIN || '1234')) return ApiResponse.error(res, 401, 'Invalid pin');
  return ApiResponse.success(res, 200, 'Private info retrieved', cattle.privateInfo);
});

export const createCattle = asyncHandler(async (req, res) => {
  const cattle = await Cattle.create(req.body);
  return ApiResponse.success(res, 201, 'Cattle created', cattle);
});

export const updateCattle = asyncHandler(async (req, res) => {
  const cattle = await Cattle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return ApiResponse.success(res, 200, 'Cattle updated', cattle);
});

// --- Vendor Section (from adminController/publicController) ---

/**
 * @desc    Submit a vendor/farm application (Public)
 * @route   POST /api/v1/public/vendor/apply
 */
export const submitVendorApplication = asyncHandler(async (req, res) => {
  const { fullName, farmName, email, phone, category, address } = req.body;

  if (!fullName || !farmName || !email || !phone || !category || !address) {
    return ApiResponse.error(res, 400, 'All fields are mandatory');
  }

  const existingApplication = await VendorApplication.findOne({ email });
  if (existingApplication) {
    return ApiResponse.error(res, 400, 'An application with this email already exists');
  }

  const application = await VendorApplication.create({ fullName, farmName, email, phone, category, address });
  return ApiResponse.success(res, 201, 'Application submitted', application);
});

export const getVendorApplications = asyncHandler(async (req, res) => {
  const applications = await VendorApplication.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Vendor applications retrieved', applications);
});

export const approveVendorApplication = asyncHandler(async (req, res) => {
  const application = await VendorApplication.findById(req.params.id);
  if (!application || application.status !== 'Pending') return ApiResponse.error(res, 404, 'Invalid application');

  const tempPassword = crypto.randomBytes(6).toString('hex').toUpperCase();
  const user = await User.create({
    name: application.fullName, email: application.email, password: tempPassword,
    phoneNumber: application.phone, role: 'vendor', isVerified: true,
  });

  const vendorCount = await Vendor.countDocuments();
  const vendorId = `GD-VNDR-${(vendorCount + 1).toString().padStart(3, '0')}`;

  const vendor = await Vendor.create({
    user: user._id, vendorId, farmName: application.farmName, businessAddress: application.address,
    phoneNumber: application.phone, category: application.category, status: 'Active'
  });

  application.status = 'Approved';
  application.vendor = vendor._id;
  application.processedBy = req.user._id;
  await application.save();

  try { await sendVendorWelcomeEmail(user.email, user.name, tempPassword); } catch (e) { console.error('Email failed:', e); }

  return ApiResponse.success(res, 201, 'Vendor approved', { vendorId: vendor.vendorId, tempPassword });
});

export const getVendorDetail = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).populate('user', 'name email phoneNumber isVerified createdAt');
  if (!vendor) return ApiResponse.error(res, 404, 'Vendor not found');
  return ApiResponse.success(res, 200, 'Vendor detail retrieved', vendor);
});

export const updateVendorStatus = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  return ApiResponse.success(res, 200, 'Vendor status updated', vendor);
});

export const deleteVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return ApiResponse.error(res, 404, 'Vendor not found');
  await User.findByIdAndDelete(vendor.user);
  await Vendor.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 200, 'Vendor deleted');
});
