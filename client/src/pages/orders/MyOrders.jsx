import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Loader2, 
  Database,
  Terminal,
  Activity,
  Box,
  LayoutGrid,
  FileText
} from 'lucide-react'
import orderService from '../../services/orderService'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

/* ─────────────────────────────────────────────────────────────────────────────
 * USER ORDER HISTORY
 * A simple interface for tracking and managing past deliveries.
 * ───────────────────────────────────────────────────────────────────────────── */

const MyOrders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading your orders...</p>
        </div>
      </div>
    )
  }

  const orders = data?.data || []

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      
      {/* 1. MY DASHBOARD HEADER */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
                        <FileText className="w-4 h-4" /> Order History
                    </h2>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
                        My <span className="text-gray-400 font-medium text-4xl">Orders</span>
                    </h1>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide italic">Track and manage all your past deliveries.</p>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2">
                    <div className="flex items-center gap-4 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-5 py-3 rounded-sm shadow-sm ring-1 ring-gray-900/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total Orders</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white text-right leading-none mt-1">{orders.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {orders.length === 0 ? (
          <div className="text-center py-32 border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-[#111111] -mr-16 -mt-16 rotate-45 border-b border-gray-100 dark:border-gray-800" />
            <Database className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">No Orders Found</h2>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-10">You haven't placed any orders yet.</p>
            <Link to="/products">
                <button className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Start Shopping
                </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
            {orders.map((order) => (
              <Link 
                key={order._id} 
                to={`/orders/${order._id}`}
                className="block bg-white dark:bg-[#0a0a0a] p-8 group hover:bg-gray-50 dark:hover:bg-[#111111]/30 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform shrink-0">
                      <Box className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Order #{order._id.slice(-6).toUpperCase()}</h4>
                         <span className="text-[9px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 border border-gray-100 dark:border-gray-700 font-mono">ID: {order._id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-6">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" /> Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                          <LayoutGrid className="w-3.5 h-3.5" /> Items: {order.orderItems.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-10">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Total Amount</p>
                      <p className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white italic">{formatCurrency(order.totalPrice)}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <OrderStatusBadge status={order.orderStatus} />
                      <ChevronRight className="w-6 h-6 text-gray-200 dark:text-gray-800 group-hover:text-primary-600 group-hover:translate-x-2 transition-all shrink-0" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 3. MORE INFO */}
        <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Your order history is safe</p>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Orders up to date</span>
                </div>
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-primary-600" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Logged in</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

const OrderStatusBadge = ({ status }) => {
  const baseClass = "px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] italic shadow-sm"
  switch (status) {
    case 'Processing':
      return <span className={cn(baseClass, "bg-amber-500/10 text-amber-600 border border-amber-500/20")}>Getting Ready</span>
    case 'Shipped':
      return <span className={cn(baseClass, "bg-blue-500/10 text-blue-600 border border-blue-500/20")}>On the way</span>
    case 'Delivered':
      return <span className={cn(baseClass, "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20")}>Reached you</span>
    case 'Cancelled':
      return <span className={cn(baseClass, "bg-red-500/10 text-red-600 border border-red-500/20")}>Stopped</span>
    default:
      return <span className={cn(baseClass, "bg-gray-500/10 text-gray-600 border border-gray-500/20")}>{status.toUpperCase()}</span>
  }
}

export default MyOrders

