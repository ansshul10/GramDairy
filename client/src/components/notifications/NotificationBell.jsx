import { useState, useRef, useEffect } from 'react'
import { Bell, Package, Tag, Calendar, Info, Loader2, ShieldCheck, Check, Trash2, Mail } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import notificationService from '../../services/notificationService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE NOTIFICATION MODULE
 * Strict structural layout mapping to the parent Command Center aesthetic.
 * ───────────────────────────────────────────────────────────────────────────── */

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 30000, 
  })

  // Outside click handler to securely close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const markOneMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const purgeAllMutation = useMutation({
    mutationFn: () => notificationService.purgeAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast.success('All notifications cleared.')
    },
  })

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markOneMutation.mutate(notif._id)
    
    if (notif.metadata?.orderId) {
      navigate(`/orders/${notif.metadata.orderId}`)
      setIsOpen(false)
    }
  }

  const notifications = data?.data || []
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative flex items-center justify-center" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-[#111111] hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex items-center justify-center ${isOpen ? 'text-primary-600 border-primary-200 dark:border-primary-800' : 'text-gray-600 dark:text-gray-400'}`}
        aria-label="Access Notifications"
      >
        <Bell className="w-4 h-4" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-sm shadow-sm ring-2 ring-white dark:ring-[#0a0a0a]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-xl z-50">
          
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-widest text-xs">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                  {unreadCount} New
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                {unreadCount > 0 && (
                  <>
                    <button 
                      onClick={() => markAllMutation.mutate()}
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Mark all read
                    </button>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  </>
                )}
                <button 
                  onClick={() => {
                    if (window.confirm('Delete all notifications?')) {
                      purgeAllMutation.mutate()
                    }
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#111111] rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-800">
                  <Mail className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-1">No new notifications</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Your list is currently empty.</p>
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors relative cursor-pointer group ${!notif.isRead ? 'bg-primary-50/20 dark:bg-primary-900/10' : 'bg-white dark:bg-[#111111]'}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleNotificationClick(notif);
                    }
                  }}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${notifIconBg(notif.type)}`}>
                    <NotifIcon type={notif.type} />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide truncate">{notif.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-1">{notif.message}</p>
                    <p className="text-[9px] text-gray-400 font-semibold tracking-widest">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    
                    {notif.type === 'OTP' && notif.metadata?.otp && (
                      <div className="mt-2 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-2 rounded flex items-center gap-3">
                         <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Code:</span>
                         <span className="bg-primary-600 text-white px-2 py-0.5 rounded font-mono text-xs tracking-[0.3em] font-bold">{notif.metadata.otp}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(notif._id);
                    }}
                    className="absolute right-4 top-4 p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {!notif.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const notifIconBg = (type) => {
  switch (type) {
    case 'order': return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    case 'promo': return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    case 'subscription': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
    case 'OTP': return 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  }
}

const NotifIcon = ({ type }) => {
  switch (type) {
    case 'order': return <Package className="w-3 h-3" />
    case 'promo': return <Tag className="w-3 h-3" />
    case 'subscription': return <Calendar className="w-3 h-3" />
    case 'OTP': return <ShieldCheck className="w-3 h-3" />
    default: return <Info className="w-3 h-3" />
  }
}

export default NotificationBell
