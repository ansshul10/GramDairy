import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ShoppingCart, 
  Calendar, 
  ShieldCheck, 
  Truck, 
  Star, 
  Info, 
  Loader2, 
  Minus, 
  Plus,
  ArrowLeft,
  Settings,
  Archive,
  Fingerprint,
  BarChart3
} from 'lucide-react'
import productService from '../../services/productService'
import { formatCurrency } from '../../lib/utils'
import SubscribeModal from '../../components/product/SubscribeModal'
import ReviewSection from '../../components/product/ReviewSection'
import SEO from '../../components/common/SEO'
import useCartStore from '../../store/cartStore'

/* ─────────────────────────────────────────────────────────────────────────────
 * PRODUCT DETAILS
 * Comprehensive information and ordering options for our dairy products.
 * ───────────────────────────────────────────────────────────────────────────── */

const ProductDetail = () => {
  const { slug } = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const { addItem } = useCartStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] px-6">
        <div className="p-10 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-400 mb-4 uppercase tracking-tight">Product Not Found</h2>
          <p className="text-sm text-red-600 dark:text-red-400/80 mb-8">We couldn't find the product you're looking for. It might be out of stock or moved.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-800 text-white font-bold text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    )
  }

  const product = data.data
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      <SEO 
        title={`${product.name} | GramDairy`}
        description={product.description}
        type="product"
        image={product.images[0]}
        price={product.discountPrice || product.price}
        rating={product.ratings}
      />

      {/* PRODUCT HEADER */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-3 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <span className="opacity-30">/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black uppercase tracking-[0.2em] rounded-none">
                  {product.category?.name}
                </span>
                {product.isDailyEssential && (
                  <span className="px-2 py-1 border border-emerald-500/30 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-none bg-emerald-50 dark:bg-emerald-900/10">
                    Daily Essential
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                {product.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-4 rounded-sm shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{product.ratings.toFixed(1)}</span>
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800" />
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{product.numReviews} Verified Reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* PRODUCT IMAGES */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-8 relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain filter saturate-0 group-hover:saturate-100 transition-all duration-700"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square border transition-all p-2 bg-white dark:bg-[#111111] ${
                    selectedImage === i ? 'border-primary-600 ring-1 ring-primary-600' : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain grayscale" />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <Info className="w-3.5 h-3.5" /> Product Details
               </h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                 {product.description}
               </p>
            </div>
          </div>

          {/* CONFIGURATION & PURCHASE */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* PRODUCT SPECIFICATIONS */}
            <div className="border border-gray-200 dark:border-gray-800 overflow-hidden rounded-none">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th colSpan="2" className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Specifications</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        <tr>
                            <td className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30 dark:bg-[#0c0c0c] w-1/3">Quantity</td>
                            <td className="px-5 py-3 text-xs font-bold text-gray-900 dark:text-gray-200 tracking-tight">{product.unit}</td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30 dark:bg-[#0c0c0c]">Availability</td>
                            <td className={`px-5 py-3 text-xs font-bold tracking-tight ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `In Stock` : 'Out of Stock'}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30 dark:bg-[#0c0c0c]">Product ID</td>
                            <td className="px-5 py-3 text-xs font-mono font-bold text-gray-500 uppercase">{product._id.slice(-8).toUpperCase()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* PRICING */}
            <div className="p-8 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-600" />
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Product Price</h3>
                
                <div className="flex items-baseline gap-4 mb-4">
                  {hasDiscount ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
                        {formatCurrency(product.discountPrice)}
                      </span>
                      <span className="text-lg text-gray-400 line-through font-medium">
                        {formatCurrency(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">/ Per {product.unit.split(' ')[1] || 'Unit'}</span>
                </div>
            </div>

            {/* PURCHASE OPTIONS */}
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Quantity</span>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-900 dark:hover:border-white transition-colors"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-lg font-bold text-gray-900 dark:text-white w-6 text-center leading-none">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-900 dark:hover:border-white transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => addItem(product, quantity)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-3 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold tracking-widest uppercase text-xs shadow-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Shopping Cart
                  </button>
                  
                  {product.isDailyEssential && (
                    <button 
                      onClick={() => setIsSubscribeOpen(true)}
                      className="w-full flex items-center justify-center gap-3 py-6 border border-primary-600 text-primary-600 dark:text-primary-400 font-bold tracking-widest uppercase text-xs hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      Set Up Daily Delivery
                    </button>
                  )}
                </div>
            </div>

            {/* 4. LOGISTICS ASSURANCE */}
            <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                <div className="p-6 bg-white dark:bg-[#0a0a0a] flex flex-col gap-3">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/10 text-blue-600 border border-blue-200 dark:border-blue-900/30 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Fast Delivery</span>
                    <p className="text-[9px] text-gray-500 font-medium leading-relaxed">Direct delivery to your doorstep every morning.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#0a0a0a] flex flex-col gap-3">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Quality Verified</span>
                    <p className="text-[9px] text-gray-500 font-medium leading-relaxed">Certified for safety and fresh consumption.</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-gray-50/50 dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-gray-800 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-3 italic">
               <Star className="w-4 h-4" /> Customer Reviews
            </h3>
            <ReviewSection productId={product._id} />
          </div>
      </div>
      
      <SubscribeModal 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
        product={product} 
      />
    </div>
  )
}

export default ProductDetail
