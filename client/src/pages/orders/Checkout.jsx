import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, CreditCard, ChevronRight, Truck, ShieldCheck, Loader2, Database, Terminal, Workflow, Activity, Package } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import orderService from '../../services/orderService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { formatCurrency, cn } from '../../lib/utils'
import couponService from '../../services/couponService'
import authService from '../../services/authService'
import Badge from '../../components/ui/Badge'

/* ─────────────────────────────────────────────────────────────────────────────
 * ORDER CHECKOUT
 * A simple multi-step screen for finishing your order.
 * ───────────────────────────────────────────────────────────────────────────── */

const addressSchema = z.object({
  address: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().length(6, 'Please enter a valid 6-digit Pincode'),
  country: z.string().default('India'),
})

const Checkout = () => {
  const [step, setStep] = useState(1) // 1: Delivery Address, 2: Payment Method
  const [paymentMethod, setPaymentMethod] = useState('Razorpay')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const { items, getSubtotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  const { data: activeCouponsResponse } = useQuery({
    queryKey: ['activeCoupons'],
    queryFn: () => couponService.getActiveCoupons(),
  })
  const availableCoupons = activeCouponsResponse?.data || []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  })

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await authService.getProfileStats()
        setWalletBalance(response.data.walletBalance || 0)
      } catch (e) {}
    }
    fetchBalance()
  }, [])

  // Calculations
  const subtotal = getSubtotal()
  const shippingPrice = subtotal > 500 ? 0 : 50
  const taxPrice = Math.round(subtotal * 0.05) // Standard 5% tax protocol
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0
  const initialTotal = subtotal + shippingPrice + taxPrice - discount
  const totalPrice = Math.max(0, initialTotal - pointsToRedeem)

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setIsValidating(true)
    try {
      const response = await couponService.validateCoupon(couponCode, subtotal)
      setAppliedCoupon(response.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid coupon code')
      setAppliedCoupon(null)
    } finally {
      setIsValidating(false)
    }
  }

  const onAddressSubmit = (data) => {
    localStorage.setItem('shippingAddress', JSON.stringify(data))
    setStep(2)
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    try {
      const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))
      const orderData = {
        orderItems: items,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        taxPrice,
        totalPrice: initialTotal,
        pointsToRedeem,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      }

      const response = await orderService.createOrder(orderData)
      clearCart()
      navigate(`/orders/success/${response.data._id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.')
      setIsPlacingOrder(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] pt-20 px-6">
        <div className="p-10 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] max-w-md text-center">
            <Package className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">Your Cart is Empty</h2>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed mb-8">Please add some products to your cart before checking out.</p>
            <Button 
                onClick={() => navigate('/products')}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-none h-12 text-[10px] font-bold tracking-[0.2em] uppercase"
            >
                Browse Products
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] pt-24 pb-12 lg:pt-32 lg:pb-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
                <ShieldCheck className="w-4 h-4" /> Secure Checkout
            </h2>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-12">
                Finalize <span className="text-gray-400 font-medium">Order</span>
            </h1>

            {/* Checkout Progress Bar */}
            <div className="flex items-center gap-0 w-full max-w-2xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-1">
                <div className={cn(
                    "flex-1 py-3 px-6 flex items-center justify-center gap-3 transition-colors",
                    step === 1 ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" : "text-gray-400"
                )}>
                    <span className="text-[10px] font-black tracking-widest">01 / Shipping Address</span>
                    {step > 1 && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-800" />
                <div className={cn(
                    "flex-1 py-3 px-6 flex items-center justify-center gap-3 transition-colors",
                    step === 2 ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" : "text-gray-400"
                )}>
                    <span className="text-[10px] font-black tracking-widest">02 / Payment Method</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: INPUT MODULES */}
          <div className="lg:col-span-8 space-y-12">
            {step === 1 ? (
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-[#111111] -mr-16 -mt-16 rotate-45 border-b border-gray-200 dark:border-gray-800" />
                
                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <MapPin className="w-4 h-4 text-primary-600" /> Delivery Address
                </h2>

                <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Address (House, Street, Area)</label>
                    <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('address')} error={errors.address?.message} placeholder="Enter your full address..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                      <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('city')} error={errors.city?.message} placeholder="e.g. New York, London" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                      <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('postalCode')} error={errors.postalCode?.message} placeholder="000000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Country</label>
                    <Input className="!rounded-none !bg-gray-100 dark:!bg-[#0c0c0c] !border-gray-200 dark:!border-gray-800 opacity-60" disabled value="India" />
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button 
                        type="submit" 
                        className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl"
                    >
                      Continue to Payment <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-500">
                {/* Payment Selection Module */}
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 lg:p-12">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-6">
                    <CreditCard className="w-4 h-4 text-primary-600" /> Payment Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                    {['Razorpay', 'COD'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={cn(
                          "p-8 text-left transition-all relative group bg-white dark:bg-[#0a0a0a]",
                          paymentMethod === method ? "ring-2 ring-inset ring-primary-600 z-10" : ""
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs">
                                {method === 'Razorpay' ? 'Pay Online' : 'Pay on Delivery'}
                            </p>
                            <div className={cn(
                                "w-4 h-4 border-2 rounded-full flex items-center justify-center transition-colors",
                                paymentMethod === method ? "border-primary-600 bg-primary-600" : "border-gray-200"
                            )}>
                                {paymentMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            {method === 'Razorpay' ? 'Securely pay using UPI, Cards or Net Banking' : 'Pay when your order is delivered'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Review Module */}
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 lg:p-12">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                     <Package className="w-4 h-4" /> Review Your Items
                  </h3>
                  <div className="border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c]">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items.map((item) => (
                            <tr key={item._id} className="group hover:bg-white dark:hover:bg-[#111111] transition-colors">
                                <td className="p-5 w-20">
                                    <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 p-1 flex items-center justify-center">
                                        <img src={item.image} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                </td>
                                <td className="p-5">
                                    <h4 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h4>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quantity: {item.quantity} × {item.unit}</p>
                                </td>
                                <td className="p-5 text-right font-bold text-[11px] text-gray-900 dark:text-white tracking-widest">
                                    {formatCurrency(item.price * item.quantity)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: SUMMARY ANALYTICS */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
                
                {/* 1. TRANSACTION LOG */}
                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-1 py-1 bg-primary-600" />
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                        Order Summary
                    </h3>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Items Total</span>
                            <span className="text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Delivery Fee</span>
                            <span className={cn(shippingPrice === 0 ? "text-emerald-500" : "text-gray-900 dark:text-white")}>
                                {shippingPrice === 0 ? 'FREE' : formatCurrency(shippingPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Taxes (5%)</span>
                            <span className="text-gray-900 dark:text-white">{formatCurrency(taxPrice)}</span>
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 p-3 border border-emerald-500/20">
                                <div className="flex flex-col">
                                    <span>Coupon Applied</span>
                                    <span className="text-[9px] font-black opacity-60">CODE: {appliedCoupon.code}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span>-{formatCurrency(discount)}</span>
                                    <button onClick={() => setAppliedCoupon(null)} className="text-[9px] underline hover:text-red-500 mt-1 uppercase">Remove</button>
                                </div>
                            </div>
                        )}

                        {pointsToRedeem > 0 && (
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-emerald-500">
                                <span className="text-gray-400">Wallet Points Used</span>
                                <span>-{formatCurrency(pointsToRedeem)}</span>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] italic">Total Amount</span>
                                <span className="text-3xl font-bold text-primary-600 tracking-tighter leading-none">{formatCurrency(totalPrice)}</span>
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase text-right">TID: {Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Applied Operations Actions */}
                    <div className="mt-10 space-y-4">
                        {!appliedCoupon && (
                            <div className="flex gap-2">
                                <Input
                                    className="!h-12 !rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800 !text-xs !font-bold !uppercase !placeholder:text-gray-300"
                                    placeholder="Enter Coupon Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isValidating}
                                    className="px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            </div>
                        )}

                        {!appliedCoupon && availableCoupons.length > 0 && (
                            <div className="mt-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Or Choose Available Coupon</p>
                                <div className="space-y-2">
                                    {availableCoupons.map((coupon) => (
                                        <button
                                            key={coupon._id}
                                            disabled={isValidating || subtotal < coupon.minPurchase}
                                            onClick={async () => {
                                                setCouponCode(coupon.code);
                                                setIsValidating(true);
                                                try {
                                                    const response = await couponService.validateCoupon(coupon.code, subtotal);
                                                    setAppliedCoupon(response.data);
                                                } catch (err) {
                                                    alert(err.response?.data?.message || 'Invalid coupon code');
                                                    setAppliedCoupon(null);
                                                } finally {
                                                    setIsValidating(false);
                                                }
                                            }}
                                            className="w-full text-left p-3 border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div>
                                                <span className="text-xs font-black text-emerald-600 block uppercase tracking-widest mb-0.5">{coupon.code}</span>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Save ₹{coupon.discountAmount} on orders above ₹{coupon.minPurchase}</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase border border-emerald-500/30 px-3 py-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">Apply</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && walletBalance > 0 && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Input
                                    type="number"
                                    max={Math.min(walletBalance, initialTotal)}
                                    min="0"
                                    className="!h-12 !rounded-none !bg-emerald-50/50 dark:!bg-emerald-900/10 !border-emerald-200 dark:!border-emerald-800 !text-xs !font-bold !uppercase !placeholder:text-gray-400"
                                    placeholder={`Max ${Math.min(walletBalance, initialTotal)} pts`}
                                    value={pointsToRedeem || ''}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value) || 0
                                        if (val > Math.min(walletBalance, initialTotal)) val = Math.min(walletBalance, initialTotal)
                                        setPointsToRedeem(val)
                                    }}
                                />
                                <button
                                    onClick={() => setPointsToRedeem(Math.min(walletBalance, initialTotal))}
                                    className="px-6 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shrink-0"
                                >
                                    Use Max
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <button
                                className="relative w-full h-16 bg-emerald-600 text-white font-black tracking-[0.3em] uppercase text-xs shadow-2xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 overflow-hidden group disabled:opacity-90 disabled:cursor-wait"
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <div className="absolute inset-0 bg-emerald-700/50 w-full h-full animate-pulse" />
                                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                        <span className="relative z-10 animate-pulse text-[10px]">Placing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform duration-500" />
                                        <span className="relative z-10">Place Order</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. CORPORATE TRUST & COMPLIANCE */}
                <div className="p-8 border border-gray-200 dark:border-gray-800 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 flex items-center justify-center rounded-none">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Early Morning Delivery</p>
                            <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">Expected between 6:00 AM - 8:00 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50 dark:border-gray-800/50">
                        <div className="w-10 h-10 border border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center rounded-none">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Safe Payments</p>
                            <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest">Your transactions are 100% protected</p>
                        </div>
                    </div>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed pt-4">
                        By placing this order, you agree to our terms and conditions.
                    </p>
                </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
