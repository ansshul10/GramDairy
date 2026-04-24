import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Star, 
  CheckCircle2, 
  Award, 
  ShieldAlert,
  Loader2,
  Phone,
  Calendar,
  UserCheck
} from 'lucide-react'
import deliveryService from '../../services/deliveryService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { cn } from '../../lib/utils'

const DeliveryBoyVerify = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [rated, setRated] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['delivery-verify', id],
    queryFn: () => deliveryService.getPublicProfile(id),
    retry: false
  })

  const rateMutation = useMutation({
    mutationFn: (rating) => deliveryService.rateDeliveryBoy(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries(['delivery-verify', id])
      setRated(true)
      localStorage.setItem(`rated_${id}`, 'true')
    }
  })

  // Check if already rated locally
  useEffect(() => {
    if (localStorage.getItem(`rated_${id}`)) {
      setRated(true)
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 mb-6">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Verification Failed</h1>
        <p className="mt-4 text-gray-500 font-bold max-w-sm">
          We couldn't verify this delivery partner. Please check the URL or contact GramDairy support if you suspect fraud.
        </p>
        <Button className="mt-8 rounded-2xl px-8" onClick={() => window.location.href = '/'}>Go to Home</Button>
      </div>
    )
  }

  const boy = data.data
  const isActive = boy.status === 'active'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Authoritative Header & Seal */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-2xl border-4 border-primary-100 dark:border-primary-900/30 relative mb-2">
            <ShieldCheck className="w-12 h-12 text-primary-600" />
            
            {/* Brand Seal SVG Stylized */}
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-950 p-2 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-pulse">
               <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Verified Partner</h1>
            <p className="text-xs font-black text-primary-600 tracking-[0.3em] uppercase opacity-70">Official GramDairy Partner</p>
          </div>
        </div>

        {/* Digital ID Card */}
        <div className={cn(
          "relative overflow-hidden rounded-[3rem] shadow-2xl transition-all duration-700",
          isActive ? "ring-2 ring-primary-500/20" : "grayscale opacity-80"
        )}>
          {/* ID Card Background Gradient */}
          <div className="bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0c4a6e] p-10 text-white">
            
            {/* Card Header */}
            <div className="flex justify-between items-start mb-12">
               <div>
                 <h2 className="text-2xl font-black tracking-widest">GRAMDAIRY</h2>
                 <p className="text-[10px] font-black tracking-[0.2em] opacity-60">FRESH MILK FROM FARM TO HOME</p>
               </div>
               <Badge variant={isActive ? 'success' : 'danger'} size="lg" className="rounded-xl px-4 py-1.5 font-black uppercase text-[10px] shadow-lg">
                 {isActive ? 'Active Status' : 'Inactive'}
               </Badge>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              <div className="relative group">
                <div className="w-32 h-32 bg-white rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl flex items-center justify-center p-1">
                   {boy.user?.avatar ? (
                     <img src={boy.user.avatar} className="w-full h-full object-cover rounded-2xl" alt="Profile" />
                   ) : (
                     <span className="text-4xl font-black text-primary-600">{boy.user?.name?.[0]}</span>
                   )}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0369a1] flex items-center justify-center shadow-lg">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-3xl font-black uppercase leading-none tracking-tight">{boy.user?.name}</h3>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-black/20 rounded-full text-xs font-black tracking-widest">
                    Partner ID: {boy.employeeId}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">Vehicle</p>
                    <p className="text-sm font-bold flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> {boy.vehicleType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-wider">Contact</p>
                    <p className="text-sm font-bold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> XXX-XXX-{boy.phone?.slice(-4)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="text-center bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Rating</p>
                    <p className="text-xl font-black flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {boy.ratings || '0.0'}</p>
                 </div>
                 <div className="text-center bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Joined</p>
                    <p className="text-sm font-black flex items-center gap-1.5 uppercase tracking-tighter">
                      {new Date(boy.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                 </div>
               </div>
               
               <div className="bg-white/20 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Verified By</p>
                  <p className="text-lg font-black italic tracking-tighter">GramDairy Team</p>
               </div>
            </div>
          </div>
        </div>

        {/* Legal Badge */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-5">
           <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
             <ShieldCheck className="w-8 h-8" />
           </div>
           <div className="flex-1">
             <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Verified Delivery Partner</p>
             <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
               This agent is background-verified and authorised to represent GramDairy for deliveries and payment collections.
             </p>
           </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden text-center space-y-6">
           <div>
             <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">Rate Experience</h3>
             <p className="text-sm font-bold text-gray-500">Your feedback ensures our community stays safe and fresh.</p>
           </div>

           {rated ? (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 px-6 py-3 rounded-2xl font-black text-sm border border-green-100">
                   <CheckCircle2 className="w-5 h-5" /> Thank you for your feedback!
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center gap-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 transition-all hover:scale-125 active:scale-95"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                    >
                      <Star 
                        className={cn(
                          "w-10 h-10 transition-colors",
                          (hoverRating || userRating) >= star 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-200 dark:text-gray-800"
                        )} 
                      />
                    </button>
                  ))}
                </div>

                <Button 
                  className="w-full rounded-[1.5rem] py-4"
                  disabled={!userRating || rateMutation.isPending}
                  isLoading={rateMutation.isPending}
                  onClick={() => rateMutation.mutate(userRating)}
                >
                  Submit Rating
                </Button>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="text-center opacity-30 select-none">
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-900 dark:text-white">Verified by GramDairy Security</p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryBoyVerify
