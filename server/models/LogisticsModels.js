import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- SCHEMAS ---

const deliveryBoySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Scooter', 'Cycle', 'Car'],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Please add vehicle number'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please add license number'],
      unique: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    idCardImageUrl: {
      type: String,
    },
    idCardPublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'banned', 'terminated'],
      default: 'active',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
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
    ratings: {
      type: Number,
      default: 0,
    },
    ratingSum: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    activeOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryApplication',
    },
  },
  {
    timestamps: true,
  }
);

const deliveryApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Scooter', 'Cycle', 'Car'],
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    idCardImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vendorId: {
      type: String,
      required: true,
      unique: true,
    },
    farmName: {
      type: String,
      required: true,
      trim: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Onboarding'],
      default: 'Onboarding',
    },
    totalSupplyValue: {
      type: Number,
      default: 0,
    },
    activeProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
  },
  {
    timestamps: true,
  }
);

const vendorApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    farmName: {
      type: String,
      required: [true, 'Farm/Shop name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Business address is required'],
    },
    documents: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    }
  },
  {
    timestamps: true,
  }
);

const cattleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add cattle name'],
      trim: true,
    },
    tagNumber: {
      type: String,
      required: [true, 'Please add cattle tag number'],
      unique: true,
      trim: true,
    },
    breed: {
      type: String,
      required: [true, 'Please add breed'],
    },
    age: {
      type: Number,
      required: [true, 'Please add age in years'],
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Sick', 'Under Treatment', 'Vaccinated'],
      default: 'Healthy',
    },
    lastVaccinationDate: {
      type: Date,
    },
    qrCode: {
      type: String,
    },
    images: {
      type: [String],
    },
    privateDataPassword: {
      type: String,
      required: [true, 'Please add a password for private info gate'],
      select: false,
    },
    milkYield: {
      type: Number,
      select: false,
    },
    medicalHistory: [
      {
        condition: String,
        date: Date,
        treatment: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// --- HOOKS & METHODS ---

cattleSchema.pre('save', async function (next) {
  if (!this.isModified('privateDataPassword')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.privateDataPassword = await bcrypt.hash(this.privateDataPassword, salt);
});

cattleSchema.methods.matchPrivatePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.privateDataPassword);
};

// --- MODELS ---

export const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);
export const DeliveryApplication = mongoose.model('DeliveryApplication', deliveryApplicationSchema);
export const Vendor = mongoose.model('Vendor', vendorSchema);
export const VendorApplication = mongoose.model('VendorApplication', vendorApplicationSchema);
export const Cattle = mongoose.model('Cattle', cattleSchema);
