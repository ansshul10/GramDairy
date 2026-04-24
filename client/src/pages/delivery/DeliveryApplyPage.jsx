import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  UserPlus, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Database,
  Activity,
  Zap,
  Upload,
  X
} from 'lucide-react'
import deliveryService from '../../services/deliveryService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

/* ─────────────────────────────────────────────────────────────────────────────
 * DELIVERY PARTNER APPLICATION PAGE
 * A simple interface for new delivery partners to apply and join the platform.
 * ───────────────────────────────────────────────────────────────────────────── */

const DeliveryApplyPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    licenseNumber: '',
  })
  const [idCard, setIdCard] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const applyMutation = useMutation({
    mutationFn: (data) => deliveryService.applyForDelivery(data),
    onSuccess: () => {
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIdCard(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.keys(formData).forEach(key => data.append(key, formData[key]))
    if (idCard) data.append('idCardImage', idCard)
    
    applyMutation.mutate(data)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] p-8">
        <div className="max-w-2xl w-full border border-gray-900 dark:border-white p-16 text-center shadow-2xl animate-in zoom-in-95 duration-500 relative">
          <div className="absolute top-0 right-0 w-24 h-1 bg-emerald-500" />
          <div className="w-20 h-20 border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-10">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter mb-4 italic">Application Submitted</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">SUCCESS</p>
          <div className="p-8 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 mb-10 flex flex-col items-center">
              <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase leading-relaxed tracking-tight max-w-md">
                Your application has been received for <span className="text-primary-600 font-black">({formData.email})</span>. Our team will review your details. You will be notified once your account is active.
              </p>
          </div>
          <button 
            className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gray-800 transition-all shadow-xl"
            onClick={() => navigate('/')}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-24 px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
          <div>
            <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic">
               <Zap className="w-4 h-4" /> Delivery Partner Application
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
                Join Our <span className="text-gray-400 font-medium">Delivery Team</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-[#111111] px-6 py-3 border border-gray-100 dark:border-gray-800">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status: Accepting Applications</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: PERSONNEL METADATA */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            <div className="p-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-primary-600" /> Application Form
                </h3>
                
                <div className="space-y-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <Input 
                      className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                      name="fullName"
                      placeholder="Enter your full name..."
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <Input 
                          className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                          name="email"
                          type="email"
                          placeholder="yourname@email.com"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <Input 
                          className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                          name="phone"
                          placeholder="+91 9999999999"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Home Address</label>
                    <textarea 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none p-4 text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 outline-none transition-all min-h-[140px] dark:text-white"
                      placeholder="Enter your full address..."
                    />
                  </div>
                </div>
            </div>
          </div>

          {/* RIGHT: LOGISTICS & ASSETS */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-12">
            
            {/* Logistics Parameters */}
            <div className="p-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-1 bg-gray-900 dark:bg-white" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Truck className="w-4 h-4 text-emerald-500" /> Vehicle Details
                </h3>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Type</label>
                    <select 
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full h-12 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-4 outline-none focus:border-primary-600 font-bold text-[10px] uppercase tracking-widest dark:text-white"
                    >
                      <option value="Bike">Bike</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Cycle">Cycle</option>
                      <option value="Car">Van / Car</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Number</label>
                      <Input 
                        className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800 font-mono"
                        name="vehicleNumber"
                        placeholder="e.g., UP 32 AB 1234"
                        required
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                      />
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driving License Number</label>
                      <Input 
                        className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800 font-mono"
                        name="licenseNumber"
                        placeholder="DL-XXXXXXXXXXXXX"
                        required
                        value={formData.licenseNumber}
                        onChange={handleChange}
                      />
                  </div>
                </div>
            </div>

            {/* Asset Ingestion */}
            <div className="p-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Database className="w-4 h-4 text-blue-500" /> Upload ID Card
                </h3>

                <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="id-upload"
                      required
                    />
                    <label 
                      htmlFor="id-upload"
                      className={`flex flex-col items-center justify-center w-full min-h-[220px] border border-dashed ${preview ? 'border-primary-600' : 'border-gray-200 dark:border-gray-800'} bg-gray-50/50 dark:bg-[#0c0c0c] cursor-pointer hover:border-primary-600 transition-all overflow-hidden relative group`}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="ID intake asset" className="absolute inset-0 w-full h-full object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 p-2" />
                          <div className="z-10 text-center p-8 bg-white/80 dark:bg-[#0a0a0a]/80 border-y border-gray-100 dark:border-gray-800 w-full">
                            <ShieldCheck className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                            <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest leading-none">ID Card Uploaded</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 italic shadow-sm">Click to change image</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-10 flex flex-col items-center group-hover:scale-110 transition-transform duration-500">
                           <div className="w-16 h-16 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-gray-400 mb-6 shadow-sm">
                                <Upload className="w-6 h-6" />
                           </div>
                           <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest leading-none mb-2 italic">Aadhar / Driving License</p>
                           <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em]">Upload or drop your ID card image</p>
                        </div>
                      )}
                    </label>
                </div>
            </div>
          </div>

          {/* Final Protocol Commit */}
          <div className="lg:col-span-12 mt-4">
            {applyMutation.isError && (
              <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center shadow-inner italic">
                <AlertCircle className="w-4 h-4 inline-block mr-3" /> [Error]: {applyMutation.error?.response?.data?.message || 'Failed to submit application. Please try again.'}
              </div>
            )}
            
            <div className="bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    <div className="max-w-md">
                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight mb-1">Terms & Conditions</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                            By submitting, you agree to our terms and conditions. Our team will review your application and documents.
                        </p>
                    </div>
                </div>
                <button 
                  type="submit"
                  disabled={applyMutation.isPending}
                  className="w-full md:w-auto px-16 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all flex items-center justify-center gap-6 disabled:opacity-50"
                >
                  {applyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Submit Application
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeliveryApplyPage
