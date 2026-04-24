import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createReview,
  getProductReviews,
  deleteReview,
  getAllReviews,
} from '../controllers/catalogController.js';
import { protect, admin, validate, uploadProductImage, uploadCategoryImage } from '../middlewares/index.js';
import { productSchema, categorySchema } from '../validators/index.js';

const router = express.Router();

// --- Product Routes ---
const productRouter = express.Router();
productRouter.get('/', getProducts);
productRouter.get('/:slug', getProductBySlug);
productRouter.post('/', protect, admin, uploadProductImage, validate(productSchema), createProduct);
productRouter.patch('/:id', protect, admin, uploadProductImage, updateProduct);
productRouter.delete('/:id', protect, admin, deleteProduct);

// --- Category Routes ---
const categoryRouter = express.Router();
categoryRouter.get('/', getCategories);
categoryRouter.post('/', protect, admin, uploadCategoryImage, validate(categorySchema), createCategory);
categoryRouter.patch('/:id', protect, admin, uploadCategoryImage, updateCategory);
categoryRouter.delete('/:id', protect, admin, deleteCategory);

// --- Review Routes ---
const reviewRouter = express.Router();
reviewRouter.get('/product/:id', getProductReviews);
reviewRouter.post('/', protect, createReview);
reviewRouter.delete('/:id', protect, deleteReview);
reviewRouter.get('/', protect, admin, getAllReviews);

router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/reviews', reviewRouter);

export default router;
