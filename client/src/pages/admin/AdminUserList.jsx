import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, 
  Mail, 
  Shield, 
  Calendar, 
  Search, 
  Filter, 
  Database, 
  Terminal, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  MoreVertical, 
  Ban, 
  UserCheck,
  Send,
  Bell,
  Info,
  X,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import adminService from '../../services/adminService'
import { cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * USER MANAGEMENT
 * Manage platform users and send notifications.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminUserList = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers(),
  })

  const sendNotifMutation = useMutation({
    mutationFn: ({ userId, data }) => adminService.sendUserNotification(userId, data),
    onSuccess: () => {
      toast.success('Notification sent successfully.')
      setIsNotifModalOpen(false)
      reset()
    },
    onError: () => {
      toast.error('Error: Could not send notification.')
    }
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: 'System'
    }
  })

  const onSendNotification = (formData) => {
    sendNotifMutation.mutate({
      userId: selectedUser._id,
      data: formData
    })
  }

  const users = data?.data || []
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <Shield className="w-4 h-4" /> User Controls
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            User <span className="text-gray-400 font-medium text-3xl italic">List</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
            Total Users: <span className="text-primary-600 font-black">{users.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 w-full lg:w-72 !rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
            />
          </div>
          <Button variant="outline" className="!rounded-none h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
            <Filter className="w-4 h-4 mr-2" /> Role Filter
          </Button>
        </div>
      </div>

      {/* 2. DATA TERMINAL */}
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-1 bg-gray-900 dark:bg-white" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">User ID</th>
                <th className="px-8 py-5">User Details</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-8 py-10 bg-gray-50/10 dark:bg-gray-800/5" />
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Users Found In List</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-bold font-mono text-primary-600 uppercase tracking-tighter">#{user._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-[12px] font-black text-gray-900 dark:text-white relative">
                            {user.name?.[0]}
                            {user.isVerified && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-none border border-white dark:border-[#0a0a0a]" />
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <Mail className="w-3 h-3 text-gray-400" />
                               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{user.email}</p>
                            </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{user.phoneNumber || 'N/A'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <Badge variant={user.role === 'admin' ? 'primary' : 'outline'} className="rounded-none text-[8px] uppercase tracking-[0.2em] font-black">
                          {user.role}
                       </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedUser(user)
                              setIsNotifModalOpen(true)
                            }}
                            className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all rounded-none"
                            title="Send Notification"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-emerald-600 transition-all rounded-none">
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-600 transition-all rounded-none">
                            <Ban className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. COMMUNICATION MODAL */}
      <Modal 
        isOpen={isNotifModalOpen} 
        onClose={() => setIsNotifModalOpen(false)}
        title="SEND NOTIFICATION"
      >
        <div className="p-8 space-y-8 bg-white dark:bg-[#0a0a0a]">
          <div className="p-4 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">To User</h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black">{selectedUser?.name?.[0]}</div>
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">{selectedUser?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSendNotification)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Category</label>
              <select 
                {...register('type')}
                className="w-full h-12 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 px-4 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white rounded-none outline-none focus:border-primary-600 transition-colors"
              >
                <option value="System">System Info</option>
                <option value="Promotion">Promotional</option>
                <option value="Order">Logistics Alert</option>
                <option value="Subscription">Recurring Protocol</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Message Title</label>
              <Input 
                {...register('title', { required: 'Please enter a title.' })}
                placeholder="Important Update..."
                className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
              />
              {errors.title && <p className="text-[9px] text-red-500 font-bold uppercase italic tracking-widest mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Message Content</label>
              <textarea 
                {...register('message', { required: 'Please enter a message.' })}
                placeholder="Type your message here..."
                rows={4}
                className="w-full bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-4 text-xs font-medium text-gray-900 dark:text-gray-100 rounded-none outline-none focus:border-primary-600 transition-colors placeholder:text-gray-500"
              />
              {errors.message && <p className="text-[9px] text-red-500 font-bold uppercase italic tracking-widest mt-1">{errors.message.message}</p>}
            </div>

            <div className="pt-4 flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNotifModalOpen(false)}
                className="flex-1 !rounded-none !bg-white dark:!bg-[#0a0a0a] border-gray-200 dark:border-gray-800 uppercase text-[10px] font-black h-12 tracking-widest"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                isLoading={sendNotifMutation.isPending}
                className="flex-[2] !rounded-none shadow-2xl uppercase text-[10px] font-black h-12 tracking-widest"
              >
                Send Now
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default AdminUserList
