import { Link, useParams } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight, Calendar, ShieldCheck, Activity, Terminal, Database } from 'lucide-react'
import Button from '../../components/ui/Button'

/* ─────────────────────────────────────────────────────────────────────────────
 * USER ORDER SUCCESS
 * A friendly confirmation screen for successfully placed orders.
 * ───────────────────────────────────────────────────────────────────────────── */

const OrderSuccess = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center pt-24 pb-12 px-6">
      <div className="max-w-xl w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden p-8 lg:p-12 shadow-2xl shadow-black/5">
        
        {/* Verification Status Header */}
        <div className="text-center space-y-8">
            <div className="relative inline-block">
                <div className="w-20 h-20 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mx-auto rounded-sm ring-8 ring-emerald-500/5">
                    <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900">
                    <Activity className="w-3 h-3" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                    Order Successful
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Order ID: </span>
                    <span className="text-[10px] font-mono font-bold text-primary-600 leading-none">
                        {id?.toUpperCase()}
                    </span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto uppercase tracking-wide">
                    Thank you! Your order has been placed and is being processed.
                </p>
            </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mt-12">
            <div className="bg-white dark:bg-[#0c0c0c] p-6 lg:p-8 space-y-4">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Status</h4>
                    <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase">CONFIRMED</p>
                </div>
            </div>
            <div className="bg-white dark:bg-[#0c0c0c] p-6 lg:p-8 space-y-4">
                <Calendar className="w-5 h-5 text-primary-600" />
                <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Expected Delivery</h4>
                    <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tighter italic">{"TOMORROW MORNING"}</p>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 space-y-4">
            <Link to={`/orders/${id}`} className="block">
                <button className="w-full h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                    Track My Order
                </button>
            </Link>
            <Link to="/" className="block">
                <button className="w-full h-14 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#111111] font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3">
                    Continue Shopping
                </button>
            </Link>
        </div>

        {/* Bottom Metadata Info */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Your order is secure and confirmed.
            </p>
        </div>

        {/* Abstract Corner Elements */}
        <div className="absolute top-0 right-0 w-2 h-16 bg-primary-600" />
        <div className="absolute bottom-0 left-0 w-16 h-2 bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  )
}

export default OrderSuccess
