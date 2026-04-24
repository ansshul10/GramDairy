import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  MapPin, 
  Phone, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Loader2, 
  Home, 
  Navigation, 
  Database, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Globe2,
  X,
  Zap
} from 'lucide-react'
import addressService from '../../services/addressService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useForm } from 'react-hook-form'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADDRESS BOOK
 * Manage your delivery locations for faster checkout.
 * ───────────────────────────────────────────────────────────────────────────── */

const AddressBook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAddresses(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses'])
    },
  })

  const handleOpenModal = (address = null) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  const addresses = data?.data || []

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700 space-y-12">
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            Saved Addresses
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none">
            My <span className="text-gray-400 font-medium text-3xl">Addresses</span>
          </h1>
        </div>
        <button 
           onClick={() => handleOpenModal()}
           className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* 2. ADDRESS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden shadow-sm">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-[#0a0a0a] animate-pulse" />
          ))
        ) : addresses.length === 0 ? (
          <div className="md:col-span-3 py-32 bg-white dark:bg-[#0a0a0a] text-center space-y-8">
             <div className="w-16 h-16 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-none flex items-center justify-center mx-auto text-gray-300">
               <MapPin className="w-8 h-8" />
             </div>
             <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">No Addresses Found</h3>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">You haven't added any addresses yet.</p>
             </div>
             <button 
                onClick={() => handleOpenModal()}
                className="px-10 py-4 border border-gray-900 dark:border-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-[#111111] transition-all dark:text-white"
             >
                Add Address
             </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div 
                key={addr._id} 
                className={`bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#0d0d0d]/30 relative overflow-hidden ${addr.isDefault ? 'ring-1 ring-inset ring-primary-600' : ''}`}
            >
              <div className="absolute top-0 right-0 p-8 flex items-center gap-3">
                {addr.isDefault && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                        Default Address
                    </div>
                )}
              </div>

              <div className="space-y-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 border border-primary-600/20 bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{addr.title}</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                        ID: {addr._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receiver</p>
                        <p className="text-[11px] text-gray-900 dark:text-white font-bold uppercase tracking-tight">{addr.fullName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Address</p>
                        <p className="text-[11px] text-gray-900 dark:text-white font-medium uppercase leading-relaxed tracking-tight line-clamp-2">
                          {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 pt-8 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Contact Number</p>
                        <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase">+91-{addr.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-px bg-gray-100 dark:bg-gray-800">
                        <button 
                           onClick={() => handleOpenModal(addr)}
                           className="p-3 bg-white dark:bg-[#0a0a0a] text-gray-400 hover:text-primary-600 transition-colors border border-gray-100 dark:border-gray-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => deleteMutation.mutate(addr._id)}
                           disabled={deleteMutation.isPending && deleteMutation.variables === addr._id}
                           className="p-3 bg-white dark:bg-[#0a0a0a] text-gray-400 hover:text-red-500 transition-colors border-y border-r border-gray-100 dark:border-gray-800 disabled:opacity-50"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === addr._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. STATUS INFORMATION */}
      <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Your Saved Addresses</p>
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Verified Address</span>
              </div>
          </div>
      </div>

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        address={editingAddress} 
      />
    </div>
  )
}

const AddressModal = ({ isOpen, onClose, address }) => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    values: address ? {
      title: address.title,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || 'India',
      isDefault: address.isDefault
    } : { title: '', fullName: '', phoneNumber: '', street: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false }
  })

  const mutation = useMutation({
    mutationFn: (data) => editing ? addressService.updateAddress(address._id, data) : addressService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses'])
      onClose()
      reset()
    },
  })

  const editing = !!address

  return (
    <Modal 
       isOpen={isOpen} 
       onClose={onClose} 
       title={editing ? 'Update Address' : 'New Address'}
       className="!rounded-none border border-gray-200 dark:border-gray-700 shadow-2xl"
    >
      <form onSubmit={handleSubmit(mutation.mutate)} className="p-2 space-y-10">
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Label (e.g. Home)</label>
                    <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" placeholder="Home, Work, etc." {...register('title', { required: true })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" placeholder="+91-" {...register('phoneNumber', { required: true })} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receiver Full Name</label>
                <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" placeholder="Person receiving the delivery" {...register('fullName', { required: true })} />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complete Street Address</label>
                <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" placeholder="Street, block, apartment..." {...register('street', { required: true })} />
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">City</label>
                    <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" {...register('city', { required: true })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">State</label>
                    <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" {...register('state', { required: true })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pincode</label>
                    <Input className="!rounded-none !bg-gray-50/30 dark:!bg-[#0c0c0c] !border-gray-100 dark:!border-gray-800 focus:!border-primary-600" {...register('postalCode', { required: true })} />
                </div>
            </div>
            
            <label className="flex items-center gap-4 cursor-pointer p-5 bg-gray-50/30 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-none group transition-colors hover:bg-white dark:hover:bg-[#0d0d0d]">
              <input type="checkbox" {...register('isDefault')} className="w-5 h-5 rounded-none accent-primary-600 cursor-pointer" />
              <div>
                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Primary Address</span>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Use this as your main delivery location</p>
              </div>
            </label>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-gray-800">
          <button 
             type="button" 
             onClick={onClose}
             className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button 
             type="submit" 
             disabled={mutation.isPending}
             className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl hover:opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 rounded-none"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {editing ? 'Save Update' : 'Add Delivery Address'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddressBook

