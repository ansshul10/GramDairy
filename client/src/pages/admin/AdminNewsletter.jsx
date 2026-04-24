import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  Search, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical,
  ChevronRight,
  Loader2,
  Trash2,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import newsletterService from '../../services/newsletterService';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blastLoading, setBlastLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlastModal, setShowBlastModal] = useState(false);
  const [blastSubject, setBlastSubject] = useState('');
  const [blastMessage, setBlastMessage] = useState('');

  const fetchSubscribers = async () => {
    try {
      const { data } = await newsletterService.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSendBlast = async (e) => {
    e.preventDefault();
    if (!blastSubject || !blastMessage) return toast.error('Please fill in all fields');

    setBlastLoading(true);
    try {
      await newsletterService.sendBlast(blastSubject, blastMessage);
      toast.success('Newsletter blast initiated!');
      setShowBlastModal(false);
      setBlastSubject('');
      setBlastMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send blast');
    } finally {
      setBlastLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSubscribersCount = subscribers.filter(s => s.status === 'subscribed').length;

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter mb-4 italic uppercase">Newsletter</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                {activeSubscribersCount} Active Subscribers
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                {subscribers.length - activeSubscribersCount} Unsubscribed
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowBlastModal(true)}
          className="px-10 py-5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-700 transition-all flex items-center gap-4 shadow-xl shadow-primary-600/20"
        >
          <Send className="w-4 h-4" /> Send Email Blast
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 text-[11px] font-bold tracking-wider placeholder:text-gray-400 focus:outline-none focus:border-primary-600 transition-all"
          />
        </div>
        <button className="px-8 py-4 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-[#111111] transition-all flex items-center gap-4">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-[#0f0f0f] border-b border-gray-100 dark:border-gray-800">
              <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Subscriber</th>
              <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Status</th>
              <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Join Date</th>
              <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Database...</p>
                   </div>
                </td>
              </tr>
            ) : filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No subscribers found in catalog</p>
                </td>
              </tr>
            ) : filteredSubscribers.map((sub) => (
              <tr key={sub._id} className="group hover:bg-gray-50/50 dark:hover:bg-[#0c0c0c] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{sub.email}</p>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Direct Subscriber</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 border ${
                    sub.status === 'subscribed' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20' 
                      : 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
                  }`}>
                    {sub.status === 'subscribed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">{sub.status}</span>
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold font-mono">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-3 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Newsletter Blast Modal */}
      {showBlastModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="max-w-3xl w-full bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-1 bg-primary-600" />
            <div className="p-10 lg:p-12 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase">Dispatch Blast</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Newsletter Broadcast</p>
                </div>
                <button 
                  onClick={() => setShowBlastModal(false)}
                  className="w-10 h-10 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendBlast} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Subject</label>
                  <input
                    type="text"
                    value={blastSubject}
                    onChange={(e) => setBlastSubject(e.target.value)}
                    placeholder="Enter catchy subject line..."
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 text-sm font-bold focus:outline-none focus:border-primary-600 dark:text-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Content</label>
                  <textarea
                    value={blastMessage}
                    onChange={(e) => setBlastMessage(e.target.value)}
                    placeholder="Write your newsletter message here... (Text format, supports line breaks)"
                    rows="8"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 text-sm font-bold focus:outline-none focus:border-primary-600 dark:text-white transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <div className="p-6 bg-primary-50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/10 flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-primary-700 dark:text-primary-400 leading-relaxed uppercase tracking-tight">
                    Warning: This action will dispatch emails to all {activeSubscribersCount} active subscribers currently in the database. 
                    Large blasts may take a few minutes to complete process.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <button
                    type="submit"
                    disabled={blastLoading}
                    className="flex-1 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                  >
                    {blastLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {blastLoading ? 'Broadcasting...' : 'Begin Broadcast'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBlastModal(false)}
                    className="px-12 py-5 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111111] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
