import mongoose from 'mongoose';

// --- SCHEMAS ---

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyOrder',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Review', 'Paid'],
      default: 'Pending',
    },
    paymentProof: {
      transactionId: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      submittedAt: {
        type: Date,
      },
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a coupon code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['Percentage', 'Fixed'],
      default: 'Percentage',
    },
    discountAmount: {
      type: Number,
      required: [true, 'Please add discount amount'],
    },
    minPurchase: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const dailyOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Every Other Day', 'Alternative', 'Custom'],
      default: 'Daily',
    },
    customDays: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Cancelled'],
      default: 'Active',
    },
    pausedBy: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    pauseStartDate: {
      type: Date,
    },
    pauseEndDate: {
      type: Date,
    },
    lastReactivationMessage: {
      type: String,
      default: '',
    },
    pauseHistory: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        reason: { type: String },
      }
    ],
    deliverySlot: {
      type: String,
      default: 'Morning (6 AM - 8 AM)',
    },
    // Per-day overrides: skip or extra delivery on specific dates
    dayOverrides: [
      {
        date: { type: Date, required: true },
        action: { type: String, enum: ['Skip', 'Extra'], required: true },
        quantity: { type: Number, default: 1 }, // for 'Extra' action
        reason: { type: String, default: '' },
      }
    ],
    // Vacation mode: pause between two dates
    vacationMode: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Online', 'Razorpay'],
      default: 'Online',
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    pointsUsed: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, default: 0.0 },
    couponCode: { type: String },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryOtp: {
      type: String,
    },
    deliveryOtpExpires: {
      type: Date,
    },
    deliveryOtpUsed: {
      type: Boolean,
      default: false,
    },
    qrScanned: {
      type: Boolean,
      default: false,
    },
    qrCode: {
      type: String,
    },
    qrToken: {
      type: String,
      select: false,
    },
    shortCode: {
      type: String,
      unique: true,
      index: true,
    },
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryBoy',
    },
    assignedDeliveryUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyOrder',
    },
  },
  {
    timestamps: true,
  }
);

// --- INDEXES ---

billSchema.index({ user: 1, subscription: 1, month: 1, year: 1 }, { unique: true });

// --- MODELS ---

export const Bill = mongoose.model('Bill', billSchema);
export const Coupon = mongoose.model('Coupon', couponSchema);
export const DailyOrder = mongoose.model('DailyOrder', dailyOrderSchema);
export const Order = mongoose.model('Order', orderSchema);
