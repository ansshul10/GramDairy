import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Package, MapPin, CreditCard, Clock, Truck, 
  CheckCircle2, AlertCircle, ArrowLeft, Loader2,
  Calendar, Phone, User as UserIcon, QrCode, ShieldCheck,
  Navigation, Database, Terminal, Activity, FileText, Zap, Box, Tag
} from 'lucide-react'
import orderService from '../../services/orderService'
import useAuthStore from '../../store/authStore'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

/* ─────────────────────────────────────────────────────────────────────────────
 * ORDER DETAILS
 * View and track your order status and items.
 * ───────────────────────────────────────────────────────────────────────────── */

const OrderDetail = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    refetchInterval: (query) => {
      const order = query.state.data?.data;
      if (order && order.orderStatus === 'Out for Delivery' && !order.deliveryOtp) {
        return 5000;
      }
      return 30000;
    }
  })

  const statusMutation = useMutation({
    mutationFn: (status) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id])
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading order details...</p>
         </div>
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] pt-20">
        <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-6" />
        <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Order Not Found</h2>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-2 mb-8">We couldn't find the order with ID [ {id} ]</p>
        <Button onClick={() => navigate('/orders/myorders')} variant="primary" className="!rounded-none !px-12">Back to Orders</Button>
      </div>
    )
  }

  const order = data.data
  const isAdmin = user?.role === 'admin'

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700 space-y-12 pb-32">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div className="flex items-start gap-6">
            <button 
                onClick={() => navigate('/orders/myorders')}
                className="p-3 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
                    <Package className="w-4 h-4" /> Order History
                </h2>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
                    Order <span className="text-gray-400 font-medium text-3xl">Details</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Order ID: {order._id}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
          <OrderStatusBadge status={order.orderStatus} />
          {isAdmin && (
            <div className="relative group">
              <button className="px-6 py-3 border border-gray-900 dark:border-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-[#111111] transition-all dark:text-white flex items-center gap-3">
                Update Status
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                {['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                  <button 
                    key={status}
                    onClick={() => statusMutation.mutate(status)}
                    className="w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: DISPATCH FLOW & INVENTORY */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* TRACKING TERMINAL */}
          <div className="p-8 lg:p-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-12 flex items-center gap-3">
              <Activity className="w-4 h-4 text-primary-600" /> Order Tracking
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-xl">
              <TrackStep icon={Clock} label="Ordered" active={true} />
              <TrackStep icon={Package} label="Processing" active={['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)} />
              <TrackStep icon={Truck} label="Shipped" active={['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)} />
              <TrackStep icon={Navigation} label="Out for Delivery" active={['Out for Delivery', 'Delivered'].includes(order.orderStatus)} />
              <TrackStep icon={CheckCircle2} label="Delivered" active={order.orderStatus === 'Delivered'} />
            </div>
          </div>

          {/* ASSET INVENTORY */}
          <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
               <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                 <Package className="w-4 h-4 text-primary-600" /> Items in this Order
               </h4>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {order.orderItems.map((item) => (
                <div key={item.product} className="p-8 flex items-center gap-8 group hover:bg-gray-50/50 dark:hover:bg-[#111111]/30 transition-colors">
                  <div className="w-20 h-20 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-2 shrink-0">
                    <img src={item.image} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-tight truncate mb-1">{item.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{item.unit} × {item.quantity} units</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tighter italic">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Price: {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: HANDSHAKE & SECURITY */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* HANDOVER PORTAL */}
          <div className="p-8 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white space-y-10 relative shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
             
             {isAdmin ? (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Admin Scan</h3>
                    <Badge variant={order.qrScanned ? 'success' : 'warning'} className="!rounded-none !bg-white/5 !border-white/10 !text-[8px] !tracking-widest">
                      {order.qrScanned ? 'SCANNED' : 'NOT SCANNED'}
                    </Badge>
                  </div>
                  
                  {order.qrCode ? (
                    <div className="flex flex-col items-center gap-10 bg-white/5 p-8 border border-white/5">
                      <img src={order.qrCode} alt="Order QR" className="w-56 h-56 bg-white p-2 shadow-2xl" />
                      
                      <div className="w-full space-y-6">
                        <div className="p-6 bg-primary-600 rounded-none text-center">
                          <p className="text-[9px] font-black uppercase text-black tracking-[0.3em] mb-2 leading-none">Order Tracking Code</p>
                          <p className="text-3xl font-black text-black tracking-[0.3em] uppercase">{order.shortCode || 'GD-' + order._id.slice(-4).toUpperCase()}</p>
                        </div>
                        
                        <Button 
                            variant="secondary" 
                            className="w-full !rounded-none !h-12 !text-[10px] !font-black !uppercase !tracking-widest"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = order.qrCode;
                                link.download = `order-qr-${order._id.slice(-6)}.png`;
                                link.click();
                            }}
                        >
                            Download QR Code
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 opacity-30">
                       <p className="text-[10px] font-bold uppercase tracking-widest">Payment Pending</p>
                    </div>
                  )}
                </div>
             ) : (
                <div className="space-y-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 flex items-center gap-3 italic">
                    <ShieldCheck className="w-4 h-4" /> Delivery Verification
                  </h3>
                  
                  {order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed' || order.orderStatus === 'Processing' || order.orderStatus === 'Shipped' ? (
                    <div className="p-6 bg-primary-600/5 border border-primary-600/20">
                      <p className="text-[10px] font-bold text-primary-500 leading-relaxed uppercase tracking-widest italic">
                        Your delivery OTP will be shown here once the order is out for delivery.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div className="bg-white/5 p-8 border border-white/10 text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2">
                             <Activity className="w-3 h-3 text-emerald-500" />
                          </div>
                          <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-6">Delivery OTP</p>
                          <div className="flex items-center justify-center gap-4 text-5xl font-black text-white tracking-[0.4em] font-mono italic">
                            {order.deliveryOtp ? (
                              <span className="text-primary-600 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{order.deliveryOtp}</span>
                            ) : (
                              <div className="flex gap-2">
                                {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-8 bg-white/10" />)}
                              </div>
                            )}
                          </div>
                          <p className="text-[9px] font-bold text-gray-500 mt-8 leading-relaxed uppercase tracking-tighter italic">
                            {order.deliveryOtp 
                              ? "Give this OTP to the delivery partner when you receive your order."
                              : "Generating OTP..."}
                          </p>
                       </div>
                    </div>
                  )}
                </div>
             )}
          </div>

          {/* SHIPPING & BILLING METADATA */}
          <div className="space-y-8">
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Delivery Address</h3>
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                  <div className="text-[11px] font-bold text-gray-900 dark:text-white uppercase leading-relaxed tracking-tight">
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                    <p className="text-gray-400 italic">{order.shippingAddress.country}</p>
                  </div>
                </div>
            </div>

            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Summary</h3>
                <div className="space-y-4">
                  <SummaryRow label="Items Subtotal" value={formatCurrency(order.itemsPrice)} />
                  <SummaryRow label="Delivery Charges" value={order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)} />
                  <SummaryRow label="Taxes" value={formatCurrency(order.taxPrice)} />
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <SummaryRow label="Grand Total" value={formatCurrency(order.totalPrice)} highlight />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Payment: {order.paymentMethod}</span>
                   </div>
                   {order.isPaid ? (
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[8px] font-black uppercase tracking-widest italic leading-none">PAID</div>
                   ) : (
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[8px] font-black uppercase tracking-widest italic leading-none">PENDING</div>
                   )}
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const SettingsMod = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a2 2 0 0 1 2.83 0l.3.3a2 2 0 0 1 0 2.83l-3.77 3.77a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 0 1.4l-5.83 5.83a2 2 0 0 1-2.83 0l-.3-.3a2 2 0 0 1 0-2.83l5.83-5.83" />
        <path d="M11 13 4 20" />
        <path d="m9 11-4 4" />
    </svg>
)

const TrackStep = ({ icon: Icon, label, active }) => (
  <div className={cn(
    "flex flex-col items-center gap-4 py-8 px-4 transition-all relative group",
    active ? "bg-white dark:bg-[#0a0a0a]" : "bg-gray-50/50 dark:bg-[#0c0c0c] opacity-50 grayscale"
  )}>
    <div className={cn(
      "w-12 h-12 border flex items-center justify-center transition-all duration-700",
      active ? "border-primary-600 bg-primary-600/5 text-primary-600 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "border-gray-200 dark:border-gray-800 text-gray-300"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <span className={cn("text-[9px] font-black uppercase tracking-widest text-center leading-tight", active ? "text-gray-900 dark:text-white" : "text-gray-400")}>{label}</span>
    {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600" />}
  </div>
)

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-end gap-4 overflow-hidden">
    <span className={cn("text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap", highlight ? "text-[10px] text-gray-900 dark:text-white" : "text-[8px]")}>{label}</span>
    <div className="flex-1 border-b border-dotted border-gray-200 dark:border-gray-700 mb-1" />
    <span className={cn("font-black tracking-tighter italic", highlight ? "text-primary-600 text-2xl" : "text-gray-900 dark:text-white text-[11px]")}>{value}</span>
  </div>
)

const OrderStatusBadge = ({ status }) => {
  const baseClass = "px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] italic border shadow-2xl"
  switch (status) {
    case 'Processing': return <span className={cn(baseClass, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>Processing</span>
    case 'Shipped': return <span className={cn(baseClass, "bg-blue-500/10 text-blue-600 border-blue-500/20")}>Shipped</span>
    case 'Out for Delivery': return <span className={cn(baseClass, "bg-indigo-500/10 text-indigo-600 border-indigo-500/20")}>Out for Delivery</span>
    case 'Delivered': return <span className={cn(baseClass, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20")}>Delivered</span>
    case 'Cancelled': return <span className={cn(baseClass, "bg-red-500/10 text-red-600 border-red-500/20")}>Cancelled</span>
    default: return <span className={cn(baseClass, "bg-gray-500/10 text-gray-600 border-gray-500/20")}>{status.toUpperCase()}</span>
  }
}

export default OrderDetail

