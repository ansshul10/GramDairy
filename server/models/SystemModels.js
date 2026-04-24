import mongoose from 'mongoose';

// --- SCHEMAS ---

const liveChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['queued', 'active', 'closed'],
    default: 'queued'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Order Issue', 'Delivery Problem', 'Product Quality', 'Payment', 'General Query'],
      default: 'General Query',
    },
    priority: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Normal',
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Replied', 'Resolved', 'Closed'],
      default: 'Open',
    },
    internalNotes: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    replies: [
      {
        sender: { type: String, enum: ['Admin', 'User'] },
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    metadata: {
      orderId: String,
      billId: String,
      attachmentUrl: String,
    },
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Order', 'System', 'Promotion', 'Subscription', 'OTP', 'Info', 'info', 'alert', 'success', 'warning', 'error'],
      default: 'System',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    metadata: {
      otp: { type: String },
      orderId: { type: String },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const settingSchema = new mongoose.Schema(
  {
    enableRegistration: {
      type: Boolean,
      default: true,
    },
    enableOrdering: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500,
    },
    supportEmail: {
      type: String,
      default: '',
    },
    supportPhone: {
      type: String,
      default: '',
    },
    autoVerifyBilling: {
      type: Boolean,
      default: false,
    },
    billingDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 28,
    },
    isStoreOnline: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const storeLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Farm', 'Distribution Hub', 'Partner Store', 'Retail Store'],
      default: 'Retail Store',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    operatingHours: {
      openTime: { type: String, default: '08:00' }, // HH:mm format
      closeTime: { type: String, default: '20:00' }, // HH:mm format
    },
    amenities: {
      type: [String],
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

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
    }
  },
  {
    timestamps: true,
  }
);

// --- INDEXES ---

liveChatSchema.index({ user: 1, status: 1 });
liveChatSchema.index({ admin: 1, status: 1 });
storeLocationSchema.index({ location: '2dsphere' });
storeLocationSchema.index({ city: 1 });
storeLocationSchema.index({ pinCode: 1 });

// --- HOOKS ---

supportTicketSchema.pre('save', async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const prefix = 'GD';
    this.ticketId = `${prefix}-${year}-${random}`;
    
    const existing = await mongoose.models.SupportTicket.findOne({ ticketId: this.ticketId });
    if (existing) {
       this.ticketId += Math.floor(Math.random() * 10);
    }
  }
  next();
});

// --- MODELS ---

export const LiveChat = mongoose.model('LiveChat', liveChatSchema);
export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
export const Setting = mongoose.model('Setting', settingSchema);
export const StoreLocation = mongoose.model('StoreLocation', storeLocationSchema);
export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
