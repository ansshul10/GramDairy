import { Minus, Plus, Trash2, Tag, Box } from 'lucide-react'
import { formatCurrency, cn } from '../../lib/utils'
import useCartStore from '../../store/cartStore'

/* ─────────────────────────────────────────────────────────────────────────────
 * CART ITEM
 * A simple display for items in your cart.
 * ───────────────────────────────────────────────────────────────────────────── */

const CartItem = ({ item }) => {
  const { addItem, removeOne, removeItem } = useCartStore()

  return (
    <div className="group flex gap-4 py-5 border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30">

      {/* Product Image Terminal */}
      <div className="relative w-24 h-24 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 flex-shrink-0 p-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute top-1 right-1">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Asset Log Data */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-tight line-clamp-1 border-b border-transparent group-hover:border-primary-600 transition-all">
                {item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                   <Tag className="w-2.5 h-2.5" /> ID: {item._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                   <Box className="w-2.5 h-2.5" /> Unit: {item.unit}
                </span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item._id)}
              className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              aria-label="Remove Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4">
          {/* Rigid Quantity Terminal */}
          <div className="flex items-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]">
            <button
              onClick={() => removeOne(item._id)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-100 dark:border-gray-800"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-bold w-10 text-center text-gray-900 dark:text-white">{item.quantity}</span>
            <button
              onClick={() => addItem(item, 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l border-gray-100 dark:border-gray-800"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Price: {formatCurrency(item.price)}</p>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tighter">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
