import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import walletService from '../../services/walletService'
import { Wallet, TrendingUp, Gift, Plus, Loader2, ArrowUpRight, ArrowDownRight, Zap, ShieldCheck, Star, CreditCard } from 'lucide-react'
import { cn } from '../../lib/utils'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * GRAMDAIRY SMART WALLET
 * Pre-paid wallet with auto-bills, 5% cashback on top-ups ≥ ₹1000,
 * and instant skip refunds.
 * ───────────────────────────────────────────────────────────────────────────── */

const TOP_UP_PRESETS = [200, 500, 1000, 2000]

const GramDairyWallet = () => {
  const queryClient = useQueryClient()
  const [topUpAmount, setTopUpAmount] = useState('')
  const [txnId, setTxnId] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: walletService.getWallet,
  })

  const topUpMutation = useMutation({
    mutationFn: ({ amount, transactionId }) => walletService.topUp(amount, transactionId),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['wallet'])
      toast.success(res.message || 'Wallet topped up!')
      setTopUpAmount('')
      setTxnId('')
      setShowTopUp(false)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Top-up failed'),
  })

  const balance = data?.data?.balance ?? 0
  const transactions = data?.data?.transactions ?? []
  const cashback = Number(topUpAmount) >= 1000 ? Math.round(Number(topUpAmount) * 0.05) : 0

  const handleTopUp = () => {
    if (!topUpAmount || Number(topUpAmount) <= 0) return toast.error('Enter a valid amount')
    topUpMutation.mutate({ amount: Number(topUpAmount), transactionId: txnId })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Opening Your Wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-32">

      {/* HEADER */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0a0a] pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-primary-600" />
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] italic">Smart Wallet</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            GramDairy <span className="text-gray-400 font-medium">Wallet</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose max-w-xl">
            Top up your balance, earn cashback rewards, and pay subscription bills automatically.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 space-y-12">

        {/* BALANCE HERO CARD */}
        <div className="relative bg-gray-900 dark:bg-white overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-emerald-500 to-primary-600" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div className="relative z-10 p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] mb-3">Available Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl lg:text-7xl font-bold text-white dark:text-gray-900 tracking-tighter">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-3">
                Auto-deducted from bills when available
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowTopUp(!showTopUp)}
                className={cn(
                  "flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95",
                  showTopUp
                    ? "bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900"
                    : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-primary-600 hover:text-white"
                )}
              >
                <Plus className="w-4 h-4" /> Top Up Wallet
              </button>

              <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 uppercase tracking-widest justify-center">
                <Gift className="w-3 h-3" /> 5% Cashback on ₹1000+
              </div>
            </div>
          </div>
        </div>

        {/* TOP-UP PANEL */}
        {showTopUp && (
          <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-8 space-y-8 animate-in slide-in-from-top-4 duration-300 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">Add Money to Wallet</h3>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-1">Transfer via UPI / Bank and enter the amount below</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>

            {/* Preset amounts */}
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Quick Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {TOP_UP_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setTopUpAmount(String(preset))}
                    className={cn(
                      "py-3 text-sm font-bold border transition-all",
                      topUpAmount === String(preset)
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "bg-gray-50 dark:bg-[#111111] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-400"
                    )}
                  >
                    ₹{preset}
                    {preset >= 1000 && (
                      <span className="block text-[8px] font-black text-emerald-500 tracking-widest">+5% CB</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Custom Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                  placeholder="Enter amount..."
                  min={1}
                  className="block w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                />
              </div>
              {cashback > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Gift className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    🎁 You'll receive ₹{cashback} cashback bonus! Total credit: ₹{Number(topUpAmount) + cashback}
                  </span>
                </div>
              )}
            </div>

            {/* UPI / Transaction ID */}
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Transaction ID (Optional)</label>
              <input
                type="text"
                value={txnId}
                onChange={e => setTxnId(e.target.value)}
                placeholder="UPI / Reference ID for records..."
                className="block w-full px-5 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary-600"
              />
            </div>

            <button
              onClick={handleTopUp}
              disabled={topUpMutation.isPending || !topUpAmount}
              className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {topUpMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><Zap className="w-4 h-4" /> Add ₹{topUpAmount || '—'} to Wallet{cashback > 0 ? ` + ₹${cashback} Cashback` : ''}</>
              )}
            </button>
          </div>
        )}

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
          <StatCard
            icon={TrendingUp}
            label="Total Credited"
            value={`₹${transactions.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}`}
            color="text-emerald-600"
          />
          <StatCard
            icon={CreditCard}
            label="Total Spent"
            value={`₹${transactions.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}`}
            color="text-red-500"
          />
          <StatCard
            icon={Star}
            label="Cashback Earned"
            value={`₹${transactions.filter(t => t.description?.includes('Cashback')).reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}`}
            color="text-amber-500"
          />
        </div>

        {/* TRANSACTION LEDGER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Transaction History</h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{transactions.length} entries</span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 dark:border-gray-800">
              <Wallet className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">No transactions yet.</p>
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-1">Top up your wallet to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800">
              {transactions.map((txn, i) => (
                <TransactionRow key={i} txn={txn} />
              ))}
            </div>
          )}
        </div>

        {/* INFO CARD */}
        <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/40 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            <h4 className="text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.3em]">How the GramDairy Wallet Works</h4>
          </div>
          <ul className="space-y-2 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
            <li className="flex items-start gap-2"><span className="text-primary-500 shrink-0">→</span> Top up your wallet to pay monthly milk bills automatically.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-500 shrink-0">→</span> Get 5% bonus cashback on every top-up of ₹1000 or more.</li>
            <li className="flex items-start gap-2"><span className="text-blue-500 shrink-0">→</span> Skip a delivery from the calendar — refund is instant to this wallet.</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 shrink-0">→</span> Wallet balance is also redeemable on one-time product orders at checkout.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

const TransactionRow = ({ txn }) => {
  const isCredit = txn.type === 'Credit'
  const isCashback = txn.description?.includes('Cashback') || txn.description?.includes('🎁')

  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-9 h-9 flex items-center justify-center border flex-shrink-0",
          isCredit ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"
        )}>
          {isCredit
            ? <ArrowDownRight className={cn("w-4 h-4", isCashback ? "text-amber-500" : "text-emerald-500")} />
            : <ArrowUpRight className="w-4 h-4 text-red-500" />
          }
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">{txn.description}</p>
          <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
            {txn.timestamp ? new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
          </p>
        </div>
      </div>
      <span className={cn(
        "text-sm font-black tracking-tight",
        isCredit ? (isCashback ? "text-amber-500" : "text-emerald-600") : "text-red-500"
      )}>
        {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
      </span>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#0a0a0a] p-6 flex items-center gap-4">
    <div className={cn("w-10 h-10 border border-gray-100 dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-[#111111]", color)}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-xl font-bold tracking-tighter", color)}>{value}</p>
    </div>
  </div>
)

export default GramDairyWallet
