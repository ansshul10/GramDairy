import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Building2, User, Mail, Phone, MapPin, Box, Send, CheckCircle2, Loader2, ShieldCheck, ArrowRight } from 'lucide-react'
import publicService from '../../services/publicService'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * VENDOR APPLY PAGE
 * A professional onboarding terminal for potential farm owners and suppliers.
 * ───────────────────────────────────────────────────────────────────────────── */

const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required = true }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
      <Icon className="w-3.5 h-3.5" /> {label} {required && <span className="text-primary-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-14 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 px-5 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary-600 transition-colors"
      required={required}
    />
  </div>
);

const VendorApplyPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    farmName: '',
    email: '',
    phone: '',
    category: 'Dairy Farm',
    address: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => publicService.submitVendorApplication(data),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Application submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit application.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-10">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-none flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter italic">Application Submitted!</h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose">
            Your farm profile is now under verification by our Board of Logistics. You will receive an email with your credentials once approved.
          </p>
          <div className="pt-10">
            <a href="/" className="inline-flex items-center gap-3 px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 hover:text-white transition-all">
              Return to Site Hub <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        
        {/* LEFT: INFORMATION & TRUST */}
        <div className="lg:w-1/2 space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary-600/5 border border-primary-600/10">
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em]">Official Onboarding</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter italic leading-[1.1]">
            Partner with the <span className="text-gray-400 font-medium">dairy leaders.</span>
          </h2>
          
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose max-w-lg">
            Join 500+ verified farms across the region. We provide the logistics, you provide the purity.
          </p>

          <div className="space-y-8 pt-10">
             <div className="flex gap-6 items-start">
               <div className="w-10 h-10 shrink-0 bg-gray-100 dark:bg-[#111111] flex items-center justify-center font-black text-xs">01</div>
               <div>
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2 italic">Express Verification</h4>
                 <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">Our team prioritizes farm applications for rapid network expansion.</p>
               </div>
             </div>
             <div className="flex gap-6 items-start">
               <div className="w-10 h-10 shrink-0 bg-gray-100 dark:bg-[#111111] flex items-center justify-center font-black text-xs">02</div>
               <div>
                 <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2 italic">Automated Earnings</h4>
                 <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">Transparent, real-time tracking of every liter supplied.</p>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT: THE FORM */}
        <div className="lg:w-1/2 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 p-10 lg:p-16 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
           
           <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <InputField 
                    label="Full Name" 
                    icon={User} 
                    placeholder="E.g. Rajesh Kumar" 
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
                 />
                 <InputField 
                    label="Farm / Shop Name" 
                    icon={Building2} 
                    placeholder="E.g. Green Valley Farms" 
                    value={formData.farmName}
                    onChange={(e) => setFormData(prev => ({...prev, farmName: e.target.value}))}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <InputField 
                    label="Verification Email" 
                    icon={Mail} 
                    type="email"
                    placeholder="contact@farm.com" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                 />
                 <InputField 
                    label="Primary Contact" 
                    icon={Phone} 
                    placeholder="+91 00000 00000" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                 />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" /> Business Category <span className="text-primary-600">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-14 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 px-5 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-primary-600 transition-colors appearance-none"
                >
                  <option value="Dairy Farm">Dairy Farm (Cattle Owner)</option>
                  <option value="Organic Supplier">Organic Product Supplier</option>
                  <option value="Milk Producer">Independent Milk Producer</option>
                  <option value="Packaging Partner">Processing & Packaging</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Full Business Address <span className="text-primary-600">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete physical address of your farm or business unit"
                  className="w-full h-32 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-5 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary-600 transition-colors resize-none"
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {mutation.isPending ? 'Processing...' : 'Submit Application'}
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  )
}

export default VendorApplyPage
