import { useQuery } from '@tanstack/react-query'
import { 
  Users, 
  ShoppingCart, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Activity,
  Database,
  Terminal,
  ShieldCheck,
  Server
} from 'lucide-react'
import adminService from '../../services/adminService'
import { formatCurrency } from '../../lib/utils'
import Badge from '../../components/ui/Badge'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN DASHBOARD OVERVIEW
 * A simple interface for monitoring platform sales, users, and orders.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminDashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getDashboardStats(),
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: () => adminService.getRecentActivities(),
  })

  if (statsLoading || activityLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-4">Loading dashboard...</p>
      </div>
    )
  }

  const stats = statsData?.data || {}
  const activities = activityData?.data || {}

  const statCards = [
    { 
      label: 'Total Sales', 
      value: formatCurrency(stats.totalRevenue), 
      icon: IndianRupee, 
      color: 'text-emerald-500',
      trend: '+12.5%',
      up: true,
      meta: 'Total Earnings'
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'text-blue-500',
      trend: '+5.2%',
      up: true,
      meta: 'Active Customers'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: ShoppingCart, 
      color: 'text-purple-500',
      trend: '-2.1%',
      up: false,
      meta: 'Placed Orders'
    },
    { 
      label: 'Monthly Deliveries', 
      value: stats.activeSubscriptions, 
      icon: Calendar, 
      color: 'text-amber-500',
      trend: '+18.4%',
      up: true,
      meta: 'Daily Deliveries'
    },
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 border border-current opacity-20 flex items-center justify-center rounded-none transition-opacity group-hover:opacity-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend}
                {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">{stat.value}</h3>
              <p className="text-[9px] font-bold text-gray-400 opacity-50 uppercase tracking-widest italic">{stat.meta}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* RECENT ORDERS */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0c0c0c]">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
              Recent Orders
            </h3>
            <button className="text-[10px] font-bold text-primary-600 uppercase tracking-widest border border-primary-600/20 px-3 py-1 hover:bg-primary-50 transition-colors">View All Orders</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 text-[9px] uppercase tracking-widest font-black text-gray-400">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer Name</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {activities.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-5 text-[11px] font-bold font-mono text-gray-500 uppercase">
                        #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase rounded-none">
                          {order.user?.name?.[0] || 'U'}
                        </div>
                        <p className="text-[11px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-tight">{order.user?.name || 'GUEST'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-bold text-gray-900 dark:text-white tracking-widest">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                          "px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-none",
                          order.orderStatus === 'Delivered' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : 
                          order.orderStatus === 'Processing' ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : 
                          "bg-gray-500/10 text-gray-600 border border-gray-500/20"
                      )}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT USERS */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 flex flex-col items-stretch">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
               Recent New Users
            </h3>
          </div>
          <div className="p-8 flex-1 space-y-8">
            {activities.recentUsers?.map((user) => (
              <div key={user._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase transition-colors group-hover:border-primary-600 rounded-none">
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">User ID: {user._id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic opacity-50">
                  {new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-gray-800">
            <button className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-colors flex items-center justify-center gap-3 rounded-none">
                <Users className="w-4 h-4" /> View All Users
            </button>
          </div>
        </div>
      </div>

      {/* STORE STATUS */}
      <div className="p-8 border border-gray-100 dark:border-gray-800 flex flex-wrap gap-12 items-center justify-center">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Store Online</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 opacity-20" />
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Secure Connection</span>
            </div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 opacity-20" />
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Store Status: Online</span>
            </div>
      </div>
    </div>
  )
}

export default AdminDashboard
