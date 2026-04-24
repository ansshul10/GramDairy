import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Trash2, CheckCircle2, Package, Tag, Calendar, Info, ShieldCheck, Mail, Loader2, RefreshCw, X } from 'lucide-react'
import notificationService from '../../services/notificationService'
import { cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * MY NOTIFICATIONS
 * View and manage all your updates and alerts here.
 * ───────────────────────────────────────────────────────────────────────────── */

const NotificationsPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  })

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('All notifications marked as read.')
    },
  })

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('Notification deleted.')
    },
  })

  const purgeAllMutation = useMutation({
    mutationFn: () => notificationService.purgeAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('All notifications cleared.')
    },
  })

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markReadMutation.mutate(notif._id)
    
    // Logic for deep linking based on type/metadata
    if (notif.metadata?.orderId) {
      navigate(`/orders/${notif.metadata.orderId}`)
    }
  }

  const notifications = data?.data || []
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-32 animate-in fade-in duration-700">
      
      {/* 1. SECTOR HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
            <Bell className="w-4 h-4" /> Your Updates
          </h2>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Notification <span className="text-gray-400 font-medium italic">History</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
            Total Notifications: <span className="text-primary-600 font-black">{notifications.length}</span>
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => markAllMutation.mutate()}
                className="!rounded-none border-gray-200 dark:border-gray-800 h-11 text-[10px] font-black uppercase tracking-widest"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark All as Read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all notifications? This cannot be undone.')) {
                  purgeAllMutation.mutate()
                }
              }}
              className="!rounded-none border-red-500/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 h-11 text-[10px] font-black uppercase tracking-widest"
              isLoading={purgeAllMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        )}
      </div>

      {/* 2. DATA STREAM */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
             <div key={i} className="h-28 bg-gray-50/50 dark:bg-[#111111] animate-pulse rounded-none border border-gray-100 dark:border-gray-800" />
          ))
        ) : notifications.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c]">
             <div className="flex flex-col items-center gap-6 opacity-20">
                <Mail className="w-16 h-16" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">No notifications found</p>
             </div>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif._id}
              className={cn(
                "group relative border transition-all duration-300",
                notif.isRead 
                  ? "bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-gray-800" 
                  : "bg-primary-50/10 dark:bg-primary-900/5 border-primary-200/50 dark:border-primary-800/50 shadow-sm shadow-primary-500/5"
              )}
            >
              {/* Status Indicator */}
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600" />
              )}

              <div className="p-6 md:p-8 flex gap-6 md:gap-8 items-start">
                  <div className={cn(
                    "w-12 h-12 flex items-center justify-center shrink-0 border",
                    notifIconColors(notif.type)
                  )}>
                    <NotifIcon type={notif.type} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em] italic">
                         {notif.type} Update
                       </span>
                       <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                         {new Date(notif.createdAt).toLocaleString()}
                       </span>
                    </div>

                    <div className="cursor-pointer" onClick={() => handleNotificationClick(notif)}>
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight uppercase tracking-tight">
                         {notif.title}
                       </h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-2xl">
                         {notif.message}
                       </p>
                    </div>

                    {/* Operational Actions */}
                    <div className="flex items-center gap-4">
                       <button 
                        onClick={() => deleteMutation.mutate(notif._id)}
                        className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest border border-gray-100 dark:border-gray-800 px-3 py-1.5 hover:border-red-600/20"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> Delete
                       </button>
                    </div>
                  </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. OPERATIONS FOOTER */}
      {notifications.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800 text-center">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
             You're all caught up!
           </p>
        </div>
      )}
    </div>
  )
}

const notifIconColors = (type) => {
  switch (type) {
    case 'Order': return 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 border-blue-200 dark:border-blue-800'
    case 'Promotion': return 'bg-orange-50/50 dark:bg-orange-900/10 text-orange-600 border-orange-200 dark:border-orange-800'
    case 'Subscription': return 'bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-200 dark:border-emerald-800'
    case 'OTP': return 'bg-primary-50/50 dark:bg-primary-900/10 text-primary-600 border-primary-200 dark:border-primary-800'
    default: return 'bg-gray-50/50 dark:bg-gray-800/20 text-gray-600 border-gray-200 dark:border-gray-800'
  }
}

const NotifIcon = ({ type }) => {
  switch (type) {
    case 'Order': return <Package className="w-5 h-5" />
    case 'Promotion': return <Tag className="w-5 h-5" />
    case 'Subscription': return <Calendar className="w-5 h-5" />
    case 'OTP': return <ShieldCheck className="w-5 h-5" />
    default: return <Info className="w-5 h-5" />
  }
}

export default NotificationsPage
