import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- SCHEMAS ---

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add an address title (e.g. Home, Office)'],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please add full name for delivery'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    street: {
      type: String,
      required: [true, 'Please add street address'],
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
    },
    state: {
      type: String,
      required: [true, 'Please add state'],
    },
    postalCode: {
      type: String,
      required: [true, 'Please add postal code'],
    },
    country: {
      type: String,
      default: 'India',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'delivery-boy', 'vendor'],
      default: 'customer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    avatarPublicId: {
      type: String,
      default: '',
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    qrCode: {
      type: String,
    },
    totalPendingBill: {
      type: Number,
      default: 0,
    },
    isSubscriptionBlacklisted: {
      type: Boolean,
      default: false,
    },
    supportStatus: {
      type: String,
      enum: ['available', 'busy'],
      default: 'busy',
    },

    // --- Advanced Features ---
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    appliedReferralCode: {
      type: String,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    walletTransactions: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['Credit', 'Debit'], required: true },
        description: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      }
    ],
    notificationPreferences: {
      orderUpdates:    { type: Boolean, default: true },
      deliveryAlerts:  { type: Boolean, default: true },
      promotions:      { type: Boolean, default: false },
    },
    loginHistory: [
      {
        ip: String,
        device: String,
        location: String,
        timestamp: { type: Date, default: Date.now },
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: '10m' },
    },
  },
  {
    timestamps: true,
  }
);

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '7d' },
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    deviceInfo: {
      type: String, // Parsed device info e.g. "Chrome on Windows"
    },
  },
  {
    timestamps: true,
  }
);

// --- HOOKS & METHODS ---

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- MODELS ---

export const Address = mongoose.model('Address', addressSchema);
export const User = mongoose.model('User', userSchema);
export const Otp = mongoose.model('Otp', otpSchema);
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
