import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Search, ExternalLink, Package, Database, ShieldCheck, BarChart3, Settings, Loader2 } from 'lucide-react'
import productService from '../../services/productService'
import adminService from '../../services/adminService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { formatCurrency, cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN PRODUCT MANAGEMENT CONSOLE
 * A simple interface for managing products, stock, and pricing.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminProductList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: () => productService.getProducts({ search: searchTerm, limit: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
    },
  })

  const handleDelete = (id) => {
    if (window.confirm('Warning: Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* 1. COMMAND HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <Database className="w-4 h-4" /> Product Inventory
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Manage <span className="text-gray-400 font-medium">Products</span>
          </h1>
        </div>
        <Link to="/admin/products/add">
          <button className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl rounded-none">
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </Link>
      </div>

      {/* 2. ASSET METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
        <div className="bg-white dark:bg-[#0a0a0a] p-6 flex flex-col gap-4 group">
          <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors rounded-none">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              {productsData?.data?.pagination?.total || 0} <span className="text-[10px] opacity-30 font-black">Items</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-6 flex flex-col gap-4">
            <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 rounded-none">
                <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">System Status</p>
                <p className="text-2xl font-bold text-emerald-500 tracking-tight leading-none italic uppercase">Online</p>
            </div>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-6 flex flex-col gap-4">
            <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 rounded-none">
                <BarChart3 className="w-5 h-5 text-blue-500/50" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Stock Sync</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none uppercase italic">Active</p>
            </div>
        </div>
      </div>

      {/* 3. PRODUCT LIST */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        
        {/* Search Terminal */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white rounded-none shadow-sm"
              placeholder="Search Products..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Settings className="w-3.5 h-3.5 text-gray-200 dark:text-gray-700" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 text-[9px] uppercase tracking-widest font-black text-gray-400">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock Level</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10 bg-gray-50/20 dark:bg-gray-800/10" />
                  </tr>
                ))
              ) : (
                productsData?.data?.products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-1 shrink-0 rounded-none">
                            <img 
                              src={product.images[0]} 
                              className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                            />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{product.name}</p>
                          <p className="text-[9px] text-gray-400 font-mono mt-1 uppercase">ID: {product._id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-gray-900 dark:text-white tracking-widest">{formatCurrency(product.price)}</span>
                      {product.discountPrice > 0 && <p className="text-[8px] text-emerald-500 font-black uppercase mt-1">Discount Applied</p>}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[11px] font-bold tracking-tighter uppercase",
                        product.stock < 10 ? "text-red-500" : "text-gray-900 dark:text-white"
                      )}>
                        {product.stock} Units / {product.unit.split(' ')[1] || 'Units'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {product.stock > 0 ? (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest italic">In Stock</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-500/10 text-red-600 border border-red-500/20 text-[9px] font-black uppercase tracking-widest italic">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                        <Link to={`/products/${product.slug}`} target="_blank">
                          <button className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-none">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link to={`/admin/products/edit/${product._id}`}>
                          <button className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-colors rounded-none">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === product._id}
                          className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-none"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
    </div>
  )
}

export default AdminProductList
