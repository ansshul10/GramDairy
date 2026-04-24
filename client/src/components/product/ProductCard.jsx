import { Link } from 'react-router-dom'
import { ShoppingCart, Star, ShieldCheck, Box } from 'lucide-react'
import { cn, formatCurrency } from '../../lib/utils'
import useCartStore from '../../store/cartStore'

/* ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE PRODUCT ASSET CARD
 * Transformed from a standard retail card into a dense, structural 
 * logistics identifier. Features sharp 1px borders and technical labels.
 * ───────────────────────────────────────────────────────────────────────────── */

const ProductCard = ({ product }) => {
  const { name, slug, price, discountPrice, images, ratings, numReviews, unit, category } = product
  const { addItem } = useCartStore()
  
  const hasDiscount = discountPrice > 0 && discountPrice < price

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className="group bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative flex flex-col transition-colors hover:border-primary-600 dark:hover:border-primary-500">
      
      {/* Top Protocol Strip */}
      <div className="px-3 py-1.5 bg-gray-50 dark:bg-[#111111] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Asset
        </span>
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
          <Box className="w-3 h-3" /> {unit}
        </span>
      </div>

      {/* Asset Image Container */}
      <Link to={`/products/${slug}`} className="relative block aspect-[4/3] overflow-hidden bg-white dark:bg-[#0a0a0a] p-4">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-contain filter saturate-[0.85] group-hover:saturate-100 transition-all duration-500"
        />
        
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-primary-600 text-white text-[9px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter shadow-sm ring-1 ring-primary-400/20">
            {Math.round(((price - discountPrice) / price) * 100)}% DISCOUNT
          </div>
        )}
      </Link>

      {/* Technical Data Block */}
      <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Verified Score: {ratings.toFixed(1)} <span className="text-gray-300 dark:text-gray-700 mx-1">/</span> {numReviews} Reports
            </span>
          </div>

          <Link 
            to={`/products/${slug}`}
            className="block text-sm font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors uppercase tracking-tight"
          >
            {name}
          </Link>
          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{category?.name || 'Standard Inventory'}</p>
        </div>

        {/* Procurement Transaction Row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-none mb-1">Selling Price</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                    {formatCurrency(discountPrice)}
                  </span>
                </div>
                <div className="flex flex-col mt-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Actual Price</span>
                  <span className="text-[11px] text-gray-400 line-through font-bold">
                    {formatCurrency(price)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                {formatCurrency(price)}
              </span>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            className="px-4 py-2 border border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Hover Selection Overlay (Static indication) */}
      <div className="absolute inset-0 border-2 border-primary-600 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" />
    </div>
  )
}

export default ProductCard
