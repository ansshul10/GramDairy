import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import newsletterService from '../../services/newsletterService';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      await newsletterService.unsubscribe(email);
      setSuccess(true);
      toast.success('You have been unsubscribed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unsubscribe');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-gray-200 p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight uppercase italic">Unsubscribed</h1>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 uppercase tracking-wide">
            You've been successfully removed from our newsletter list. We're sorry to see you go!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to GramDairy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 shadow-2xl overflow-hidden">
        <div className="h-2 bg-primary-600" />
        <div className="p-10 lg:p-12">
          <div className="flex items-center justify-center mb-10">
            <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tighter uppercase italic">Newsletter</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Manage your subscription</p>
          </div>

          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to unsubscribe"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 text-sm font-bold focus:outline-none focus:border-primary-600 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                'Confirm Unsubscribe'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary-600 transition-colors"
            >
              Changed your mind? Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
