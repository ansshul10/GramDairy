import React from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom';

const ReferralPanel = ({ referralCode, walletBalance }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Hey! Use my referral code *${referralCode}* to get fresh village milk delivered to your doorstep from GramDairy. Download now: https://gramdairy.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-8 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-1 bg-amber-500" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-amber-500 text-black">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 leading-none mb-1">Affiliate Program</h4>
          <p className="text-xl font-black italic tracking-tighter uppercase">Refer & Earn</p>
        </div>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
        Share your unique code with friends and family to earn rewards on their first subscription.
      </p>

      {/* Wallet Balance Miniature View */}
      <div className="flex items-center justify-between p-4 mb-8 bg-emerald-500/10 border border-emerald-500/20">
        <div>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Wallet Balance</p>
           <p className="text-2xl font-black italic text-white tracking-tighter">₹{walletBalance}</p>
        </div>
        <Link to="/refer-and-earn" className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest underline underline-offset-4">
           View History
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex bg-white/5 border border-white/10 p-4 items-center justify-between">
          <span className="text-xl font-mono font-black tracking-[0.2em]">{referralCode}</span>
          <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 transition-colors">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button 
          onClick={shareOnWhatsApp}
          className="w-full h-14 bg-[#25D366] text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-90 transition-all rounded-none"
        >
          <MessageCircle className="w-4 h-4" />
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ReferralPanel;
