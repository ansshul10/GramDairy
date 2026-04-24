import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Search, Layers, Database, ShieldCheck, Activity, Terminal, X, Upload, Loader2 } from 'lucide-react'
import productService from '../../services/productService'
import adminService from '../../services/adminService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'

/* ─────────────────────────────────────────────────────────────────────────────
 * CATEGORY MANAGEMENT (Admin Category List)
 * A simple interface for managing the product categories.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminCategoryList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => productService.getCategories(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
    },
  })

  const handleDelete = (id) => {
    if (window.confirm('Delete this category? Products in this category may be affected.')) {
      deleteMutation.mutate(id)
    }
  }

  const handleOpenModal = (category = null) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* CATEGORY HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            Product Categories
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Manage <span className="text-gray-400 font-medium">Categories</span>
          </h1>
        </div>
        <button 
           onClick={() => handleOpenModal()}
           className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl rounded-none"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* 2. SECTOR LEDGER TERMINAL */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white rounded-none shadow-sm"
              placeholder="Search category name..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 text-[9px] uppercase tracking-widest font-black text-gray-400">
                <th className="px-8 py-5">Category Name</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-10 bg-gray-50/20 dark:bg-gray-800/10" />
                  </tr>
                ))
              ) : (
                categoriesData?.data?.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-1 shrink-0 rounded-none shadow-sm">
                            <img 
                              src={category.image} 
                              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all rounded-none"
                            />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{category.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono mt-1 uppercase">Link: /{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest line-clamp-1 max-w-[300px] leading-relaxed italic">{category.description}</p>
                    </td>
                    <td className="px-8 py-6">
                      {category.isActive ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest italic rounded-none">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-600 border border-gray-500/20 text-[9px] font-black uppercase tracking-widest italic rounded-none">Disabled</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                        <button 
                             onClick={() => handleOpenModal(category)}
                             className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-colors rounded-none shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === category._id}
                          className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-none shadow-sm"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === category._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={editingCategory} 
      />
    </div>
  )
}

const CategoryModal = ({ isOpen, onClose, category }) => {
  const queryClient = useQueryClient()
  const [image, setImage] = useState(null)
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    values: category || { name: '', description: '', isActive: true }
  })

  const mutation = useMutation({
    mutationFn: (formData) => editing ? adminService.updateCategory(category._id, formData) : adminService.createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      onClose()
      reset()
      setImage(null)
    },
  })

  const editing = !!category

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('isActive', data.isActive)
    if (image) formData.append('image', image)

    await mutation.mutateAsync(formData)
  }

  return (
    <Modal 
       isOpen={isOpen} 
       onClose={onClose} 
       title={editing ? 'Edit Category' : 'Add New Category'}
       className="!rounded-none border-4 border-gray-900 dark:border-white shadow-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Name</label>
                <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('name', { required: 'Name required' })} error={errors.name?.message} placeholder="Name..." />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                    {...register('description', { required: 'Parameters required' })}
                    rows="4"
                    className="w-full bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-4 py-3 outline-none focus:border-primary-600 text-[11px] font-medium transition-colors dark:text-white placeholder:text-gray-300"
                    placeholder="Describe this category..."
                />
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Category Image
                </label>
                <div 
                    className="border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] p-10 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary-600 transition-colors"
                    onClick={() => document.getElementById('sector-image').click()}
                >
                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{image ? 'Image Loaded: ' + image.name : 'Upload Category Image'}</p>
                    <input 
                        id="sector-image"
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="hidden"
                    />
                </div>
            </div>

            <label className="flex items-center gap-3 p-4 bg-gray-50/30 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 cursor-pointer">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded-none accent-primary-600" />
                <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Set as Active</span>
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
             disabled={isSubmitting}
             className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 rounded-none"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {editing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AdminCategoryList
