import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, Mail, Phone, Lock, Save, Loader2, Camera, ShieldCheck, 
  Fingerprint, Activity, Zap, Share2, Receipt, History, AlertCircle,
  Bell, Trash2, CheckCircle2, Circle, Smartphone, Monitor, Clock,
  ExternalLink, Download, MessageSquare, ChevronRight, AlertTriangle
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import authService from '../../services/authService'
import billingService from '../../services/billingService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

// Modular Components
import PasswordMeter from '../../components/profile/PasswordMeter'
import ActiveSessions from '../../components/profile/ActiveSessions'
import ProfileProgress from '../../components/profile/ProfileProgress'
import ReferralPanel from '../../components/profile/ReferralPanel'
import ImageCropper from '../../components/profile/ImageCropper'
/* ─────────────────────────────────────────────────────────────────────────────
 * PROFILE SCHEMAS (ZOD)
 * ───────────────────────────────────────────────────────────────────────────── */

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phoneNumber: z.string().length(10, 'Please enter a valid 10-digit mobile number.'),
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const { user, setUser, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [cropImage, setCropImage] = useState(null)
  const fileInputRef = useRef(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber || '',
    }
  })

  const newPassword = watch('newPassword')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, invoiceRes] = await Promise.all([
          authService.getProfileStats(),
          billingService.getInvoiceHistory()
        ])
        setStats(statsRes.data)
        setInvoices(invoiceRes.data)
      } catch (err) {
        console.error('Failed to load profile data')
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    try {
      const response = await authService.updateProfile({
        ...data,
        password: data.newPassword // backend expects 'password' or 'newPassword', update logic handle both
      })
      setUser(response.data.user)
      toast.success('Profile updated successfully!')
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
      reset({ ...data, currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setCropImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = async (blob) => {
    const formData = new FormData()
    formData.append('avatar', blob, 'avatar.jpg')
    
    try {
      const response = await authService.updateProfile(formData)
      setUser(response.data.user)
      setAvatarPreview(URL.createObjectURL(blob))
      setCropImage(null)
      toast.success('Avatar updated!')
    } catch (err) {
      toast.error('Failed to upload image')
    }
  }

  const handleDeleteAccount = async () => {
    const confirm = window.prompt('To delete your account, please type DELETE below:')
    if (confirm === 'DELETE') {
      try {
        await authService.deleteAccount('DELETE')
        logout()
        toast.success('Account deleted. Logging out...')
        window.location.href = '/'
      } catch (err) {
        toast.error('Deletion failed')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 animate-in fade-in duration-700 min-h-screen">
      
      {cropImage && (
        <ImageCropper 
          image={cropImage} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setCropImage(null)} 
        />
      )}

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-primary-600 text-black flex items-center justify-center font-black text-4xl italic shadow-2xl relative overflow-hidden">
               {avatarPreview || user?.avatar ? (
                 <img src={avatarPreview || user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
               ) : (
                 user?.name?.[0] || 'U'
               )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-xl hover:bg-gray-100 transition-all"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
              <ShieldCheck className="w-4 h-4" /> Premium {user?.role}
            </h2>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-3">
              {user?.name?.split(' ')[0]} <span className="text-gray-400 font-medium">{user?.name?.split(' ').slice(1).join(' ')}</span>
            </h1>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
               <span>Member since {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '...'}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-emerald-500">Live Session Active</span>
            </div>
          </div>
        </div>

        <div className="lg:w-72">
          <ProfileProgress percentage={stats?.completeness || 0} user={user} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── LEFT NAV & TOP CONTENT ─────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* TABS */}
          <div className="flex flex-wrap gap-2 p-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-none">
            {[
              { id: 'overview', label: 'Basic Info', icon: User },
              { id: 'security', label: 'Security & Sessions', icon: Lock },
              { id: 'billing', label: 'Billing & History', icon: Receipt },
              { id: 'settings', label: 'Preferences', icon: Bell },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                  activeTab === tab.id 
                  ? 'bg-white dark:bg-[#0a0a0a] text-primary-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
             {activeTab === 'overview' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Full Name</label>
                        <Input className="rounded-none bg-white dark:bg-[#0a0a0a]" {...register('name')} error={errors.name?.message} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Phone Number</label>
                        <Input className="rounded-none bg-white dark:bg-[#0a0a0a]" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">Email Address</label>
                        <Input className="rounded-none bg-white dark:bg-[#0a0a0a]" {...register('email')} error={errors.email?.message} />
                      </div>
                   </div>
                   <div className="pt-6">
                      <Button type="submit" disabled={isSubmitting} className="h-14 px-10 rounded-none">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </Button>
                   </div>
                </form>
             )}

             {activeTab === 'security' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="p-8 lg:p-12 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]">
                     <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                        <Lock className="w-4 h-4 text-primary-600" /> Update Authentication
                     </h3>
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                          <Input type="password" placeholder="Verify old password" {...register('currentPassword')} error={errors.currentPassword?.message} className="rounded-none"/>
                        </div>
                        <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-white/5">
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                             <Input type="password" placeholder="Min 6 characters" {...register('newPassword')} error={errors.newPassword?.message} className="rounded-none"/>
                             {newPassword && <PasswordMeter password={newPassword} />}
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                             <Input type="password" placeholder="Repeat new password" {...register('confirmPassword')} error={errors.confirmPassword?.message} className="rounded-none"/>
                           </div>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-none">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                        </Button>
                     </form>
                   </div>

                   <ActiveSessions />

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Login History (Last 10)</h4>
                      <div className="overflow-x-auto border border-gray-100 dark:border-gray-800">
                         <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                               <tr>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Device</th>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">IP Address</th>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Timestamp</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-[10px] uppercase font-bold tracking-widest">
                               {user?.loginHistory?.length > 0 ? user.loginHistory.map((log, i) => (
                                 <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                       <span className="text-gray-900 dark:text-white">{log.device}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{log.ip}</td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                 </tr>
                               )) : (
                                  <tr><td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No login history available</td></tr>
                               )}
                            </tbody>
                         </table>
                      </div>
                   </div>

                   <div className="p-10 border border-red-100 dark:border-red-900/30 bg-red-50/10 rounded-none flex flex-col md:flex-row items-center justify-between gap-8">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-2">Danger Zone</h4>
                        <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-white italic">Permanently Remove Account</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-sm">This will deactivate your subscriptions and clear all historical data. Invoices will remain archived.</p>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="h-12 px-8 border-2 border-red-500 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all"
                      >
                        Delete Account
                      </button>
                   </div>
                </div>
             )}

             {activeTab === 'billing' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Unpaid Bill</p>
                         <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 italic">₹{stats?.currentBillAmount || 0}</h3>
                         <Button variant="outline" className="text-[9px] h-10 w-full rounded-none">Pay Now</Button>
                      </div>
                      <div className="p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]">
                         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Milk Subscription</p>
                         <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 italic">{stats?.subscriptionStatus || 'Inactive'}</h3>
                         <Badge variant={stats?.subscriptionStatus === 'Active' ? 'success' : 'secondary'} className="w-full justify-center">
                            {stats?.subscriptionStatus === 'Active' ? 'DELIVERING DAILY' : 'PLAN STOPPED'}
                         </Badge>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Invoice Download History</h4>
                      <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-none">
                         <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                               <tr>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Month</th>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                               {invoices.length > 0 ? invoices.map(invoice => (
                                 <tr key={invoice._id} className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-colors">
                                    <td className="px-6 py-5">
                                       <p className="text-sm font-bold">{new Date(invoice.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                       <p className="text-sm font-black italic">₹{invoice.totalAmount}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                       <Badge variant={invoice.status === 'Paid' ? 'success' : 'warning'}>{invoice.status}</Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                       <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10">
                                          <Download className="w-4 h-4" />
                                       </button>
                                    </td>
                                 </tr>
                               )) : (
                                 <tr>
                                   <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50 italic">
                                      No historical invoices found.
                                   </td>
                                 </tr>
                               )}
                            </tbody>
                         </table>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="p-8 lg:p-12 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c]">
                     <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
                        <Bell className="w-4 h-4 text-primary-600" /> Notifications & Communications
                     </h3>
                     <div className="space-y-8">
                        {[
                          { id: 'orderUpdates', label: 'Order Status Updates', desc: 'Get SMS & push alerts when your order is out for delivery.' },
                          { id: 'deliveryAlerts', label: 'Morning Delivery Alerts', desc: 'Be notified the moment milk reaches your doorstep.' },
                          { id: 'promotions', label: 'Village News & Offers', desc: 'Receive monthly newsletters and traditional recipe guides.' }
                        ].map(pref => (
                          <div key={pref.id} className="flex items-start justify-between gap-6 pb-8 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                             <div>
                                <p className="text-sm font-black tracking-tight mb-1">{pref.label}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pref.desc}</p>
                             </div>
                             <div className="relative inline-flex items-center cursor-pointer group">
                                <input type="checkbox" className="sr-only peer" defaultChecked={user?.notificationPreferences?.[pref.id]} />
                                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 rounded-none"></div>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>

                </div>
             )}
          </div>
        </div>

        {/* ── RIGHT PANEL WIDGETS ────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-12">
          
          <div className="space-y-8">
             <div className="p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">Total Lifetime Orders</p>
                  <p className="text-3xl font-black italic tracking-tighter uppercase">{stats?.totalOrders || 0}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary-600 italic font-black text-xl">
                    #
                </div>
             </div>
             
             <ReferralPanel referralCode={stats?.referralCode || 'GD-XXXXXX'} walletBalance={stats?.walletBalance || 0} />

             <div className="p-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Quick Assistance</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Issue Subject</label>
                    <select className="w-full h-11 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 text-xs font-bold uppercase tracking-widest px-4 focus:outline-none focus:border-primary-600 rounded-none">
                       <option>Late Delivery</option>
                       <option>Wrong Quantity</option>
                       <option>Quality Issue</option>
                       <option>Payment Problem</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      className="w-full h-24 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 text-xs font-bold px-4 py-3 focus:outline-none focus:border-primary-600 rounded-none resize-none"
                      placeholder="Briefly describe what happened..."
                    />
                  </div>
                  <button className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[9px] uppercase tracking-[0.4em] hover:opacity-90 transition-all rounded-none">
                    Submit Report
                  </button>
                </div>
             </div>

             <div className="p-8 border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5 space-y-4 rounded-none italic">
                <div className="flex items-center gap-3 text-emerald-500">
                   <ShieldCheck className="w-5 h-5" />
                   <p className="text-[10px] font-black uppercase tracking-widest">GramDairy Trust</p>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                   Your account details are protected by 256-bit AES encryption.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
