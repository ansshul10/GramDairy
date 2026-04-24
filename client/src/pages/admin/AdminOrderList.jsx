import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Filter, Download, ShoppingBag, Clock, CheckCircle2, QrCode, Terminal, Database, Activity, ShieldCheck, Box } from 'lucide-react'
import orderService from '../../services/orderService'
import { formatCurrency } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN ORDER MANAGEMENT CONSOLE
 * A simple interface for tracking and managing all customer orders.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminOrderList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderService.getAllOrders(),
  })

  const orders = data?.data || []
  const filteredOrders = orders.filter(o => 
    o.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o._id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Processing').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0)
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* ORDER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            Order Dashboard
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Manage <span className="text-gray-400 font-medium">Orders</span>
          </h1>
        </div>
        <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl rounded-none">
          <Download className="w-4 h-4" /> Export Orders (CSV)
        </button>
      </div>

      {/* ORDER STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
        <StatsCard icon={ShoppingBag} label="Total Orders" value={stats.total} meta="LIFETIME" />
        <StatsCard icon={Clock} label="Pending Orders" value={stats.pending} meta="TO BE DELIVERED" color="text-amber-500" />
        <StatsCard icon={CheckCircle2} label="Delivered Orders" value={stats.delivered} meta="SUCCESS" color="text-emerald-500" />
        <StatsCard icon={ShieldCheck} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} meta="GROSS SALES" />
      </div>

      {/* 3. ORDER LIST */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        
        {/* Search & Filter */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] flex flex-col sm:flex-row gap-6">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white rounded-none"
              placeholder="Search by Order ID or Customer..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2 rounded-none">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 text-[9px] uppercase tracking-widest font-black text-gray-400">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer Name</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10 bg-gray-50/20 dark:bg-gray-800/10" />
                  </tr>
                ))
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-bold font-mono text-primary-600 uppercase tracking-tighter">#{order._id.slice(-10).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{order.user?.name || 'GUEST'}</p>
                       <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-1">{order.user?.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-white tracking-widest">{formatCurrency(order.totalPrice)}</span>
                      <p className="text-[8px] text-gray-400 font-black uppercase mt-1 italic">Items: {order.orderItems.length}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <AdminStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                        {order.qrCode && (
                          <button 
                            className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-all rounded-none"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = order.qrCode;
                              link.download = `QR-${order._id.slice(-6)}.png`;
                              link.click();
                            }}
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        <Link to={`/admin/orders/${order._id}`}>
                          <button className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-all rounded-none">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const StatsCard = ({ icon: Icon, label, value, meta, color = "text-gray-400" }) => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30">
      <div className="flex items-start justify-between mb-8">
        <div className={`w-10 h-10 border border-current opacity-20 flex items-center justify-center rounded-none ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-3">{value}</p>
        <p className="text-[9px] font-bold text-gray-400 opacity-50 uppercase tracking-widest italic">{meta}</p>
      </div>
    </div>
  )
}

const AdminStatusBadge = ({ status }) => {
  const baseClass = "px-2 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-none"
  switch (status) {
    case 'Processing': return <span className={`${baseClass} bg-amber-500/10 text-amber-600 border border-amber-500/20`}>Processing</span>
    case 'Shipped': return <span className={`${baseClass} bg-blue-500/10 text-blue-600 border border-blue-500/20`}>Shipped</span>
    case 'Delivered': return <span className={`${baseClass} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>Delivered</span>
    case 'Cancelled': return <span className={`${baseClass} bg-red-500/10 text-red-600 border border-red-500/20`}>Cancelled</span>
    default: return <span className={`${baseClass} bg-gray-500/10 text-gray-600 border border-gray-500/20`}>{status}</span>
  }
}

export default AdminOrderList
