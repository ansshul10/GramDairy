import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Save, AlertCircle, Phone, Mail, Store, UserPlus, Settings2, Truck, Database, ShieldCheck, Activity, Terminal, RefreshCw, X } from 'lucide-react'
import settingService from '../../services/settingService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN SETTINGS MANAGEMENT
 * A simple interface for managing store settings.
 * ───────────────────────────────────────────────────────────────────────────── */

const FeatureToggle = ({ enabled, onChange, label, description, danger = false }) => (
  <div className="flex items-center justify-between p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 transition-colors group rounded-none">
    <div>
      <p className={`text-[11px] font-bold uppercase tracking-widest ${danger && enabled ? 'text-red-600' : 'text-gray-900 dark:text-white italic'}`}>{label}</p>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 italic">{description}</p>
    </div>
    <button
      type="button"
      className={`${
        enabled ? (danger ? 'bg-red-600' : 'bg-primary-600') : 'bg-gray-200 dark:bg-gray-800'
      } relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer border-none transition-colors duration-200 ease-in-out focus:outline-none rounded-none`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 bg-white shadow-lg transition duration-200 ease-in-out rounded-none`}
      />
    </button>
  </div>
)

const AdminSettings = () => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    enableRegistration: true,
    enableOrdering: true,
    maintenanceMode: false,
    minimumOrderValue: 0,
    deliveryCharge: 0,
    freeDeliveryThreshold: 500,
    supportEmail: '',
    supportPhone: '',
    autoVerifyBilling: false,
    billingDay: 1,
    isStoreOnline: true,
  })

  // Fetch settings
  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingService.getSettings(),
  })

  useEffect(() => {
    if (settingsResponse?.data) {
      setFormData({
        enableRegistration: settingsResponse.data.enableRegistration ?? true,
        enableOrdering: settingsResponse.data.enableOrdering ?? true,
        maintenanceMode: settingsResponse.data.maintenanceMode ?? false,
        minimumOrderValue: settingsResponse.data.minimumOrderValue ?? 0,
        deliveryCharge: settingsResponse.data.deliveryCharge ?? 0,
        freeDeliveryThreshold: settingsResponse.data.freeDeliveryThreshold ?? 500,
        supportEmail: settingsResponse.data.supportEmail ?? '',
        supportPhone: settingsResponse.data.supportPhone ?? '',
        autoVerifyBilling: settingsResponse.data.autoVerifyBilling ?? false,
        billingDay: settingsResponse.data.billingDay ?? 1,
        isStoreOnline: settingsResponse.data.isStoreOnline ?? true,
      })
    }
  }, [settingsResponse])

  // Update Settings Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => settingService.updateSettings(data),
    onSuccess: () => {
      toast.success('Success: Platform settings updated.')
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error: Failed to save settings.')
    }
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleToggle = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-[#0a0a0a]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-4">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a] pb-20">
      
      {/* SETTINGS HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            General Settings
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Store <span className="text-gray-400 font-medium">Settings</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 py-2 px-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 italic rounded-none shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Access: Verified</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SITE CONTROLS */}
        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] overflow-hidden rounded-none shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] flex items-center gap-3">
             <h2 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] italic">Store Controls</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800">
            <FeatureToggle 
              label="Store Online Status"
              description="Manually toggle the store online or offline"
              enabled={formData.isStoreOnline}
              onChange={(v) => handleToggle('isStoreOnline', v)}
            />
            <FeatureToggle 
              label="Allow New Accounts"
              description="Allow new customers to create accounts"
              enabled={formData.enableRegistration}
              onChange={(v) => handleToggle('enableRegistration', v)}
            />
            <FeatureToggle 
              label="Allow Shopping"
              description="Allow customers to buy products"
              enabled={formData.enableOrdering}
              onChange={(v) => handleToggle('enableOrdering', v)}
            />
            <FeatureToggle 
              label="Site Under Maintenance"
              description="Limit access while making site updates"
              enabled={formData.maintenanceMode}
              onChange={(v) => handleToggle('maintenanceMode', v)}
              danger={true}
            />
            <FeatureToggle 
              label="Check Payments Automatically"
              description="Automatically mark bills as paid after submission"
              enabled={formData.autoVerifyBilling}
              onChange={(v) => handleToggle('autoVerifyBilling', v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* FEES & LIMITS */}
            <div className="lg:col-span-12 xl:col-span-7 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden rounded-none shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] flex items-center gap-3">
                    <h2 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] italic">Delivery & Pricing</h2>
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min. Buy Amount (₹)</label>
                            <Input 
                                className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                                type="number"
                                name="minimumOrderValue"
                                value={formData.minimumOrderValue}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Cost (₹)</label>
                            <Input 
                                className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                                type="number"
                                name="deliveryCharge"
                                value={formData.deliveryCharge}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Free Delivery Minimum (₹)</label>
                            <Input 
                                className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                                type="number"
                                name="freeDeliveryThreshold"
                                value={formData.freeDeliveryThreshold}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Billing Date</label>
                            <Input 
                                className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                                type="number"
                                name="billingDay"
                                value={formData.billingDay}
                                onChange={handleChange}
                                min="1"
                                max="28"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 italic text-center rounded-none shadow-inner">
                        <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest leading-relaxed">
                            Changing these values will affect all new orders and checkout calculations.
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTACT INFORMATION */}
            <div className="lg:col-span-12 xl:col-span-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden rounded-none shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <h2 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] italic">Contact Information</h2>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Support Email</label>
                        <Input 
                            className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                            type="email"
                            name="supportEmail"
                            value={formData.supportEmail}
                            onChange={handleChange}
                            placeholder="support@gramdairy.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Support Phone Number</label>
                        <Input 
                            className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                            type="text"
                            name="supportPhone"
                            value={formData.supportPhone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* FINALIZE SETTINGS */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button 
             type="button" 
             onClick={() => queryClient.invalidateQueries({ queryKey: ['settings'] })}
             disabled={updateMutation.isPending}
             className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-[0.2em] transition-colors rounded-none"
          >
            Discard Changes
          </button>
          <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Save your changes to update the store</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Ready to Save</p>
              </div>
              <button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:opacity-90 transition-all flex items-center gap-4 disabled:opacity-50 rounded-none italic"
              >
                {updateMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminSettings
