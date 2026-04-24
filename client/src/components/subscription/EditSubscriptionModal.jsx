import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, Minus, Plus, Loader2, CheckCircle2, ShieldCheck, Database, Sliders, Activity, Save } from 'lucide-react'
import subscriptionService from '../../services/subscriptionService'
import Modal from '../ui/Modal'
import { formatCurrency } from '../../lib/utils'


const EditSubscriptionModal = ({ isOpen, onClose, subscription }) => {
  const [quantity, setQuantity] = useState(1)
  const [frequency, setFrequency] = useState('Daily')
  const [deliverySlot, setDeliverySlot] = useState('Morning (6 AM - 8 AM)')
  const [success, setSuccess] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (subscription) {
      setQuantity(subscription.quantity || 1)
      setFrequency(subscription.frequency || 'Daily')
      setDeliverySlot(subscription.deliverySlot || 'Morning (6 AM - 8 AM)')
    }
  }, [subscription])

  const mutation = useMutation({
    mutationFn: (data) => subscriptionService.updateSubscription(subscription._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscriptions'])
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1500)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({
      quantity,
      frequency,
      deliverySlot,
    })
  }

  if (!subscription || !subscription.product) return null

  const product = subscription.product

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Delivery Schedule"
      className="!rounded-none border-4 border-gray-900 dark:border-gray-800 shadow-2xl"
    >
      {success ? (
        <div className="py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center mx-auto rounded-sm ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Changes Saved</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed px-12">
              Your milk plan for {product.name} has been updated successfully.
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
              <img src={product.images?.[0]} className="w-full h-full object-contain grayscale" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{product.name}</h4>
              <p className="text-[10px] text-primary-600 dark:text-primary-400 font-black uppercase tracking-widest mt-1">Status: {subscription.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* QUANTITY CHOICE */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                Amount Per Day
              </label>
              <div className="space-y-3">
                <div className="flex items-center border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] rounded-sm overflow-hidden text-black dark:text-white">
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

            {/* FREQUENCY CHOICE */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                How Often?
              </label>
              <div className="relative">
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full h-12 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm px-4 outline-none focus:border-primary-600 font-bold text-[11px] uppercase tracking-widest appearance-none text-black dark:text-white"
                >
                  <option value="Daily">Deliver Every Day</option>
                  <option value="Alternative">Deliver Every Other Day</option>
                  <option value="Custom">Custom Schedule</option>
                </select>
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
                  <p className="font-bold text-xs uppercase tracking-tight text-gray-900 dark:text-white">{slot}</p>
                  <p className="text-[9px] text-primary-600 font-black uppercase tracking-[0.2em] mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">Select</p>
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
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default EditSubscriptionModal;
