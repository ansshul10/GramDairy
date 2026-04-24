import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Package,
    MapPin,
    Phone,
    CheckCircle2,
    Clock,
    Navigation,
    Search,
    Loader2,
    QrCode,
    ShieldCheck,
    AlertCircle,
    Hash,
    ArrowRight,
    User,
    ShoppingBag,
    Info,
    ExternalLink,
    ChevronRight,
    Camera,
    Terminal,
    Activity,
    Database,
    ShieldAlert,
    Server,
    Zap,
    X
} from 'lucide-react'
import deliveryService from '../../services/deliveryService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatCurrency, cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * DELIVERY PARTNER DASHBOARD
 * A simple interface for tracking assignments, scanning packages, and managing deliveries.
 * ───────────────────────────────────────────────────────────────────────────── */

const DeliveryDashboard = () => {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [otp, setOtp] = useState('')
    const [qrTokenInput, setQrTokenInput] = useState('')
    const [isScanning, setIsScanning] = useState(false)
    const [scannedOrder, setScannedOrder] = useState(null)
    const [verifyingId, setVerifyingId] = useState(null)

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['delivery-orders'],
        queryFn: () => deliveryService.getAssignedOrders(),
        refetchInterval: 30000,
    })

    const { data: historyData } = useQuery({
        queryKey: ['delivery-history'],
        queryFn: () => deliveryService.getDeliveryHistory(),
    })

    const orders = ordersData?.data || []
    const sortedOrders = [...orders].sort((a, b) => {
        if (a.qrScanned && !b.qrScanned) return -1;
        if (!a.qrScanned && b.qrScanned) return 1;
        return 0;
    });

    const filteredOrders = sortedOrders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (orders.length > 0) {
            const activeOrder = orders.find(o => o.qrScanned && !o.isDelivered)
            if (activeOrder) {
                setScannedOrder(activeOrder)
            }
        }

        const interval = setInterval(() => {
            deliveryService.updateLocation({ lat: 26.8467, lng: 80.9462 })
        }, 15000)
        return () => clearInterval(interval)
    }, [orders.length])

    useEffect(() => {
        if (scannedOrder?._id) {
            localStorage.setItem('last_processed_order_id', scannedOrder._id)
        } else {
            localStorage.removeItem('last_processed_order_id')
        }
    }, [scannedOrder?._id])

    const scanMutation = useMutation({
        mutationFn: (token) => deliveryService.scanQr(token),
        onSuccess: (res) => {
            setScannedOrder(res.data)
            setIsScanning(false)
            setQrTokenInput('')
            queryClient.invalidateQueries(['delivery-orders'])
            alert('Success: QR Code verified.')
        },
        onError: (err) => {
            alert(err.response?.data?.message || 'Error: Invalid QR Code')
        }
    })

    const generateOtpMutation = useMutation({
        mutationFn: (id) => deliveryService.generateDeliveryOtp(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['delivery-orders'])
            alert('Success: OTP sent to customer.')
        }
    })

    const verifyMutation = useMutation({
        mutationFn: ({ id, otpCode }) => deliveryService.verifyDelivery(id, otpCode),
        onSuccess: () => {
            queryClient.invalidateQueries(['delivery-orders'])
            setVerifyingId(null)
            setOtp('')
            setScannedOrder(null)
            localStorage.removeItem('last_processed_order_id')
            alert('Success: Delivery complete.')
        },
        onError: (err) => {
            alert(err.response?.data?.message || 'Error: Invalid OTP.')
        }
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-[#0a0a0a]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-4">Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-10 animate-in fade-in duration-700 pb-24 pt-4 md:pt-8 bg-transparent">

            {/* DELIVERY DASHBOARD HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10 bg-white dark:bg-[#0a0a0a] p-8 lg:p-10 rounded-none shadow-sm">
                <div>
                    <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
                        <Package className="w-4 h-4" /> Ready to Deliver
                    </h2>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                        Delivery <span className="text-gray-400 font-medium">Dashboard</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 italic">Status: Online</p>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connection: Active</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsScanning(true)}
                        className="px-8 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-4 hover:bg-gray-800 transition-all shadow-xl"
                    >
                        <QrCode className="w-4 h-4" /> Scan Package QR
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                {/* LEFT: MONITORING & ACTIONS */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-12">

                    {/* Scan Package Section */}
                    {isScanning && (
                        <div className="border border-gray-200 dark:border-gray-800 p-8 md:p-10 bg-white dark:bg-[#0a0a0a] rounded-none space-y-8 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                    <Camera className="w-4 h-4 text-primary-600" /> Scan Package
                                </h3>
                                <button onClick={() => setIsScanning(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative group flex-1">
                                    <input
                                        className="w-full pl-6 pr-6 py-4 bg-gray-50/50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white"
                                        placeholder="Enter QR code from package..."
                                        value={qrTokenInput}
                                        onChange={(e) => setQrTokenInput(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => scanMutation.mutate(qrTokenInput)}
                                    className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
                                >
                                    {scanMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Delivery Details */}
                    {scannedOrder && (
                        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] rounded-none relative overflow-hidden animate-in zoom-in-[0.98] duration-500 shadow-xl">
                            <div className="absolute top-0 right-0 w-48 h-1 bg-emerald-500" />

                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0a0a] flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Active Delivery Details</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Status: Scan Verified</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">In Progress</span>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <User className="w-3.5 h-3.5" /> Customer Details
                                        </h4>
                                        <div className="p-6 bg-gray-50/50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 flex items-center gap-5">
                                            <div className="w-12 h-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-center font-bold text-gray-400">
                                                {scannedOrder.customer?.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight leading-none">{scannedOrder.customer?.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5" /> {scannedOrder.customer?.phoneNumber}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <MapPin className="w-3.5 h-3.5 text-red-500" /> Delivery Address
                                        </h4>
                                        <div className="p-6 bg-gray-50/50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800">
                                            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase leading-relaxed italic">
                                                {scannedOrder.shippingAddress.address}, {scannedOrder.shippingAddress.city} — {scannedOrder.shippingAddress.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10 flex flex-col">
                                    <div className="flex-1 p-8 border border-gray-100 dark:border-gray-800 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-6 flex items-center gap-3">
                                            Payment Details
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Total</span>
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">{formatCurrency(scannedOrder.totalPrice)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Status</span>
                                                {scannedOrder.isPaid ? (
                                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase">Paid</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-black uppercase">Collect: {scannedOrder.paymentMethod.toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => generateOtpMutation.mutate(scannedOrder._id)}
                                        disabled={generateOtpMutation.isPending}
                                        className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {generateOtpMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
                                        Generate Delivery OTP (Send to Customer)
                                    </button>
                                </div>
                            </div>

                            {/* Complete Delivery Section */}
                            <div className="p-10 bg-gray-50/50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800">
                                <div className="max-w-md mx-auto space-y-8">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-2 italic">Confirm Delivery</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Enter 6-digit OTP from customer</p>
                                    </div>
                                    <div className="flex gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="000000"
                                            className="flex-1 bg-white dark:bg-[#0a0a0a] border-none text-center text-4xl font-bold tracking-[0.3em] p-5 outline-none focus:bg-white transition-all dark:text-white"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <button
                                            className="px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                                            onClick={() => verifyMutation.mutate({ id: scannedOrder._id, otpCode: otp })}
                                            disabled={verifyMutation.isPending || otp.length < 6}
                                        >
                                            {verifyMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-8 h-8" />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setScannedOrder(null)
                                            localStorage.removeItem('last_processed_order_id')
                                        }}
                                        className="w-full text-[9px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
                                    >
                                        Cancel Processing
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delivery Queue Section */}
                    <div className="space-y-6 bg-white dark:bg-[#0a0a0a] p-8 lg:p-10 rounded-none shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                <Package className="w-4 h-4 text-primary-600" /> Your Delivery Queue
                            </h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">New Orders:</span>
                                <span className="text-[11px] font-black text-gray-900 dark:text-white">{filteredOrders.length} Orders</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                            {filteredOrders.length === 0 ? (
                                <div className="py-32 bg-white dark:bg-[#0a0a0a] text-center flex flex-col items-center">
                                    <Package className="w-10 h-10 mb-6 text-gray-200 dark:text-gray-700" />
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">No deliveries assigned right now.</p>
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
                                                    <ShoppingBag className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Order ID</p>
                                                    <p className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tighter">#{order._id.toString().slice(-10).toUpperCase()}</p>
                                                    <div className="flex items-center gap-6 mt-3">
                                                        <span className={cn(
                                                            "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest italic",
                                                            order.qrScanned ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                                        )}>
                                                            {order.qrScanned ? 'Verified' : 'Pending Scan'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 md:px-12 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                                    <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{order.user?.name}</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-3.5 h-3.5 text-red-500/50" />
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-relaxed italic line-clamp-1">
                                                        {order.shippingAddress.address}, {order.shippingAddress.city}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 w-full md:w-auto">
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-900 dark:text-white tracking-widest italic">{formatCurrency(order.totalPrice)}</p>
                                                    <p className="text-[8px] font-black text-primary-600 tracking-[0.2em] uppercase mt-1">Payment: {order.paymentMethod.toUpperCase()}</p>
                                                </div>
                                                <div className="flex gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                                                    <button
                                                        onClick={() => setScannedOrder(order)}
                                                        className="px-6 py-4 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all font-mono"
                                                    >
                                                        {order.qrScanned ? 'Process' : 'Scan'}
                                                    </button>
                                                    <button className="p-4 bg-white dark:bg-[#0a0a0a] text-gray-400 hover:text-primary-600 transition-all border-l border-gray-100 dark:border-gray-800">
                                                        <Navigation className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: DELIVERY HISTORY */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] rounded-none relative overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0a0a] flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                                <Clock className="w-4 h-4 text-primary-600" /> Past Deliveries
                            </h3>
                        </div>

                        {historyData?.data?.stats && (
                            <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                                <div className="bg-white dark:bg-[#0a0a0a] p-6 text-center">
                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1 italic">Total Deliveries</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter italic">{historyData.data.stats.totalDeliveries}</p>
                                </div>
                                <div className="bg-white dark:bg-[#0a0a0a] p-6 text-center">
                                    <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-1 italic">Total Earnings</p>
                                    <p className="text-2xl font-bold text-emerald-500 tracking-tighter italic">₹{historyData.data.stats.estimatedEarnings}</p>
                                </div>
                            </div>
                        )}

                        <div className="p-8 space-y-6 max-h-[1000px] overflow-y-auto custom-scrollbar">
                            {historyData?.data?.orders?.length > 0 ? historyData.data.orders.map((hOrder) => (
                                <div key={hOrder._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:border-primary-600 transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h5 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{hOrder.user?.name || 'GUEST'}</h5>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Date: {new Date(hOrder.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Completed</p>
                                        <p className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter italic">ID: {hOrder._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-30">
                                    <Database className="w-8 h-8 mx-auto mb-4" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest">No delivery history found.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-gray-50/50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800">
                            <button className="w-full py-4 border border-gray-200 dark:border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-[#0a0a0a] transition-all">
                                Refresh History
                            </button>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] rounded-none flex items-center justify-center gap-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status: Secure</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 opacity-20" />
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">GPS Tracking: Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryDashboard
