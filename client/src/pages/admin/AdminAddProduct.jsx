import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, Loader2, Info, Database, ShieldCheck, Box, Tag, Image as ImageIcon, X } from 'lucide-react'
import productService from '../../services/productService'
import adminService from '../../services/adminService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADD NEW PRODUCT (Admin Add Product)
 * A clean interface for adding new products to the inventory.
 * ───────────────────────────────────────────────────────────────────────────── */

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive value'),
  discountPrice: z.coerce.number().nonnegative('Value cannot be negative').optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  unit: z.enum(['L', 'ml', 'kg', 'g', 'pc', 'pack']),
  isFeatured: z.boolean().optional(),
  isDailyEssential: z.boolean().optional(),
})

const AdminAddProduct = () => {
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      unit: 'L',
      isFeatured: false,
      isDailyEssential: false,
    }
  })

  const createMutation = useMutation({
    mutationFn: (formData) => adminService.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      navigate('/admin/products')
    },
  })

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setError('Error: Please upload at least one product image.')
      return
    }

    try {
      setError('')
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) formData.append(key, data[key])
      })
      images.forEach(image => formData.append('images', image))

      await createMutation.mutateAsync(formData)
    } catch (err) {
      setError(err.response?.data?.message || 'Error: Failed to create product.')
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a] pb-20">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-10">
        <Link to="/admin/products" className="p-3 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
            Inventory Management
          </h2>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Add New <span className="text-gray-400 font-medium">Product</span>
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: METADATA & PARAMETERS */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Metadata Core Section */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-1 bg-gray-900 dark:bg-white" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Tag className="w-4 h-4 text-primary-600" /> General Information
                </h3>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Name</label>
                    <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('name')} error={errors.name?.message} placeholder="Name..." />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      {...register('description')}
                      rows="5"
                      className="w-full bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-4 py-3 outline-none focus:border-primary-600 text-[11px] font-medium transition-colors dark:text-white placeholder:text-gray-300"
                      placeholder="Describe your product..."
                    />
                    {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                      <select 
                        {...register('category')}
                        className="w-full h-11 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-4 outline-none focus:border-primary-600 font-bold text-[10px] uppercase tracking-widest dark:text-white"
                      >
                        <option value="">Select Category...</option>
                        {categoriesData?.data?.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight mt-1">{errors.category.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit</label>
                      <select 
                        {...register('unit')}
                        className="w-full h-11 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-4 outline-none focus:border-primary-600 font-bold text-[10px] uppercase tracking-widest dark:text-white"
                      >
                        <option value="L">Liters (L)</option>
                        <option value="ml">Milliliters (ml)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="pc">Piece (pc)</option>
                        <option value="pack">Standard Pack</option>
                      </select>
                    </div>
                  </div>
                </div>
            </div>

            {/* Feature Flags Section */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 rounded-none shadow-sm">
                <label className="flex items-center gap-4 cursor-pointer group bg-white dark:bg-[#0a0a0a] p-6 hover:bg-gray-50 transition-colors rounded-none">
                  <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded-none border-2 border-gray-200 accent-primary-600" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Featured Product</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Highlight on home</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group bg-white dark:bg-[#0a0a0a] p-6 hover:bg-gray-50 transition-colors rounded-none">
                  <input type="checkbox" {...register('isDailyEssential')} className="w-5 h-5 rounded-none border-2 border-gray-200 accent-primary-600" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">Daily Essential</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Recurring Item</p>
                  </div>
                </label>
            </div>
          </div>

          {/* RIGHT: FINANCIALS & MEDIA */}
          <div className="lg:col-span-5 space-y-12">
            
            {/* Financial Parameters */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                Pricing & Stock
              </h3>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Regular Price (₹)</label>
                    <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="number" {...register('price')} error={errors.price?.message} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount Price (₹)</label>
                    <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="number" {...register('discountPrice')} error={errors.discountPrice?.message} placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Stock</label>
                  <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="number" {...register('stock')} error={errors.stock?.message} placeholder="Total units" />
                </div>
              </div>
            </div>

            {/* Media Ingestion Portal */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-blue-500" /> Product Images
              </h3>
              <div 
                className="border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] p-10 flex flex-col items-center justify-center gap-4 hover:border-primary-600 transition-colors cursor-pointer relative group rounded-none"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <div className="p-4 border border-primary-600/20 bg-primary-50 dark:bg-primary-900/10 text-primary-600 group-hover:scale-110 transition-transform rounded-none">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1">Upload Product Images</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Drag-drop or click to upload</p>
                </div>
                <input 
                  id="image-upload"
                  type="file" 
                  multiple 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-1 group rounded-none shadow-sm">
                      <img src={URL.createObjectURL(img)} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all rounded-none" />
                      <button 
                        type="button" 
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-0 right-0 p-1 bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-300 rounded-none shadow-inner">
                    <Box className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Alert Area */}
        {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center shadow-inner">
                {error}
            </div>
        )}

        {/* Final Submission Terminal */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <Link to="/admin/products">
            <button type="button" className="px-8 py-3 text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors">
              Cancel
            </button>
          </Link>
          <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Ready to Save</p>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-12 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:opacity-90 transition-all flex items-center gap-4 disabled:opacity-50 rounded-none"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Box className="w-4 h-4" />}
                Save Product
              </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminAddProduct
