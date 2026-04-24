import { X, ShoppingBag, ArrowRight, Truck, Sparkles, Percent, Database, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn, formatCurrency } from '../../lib/utils'
import useCartStore from '../../store/cartStore'
import CartItem from './CartItem'

/* ─────────────────────────────────────────────────────────────────────────────
 * SHOPPING CART
 * A clean, elegant side panel for managing your selected items.
 * ───────────────────────────────────────────────────────────────────────────── */

const CartDrawer = () => {
  const { items, getSubtotal, getItemCount, isCartOpen, closeCart } = useCartStore()
  const navigate = useNavigate()

  const subtotal = getSubtotal()
  const shippingThreshold = 500
  const shippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100)
  const remainingForFreeShipping = Math.max(shippingThreshold - subtotal, 0)

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop: Solid Minimal Overlay */}
      <div
        className="absolute inset-0 bg-gray-950/40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer: Rigid Structural Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 transition-transform">

        {/* Header: Core Terminal Identification */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Your Shopping Cart</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Total Items: {getItemCount()}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statistics & Quota Meter */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-primary-600" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {remainingForFreeShipping > 0
                    ? `Add ${formatCurrency(remainingForFreeShipping)} more for free delivery`
                    : "You've unlocked free delivery!"}
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-none overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-1000 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Data Stream Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-gray-700" />
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">Your cart is empty</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Add some fresh dairy products to your cart to get started.</p>
              <button
                onClick={closeCart}
                className="mt-8 px-8 py-3 border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Transaction Summary & Finalization */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Items Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest italic">Grand Total</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Tax Included</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full flex items-center justify-center gap-3 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold tracking-[0.2em] uppercase text-xs shadow-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-6">
                <button className="flex items-center gap-2 text-[9px] font-bold text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors">
                  <Percent className="w-3 h-3" /> Insert Promo Code
                </button>
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-800"></div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Earn Credits: 50
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
