import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Minus, Plus, Loader2, CheckCircle2, ShieldCheck, Database, Sliders, Activity, Check } from 'lucide-react'
import subscriptionService from '../../services/subscriptionService'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { formatCurrency } from '../../lib/utils'
import toast from 'react-hot-toast'

const SubscribeModal = ({ isOpen, onClose, product }) => {
  const [quantity, setQuantity] = useState(1)
  const [frequency, setFrequency] = useState('Daily')
  const [deliverySlot, setDeliverySlot] = useState('Morning (6 AM - 8 AM)')
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data) => subscriptionService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscriptions'])
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to start plan. Please try again.')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      product: product._id,
      quantity,
      frequency,
      deliverySlot,
      startDate: new Date(),
    })
  }

  if (!product) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Your Milk Plan"
      className="!rounded-none border-4 border-gray-900 dark:border-gray-800 shadow-2xl"
    >
      {success ? (
        <div className="py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mx-auto rounded-sm ring-8 ring-emerald-500/5">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Plan Started Successfully</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed px-12">
              Your delivery schedule has been successfully set up for {product.name}.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-2 space-y-10">

          {/* PRODUCT DETAILS */}
          <div className="flex items-center gap-6 p-5 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-gray-900 text-white flex items-center justify-center -mr-6 -mt-6 rotate-45">
            </div>
            <div className="w-16 h-16 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-1 shrink-0">
              <img src={product.images[0]} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{product.name}</h4>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Plan Price:</p>
                <p className="text-lg font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter">
                  {formatCurrency(product.discountPrice || product.price)} / {product.unit.split(' ')[1] || 'Litre'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* QUANTITY SELECTION */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                Amount Per Day
              </label>
              <div className="space-y-3">
                <div className="flex items-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center border-r border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold w-12 text-center text-gray-900 dark:text-white leading-none">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center border-l border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Deliver: {quantity} {product.unit} per day</p>
              </div>
            </div>

            {/* FREQUENCY SELECTION */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                How Often?
              </label>
              <div className="relative">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full h-12 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm px-4 outline-none focus:border-primary-600 font-bold text-[11px] uppercase tracking-widest appearance-none dark:text-white"
                >
                  <option value="Daily">Deliver Every Day</option>
                  <option value="Alternative">Deliver Every Other Day</option>
                  <option value="Custom">Custom Schedule</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                </div>
              </div>
            </div>
          </div>

          {/* PREFERRED TIME */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Preferred Time
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
              {['Morning (6 AM - 8 AM)', 'Evening (5 PM - 7 PM)'].map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setDeliverySlot(slot)}
                  className={`p-5 text-left transition-all bg-white dark:bg-[#0a0a0a] group relative ${deliverySlot === slot
                    ? 'z-10 ring-2 ring-primary-600 ring-inset'
                    : ''
                    }`}
                >
                  <p className="font-bold text-sm uppercase tracking-tight text-gray-900 dark:text-white">{slot}</p>
                  <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                    <Check className="w-3 h-3" /> Select This Time
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-10 flex flex-col gap-6">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all hover:bg-gray-800 dark:hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              Start My Plan
            </button>
            <div className="flex items-center gap-3 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                You can modify your delivery schedule anytime in your profile.
              </p>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default SubscribeModal
