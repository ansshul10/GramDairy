import { Product, Category, Review } from '../models/CatalogModels.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';

// --- Product Section ---

/**
 * @desc    Get all products (with filters & pagination)
 * @route   GET /api/v1/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

  const query = {};

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Sorting
  let sortBy = { createdAt: -1 };
  if (sort === 'price_asc') sortBy = { price: 1 };
  if (sort === 'price_desc') sortBy = { price: -1 };
  if (sort === 'rating') sortBy = { ratings: -1 };

  const products = await Product.find(query)
    .populate('category', 'name')
    .sort(sortBy)
    .limit(Number(limit))
    .skip(skip);

  const total = await Product.countDocuments(query);

  return ApiResponse.success(res, 200, 'Products retrieved successfully', {
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * @desc    Get single product by slug
 * @route   GET /api/v1/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  let product;

  if (mongoose.Types.ObjectId.isValid(slug)) {
    product = await Product.findById(slug).populate('category', 'name');
  } else {
    product = await Product.findOne({ slug }).populate('category', 'name');
  }

  if (!product) {
    return ApiResponse.error(res, 404, 'Product not found');
  }

  return ApiResponse.success(res, 200, 'Product retrieved successfully', product);
});

/**
 * @desc    Create a product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.map((file) => file.path);

  if (!images || images.length === 0) {
    return ApiResponse.error(res, 400, 'Please upload at least one image');
  }

  const product = await Product.create({
    ...req.body,
    images,
  });

  return ApiResponse.success(res, 201, 'Product created successfully', product);
});

/**
 * @desc    Update a product
 * @route   PATCH /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return ApiResponse.error(res, 404, 'Product not found');
  }

  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map((file) => file.path);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return ApiResponse.success(res, 200, 'Product updated successfully', product);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return ApiResponse.error(res, 404, 'Product not found');
  }

  await Product.findByIdAndDelete(req.params.id);

  return ApiResponse.success(res, 200, 'Product removed successfully');
});

// --- Category Section ---

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  return ApiResponse.success(res, 200, 'Categories retrieved successfully', categories);
});

/**
 * @desc    Create a category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req.file?.path;

  if (!image) {
    return ApiResponse.error(res, 400, 'Please upload a category image');
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return ApiResponse.error(res, 400, 'Category already exists');
  }

  const category = await Category.create({
    name,
    description,
    image,
  });

  return ApiResponse.success(res, 201, 'Category created successfully', category);
});

/**
 * @desc    Update a category
 * @route   PATCH /api/v1/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return ApiResponse.error(res, 404, 'Category not found');
  }

  if (req.file) {
    req.body.image = req.file.path;
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return ApiResponse.success(res, 200, 'Category updated successfully', category);
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return ApiResponse.error(res, 404, 'Category not found');
  }

  await Category.findByIdAndDelete(req.params.id);

  return ApiResponse.success(res, 200, 'Category removed successfully');
});

// --- Review Section ---

/**
 * @desc    Create new review
 * @route   POST /api/v1/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, product: productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, 404, 'Product not found');
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    return ApiResponse.error(res, 400, 'Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  // Update Product Ratings
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await product.save();

  return ApiResponse.success(res, 201, 'Review added successfully', review);
});

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/v1/reviews/product/:id
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, 'Reviews retrieved successfully', reviews);
});

/**
 * @desc    Delete review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return ApiResponse.error(res, 404, 'Review not found');
  }

  // Auth check
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return ApiResponse.error(res, 403, 'Not authorized to delete this review');
  }

  const productId = review.product;
  await review.deleteOne();

  // Update Product Ratings
  const product = await Product.findById(productId);
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length > 0) {
    product.numReviews = reviews.length;
    product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  } else {
    product.numReviews = 0;
    product.ratings = 0;
  }

  await product.save();

  return ApiResponse.success(res, 200, 'Review deleted successfully');
});

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/v1/reviews
 * @access  Private/Admin
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).populate('user', 'name email').populate('product', 'name');
  return ApiResponse.success(res, 200, 'All reviews retrieved', reviews);
});
