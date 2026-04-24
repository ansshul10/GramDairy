import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Star, Trash2, User, Package, Calendar, Search, Filter, Database, Terminal, ShieldCheck, Activity, RefreshCw, Loader2 } from 'lucide-react'
import reviewService from '../../services/reviewService'
import { cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * REVIEW MANAGEMENT
 * Manage and moderate product reviews and feedback.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminReviewList = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewService.getAllReviews(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reviews'])
      toast.success('Review deleted successfully.')
    },
    onError: () => {
      toast.error('Error: Failed to delete review.')
    }
  })

  const reviews = data?.data || []

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <MessageSquare className="w-4 h-4" /> Reviews
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Review <span className="text-gray-400 font-medium text-3xl italic">Management</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
            Total Reviews: <span className="text-primary-600 font-black">{reviews.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <Input 
              placeholder="Filter Reviews..." 
              className="pl-12 w-full lg:w-72 !rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
            />
          </div>
          <Button variant="outline" className="!rounded-none h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
            <Filter className="w-4 h-4 mr-2" /> Filter Rating
          </Button>
        </div>
      </div>

      {/* 2. DATA TERMINAL */}
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Review ID</th>
                <th className="px-8 py-5">Reviewer</th>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5">Comment</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10 bg-gray-50/10 dark:bg-gray-800/5" />
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <RefreshCw className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Reviews Found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-bold font-mono text-primary-600 uppercase tracking-tighter">#{review._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black">
                            {review.user?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{review.user?.name}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <Package className="w-3.5 h-3.5 text-gray-400" />
                         <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{review.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-3 h-3", 
                                i < review.rating ? "fill-primary-600 text-primary-600" : "text-gray-200 dark:text-gray-800"
                              )} 
                            />
                          ))}
                       </div>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                       <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 italic leading-relaxed">"{review.comment}"</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => {
                          if (window.confirm('Delete this review?')) {
                            deleteMutation.mutate(review._id)
                          }
                        }}
                        className="p-2 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-600 hover:border-red-600/30 transition-all rounded-none opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default AdminReviewList
