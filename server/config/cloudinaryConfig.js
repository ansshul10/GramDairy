import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Configure Storage for Products
 */
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gramdairy/products',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

/**
 * Configure Storage for Categories
 */
const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gramdairy/categories',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg'],
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  },
});

/**
 * Configure Storage for Delivery Boy Documents
 */
const deliveryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gramdairy/delivery_docs',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'pdf'],
  },
});

export { cloudinary, productStorage, categoryStorage, deliveryStorage };
