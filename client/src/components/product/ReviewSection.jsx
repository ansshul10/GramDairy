import { useState } from 'react'
import { Star, MessageSquare, Trash2, Loader2, Send } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore'
import reviewService from '../../services/reviewService'
import Button from '../ui/Button'
import { formatCurrency } from '../../lib/utils'

const ReviewSection = ({ productId }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.getProductReviews(productId),
  })

  const createMutation = useMutation({
    mutationFn: (data) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', productId])
      queryClient.invalidateQueries(['product']) // Update avg rating
      setComment('')
      setRating(5)
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to add review')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', productId])
      queryClient.invalidateQueries(['product'])
    },
  })

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({ product: productId, rating, comment })
  }

  const reviews = data?.data || []

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Customer Reviews</h2>
          <p className="text-sm text-gray-500 font-medium">Verified feedback from our community</p>
        </div>
        {!isAuthenticated && (
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login to write a review</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          {isAuthenticated ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Write a Review</h3>
                <p className="text-xs text-gray-400">Your experience helps others choose better.</p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 transition-transform active:scale-90"
                      >
                        <Star className={`w-6 h-6 ${rating >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Comment</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    placeholder="Tell us what you liked..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-800 rounded-2xl p-4 outline-none focus:border-primary-500 text-sm transition-all"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full h-12"
                  isLoading={createMutation.isPending}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Post Review
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center animate-pulse">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400">Please login to write a review</p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <MessageSquare className="w-12 h-12 text-gray-100 mx-auto" />
              <p className="font-bold text-gray-400">No reviews yet. Be the first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-50 dark:border-gray-800 shadow-sm relative group animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                        {review.name?.[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.name || 'Anonymous User'}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">"{review.comment}"</p>

                  {(user?._id === review.user || user?.role === 'admin') && (
                    <button 
                      onClick={() => deleteMutation.mutate(review._id)}
                      className="absolute top-6 right-6 p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewSection
