import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Pause, X, Plus, Plane, ChevronLeft, ChevronRight, Loader2, SkipForward, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import subscriptionService from '../../services/subscriptionService'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * INTERACTIVE DELIVERY CALENDAR
 * Fully actionable calendar — one-tap skip, extra quantity, vacation mode.
 * ───────────────────────────────────────────────────────────────────────────── */

const InteractiveCalendar = ({ sub, snapshot, viewDate, onPrevMonth, onNextMonth, isLoadingSnapshot }) => {
  const queryClient = useQueryClient()
  const [selectedDay, setSelectedDay] = useState(null)
  const [showVacation, setShowVacation] = useState(false)
  const [vacationStart, setVacationStart] = useState('')
  const [vacationEnd, setVacationEnd] = useState('')

  const today = new Date(); today.setHours(0,0,0,0)
  const now = new Date()
  const isCurrentMonth = snapshot?.isCurrentMonth

  const calendar = snapshot?.calendar || []
  const dayOverrides = sub?.dayOverrides || []
  const vacationMode = sub?.vacationMode || {}

  // Get override for a given day number
  const getOverride = (dayNum) => {
    const targetDate = new Date(viewDate.year, viewDate.month - 1, dayNum)
    targetDate.setHours(0,0,0,0)
    return dayOverrides.find(o => {
      const d = new Date(o.date); d.setHours(0,0,0,0)
      return d.getTime() === targetDate.getTime()
    })
  }

  // Is this date in the future?
  const isFuture = (dayNum) => {
    const d = new Date(viewDate.year, viewDate.month - 1, dayNum)
    d.setHours(0,0,0,0)
    return d > today
  }

  const overrideMutation = useMutation({
    mutationFn: ({ date, action, quantity }) =>
      subscriptionService.setDayOverride(sub._id, date, action, quantity),
    onSuccess: (data, { action }) => {
      queryClient.invalidateQueries(['sub-snapshot'])
      queryClient.invalidateQueries(['my-subscriptions'])
      setSelectedDay(null)
      if (action === 'Skip') {
        toast.success('Delivery skipped! Refund credited to wallet 💰')
      } else {
        toast.success('Extra delivery added! 🥛')
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Action failed')
  })

  const vacationMutation = useMutation({
    mutationFn: ({ startDate, endDate, active }) =>
      subscriptionService.setVacationMode(sub._id, startDate, endDate, active),
    onSuccess: (_, { active }) => {
      queryClient.invalidateQueries(['sub-snapshot'])
      queryClient.invalidateQueries(['my-subscriptions'])
      setShowVacation(false)
      setVacationStart(''); setVacationEnd('')
      toast.success(active !== false ? '✈️ Vacation mode activated!' : 'Vacation cancelled')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to set vacation mode')
  })

  const handleDayClick = (day) => {
    if (!isFuture(day.day)) return
    if (sub.status !== 'Active') return toast.error('Plan must be active to modify deliveries')
    setSelectedDay(selectedDay?.day === day.day ? null : day)
  }

  const handleSkip = () => {
    if (!selectedDay) return
    const date = new Date(viewDate.year, viewDate.month - 1, selectedDay.day).toISOString()
    overrideMutation.mutate({ date, action: 'Skip', quantity: sub.quantity })
  }

  const handleExtra = (qty = 1) => {
    if (!selectedDay) return
    const date = new Date(viewDate.year, viewDate.month - 1, selectedDay.day).toISOString()
    overrideMutation.mutate({ date, action: 'Extra', quantity: qty })
  }

  const handleVacation = () => {
    if (!vacationStart || !vacationEnd) return toast.error('Please select both start and end dates')
    vacationMutation.mutate({ startDate: vacationStart, endDate: vacationEnd, active: true })
  }

  const handleCancelVacation = () => {
    vacationMutation.mutate({ startDate: vacationMode.startDate, endDate: vacationMode.endDate, active: false })
  }

  const getDayStyle = (day) => {
    const override = getOverride(day.day)
    const future = isFuture(day.day)

    if (override?.action === 'Skip') return 'bg-red-500/10 border-red-500/20 text-red-600'
    if (override?.action === 'Extra') return 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    if (day.status === 'Delivered') return 'bg-emerald-500/5 text-emerald-600'
    if (day.status === 'Paused') return 'bg-amber-500/5 text-amber-600'
    if (day.status === 'History') return 'bg-gray-50 dark:bg-[#0d0d0d] text-gray-400/30'
    if (future) return 'bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer hover:border-primary-200 dark:hover:border-primary-800'
    return 'bg-white dark:bg-[#0a0a0a] text-gray-300 dark:text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors text-gray-500">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors text-gray-500">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h4 className="text-xl font-bold uppercase tracking-tighter text-gray-900 dark:text-white flex items-center gap-3 italic">
            <span className="text-primary-600">{snapshot?.monthName}</span>
            <span className="text-gray-400 font-medium">{snapshot?.year}</span>
            {isCurrentMonth && (
              <span className="text-[7px] bg-primary-600 text-white px-2 py-0.5 tracking-[0.3em] font-black uppercase">LIVE</span>
            )}
          </h4>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {vacationMode?.isActive ? (
            <button
              onClick={handleCancelVacation}
              disabled={vacationMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all"
            >
              {vacationMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              Cancel Vacation
            </button>
          ) : (
            <button
              onClick={() => setShowVacation(!showVacation)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all",
                showVacation
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400"
              )}
            >
              <Plane className="w-3 h-3" /> Vacation Mode
            </button>
          )}
        </div>
      </div>

      {/* Vacation Mode Panel */}
      {showVacation && !vacationMode?.isActive && (
        <div className="p-6 bg-amber-500/5 border border-amber-500/20 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-amber-600" />
            <h5 className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-[0.3em]">Set Vacation Mode</h5>
          </div>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
            All deliveries in this range will be skipped automatically. Refunds are credited to your wallet.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Start Date</label>
              <input
                type="date"
                value={vacationStart}
                onChange={e => setVacationStart(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-4 py-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">End Date</label>
              <input
                type="date"
                value={vacationEnd}
                onChange={e => setVacationEnd(e.target.value)}
                min={vacationStart || new Date().toISOString().split('T')[0]}
                className="block w-full px-4 py-3 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-600"
              />
            </div>
          </div>
          <button
            onClick={handleVacation}
            disabled={vacationMutation.isPending || !vacationStart || !vacationEnd}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all disabled:opacity-50"
          >
            {vacationMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plane className="w-3 h-3" />}
            Activate Vacation Mode
          </button>
        </div>
      )}

      {/* Vacation Active Banner */}
      {vacationMode?.isActive && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
          <Plane className="w-4 h-4 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest">
            Vacation mode active: {new Date(vacationMode.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} → {new Date(vacationMode.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-3 py-2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
        <LegendItem color="bg-emerald-500" label="Delivered" />
        <LegendItem color="bg-amber-500" label="Paused" />
        <LegendItem color="bg-red-500" label="Skipped" />
        <LegendItem color="bg-blue-500" label="Extra" />
        <LegendItem color="bg-gray-200 dark:bg-gray-700" label="Upcoming (tap to edit)" />
      </div>

      {/* Calendar Grid */}
      {isLoadingSnapshot ? (
        <div className="grid grid-cols-7 gap-1 h-48 bg-gray-100/30 dark:bg-gray-800/20 animate-pulse border border-gray-100 dark:border-gray-800" />
      ) : (
        <div className="grid grid-cols-7 gap-0.5 border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 p-0.5">
          {calendar.map((day) => {
            const override = getOverride(day.day)
            const future = isFuture(day.day)
            const isSelected = selectedDay?.day === day.day

            return (
              <div
                key={day.date}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 border transition-all duration-150",
                  "h-12 sm:h-14",
                  getDayStyle(day),
                  isSelected && "ring-2 ring-primary-500 ring-inset z-10",
                  future ? "cursor-pointer" : "cursor-default"
                )}
                title={override ? `${override.action} on this day` : day.status}
              >
                <span className={cn(
                  "text-[10px] sm:text-[11px] font-black font-mono leading-none",
                  isSelected ? "text-primary-600" : ""
                )}>{day.day}</span>
                {override?.action === 'Skip' && <SkipForward className="w-2.5 h-2.5 text-red-500" />}
                {override?.action === 'Extra' && <Plus className="w-2.5 h-2.5 text-blue-500" />}
                {!override && day.status === 'Delivered' && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                {!override && day.status === 'Paused' && <Pause className="w-2.5 h-2.5 text-amber-500" />}
                {!override && future && <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />}
              </div>
            )
          })}
        </div>
      )}

      {/* Action Panel — appears when a future date is selected */}
      {selectedDay && (
        <div className="p-5 bg-white dark:bg-[#0a0a0a] border border-primary-200 dark:border-primary-800/50 shadow-lg animate-in slide-in-from-bottom-2 duration-200 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">
              {new Date(viewDate.year, viewDate.month - 1, selectedDay.day).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h5>
            <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {getOverride(selectedDay.day) ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Current override: <span className="text-primary-600">{getOverride(selectedDay.day).action}</span>
              </p>
              <button
                onClick={() => overrideMutation.mutate({
                  date: new Date(viewDate.year, viewDate.month - 1, selectedDay.day).toISOString(),
                  action: getOverride(selectedDay.day).action
                })}
                disabled={overrideMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
              >
                {overrideMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Remove Override (Restore Normal Delivery)
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSkip}
                disabled={overrideMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                {overrideMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <SkipForward className="w-3 h-3" />}
                Skip Delivery · Wallet Refund
              </button>
              <button
                onClick={() => handleExtra(1)}
                disabled={overrideMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all disabled:opacity-50"
              >
                {overrideMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Extra Liter Tomorrow
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-2.5 h-2.5 rounded-none", color)} />
    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
  </div>
)

export default InteractiveCalendar
