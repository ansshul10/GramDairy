import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(({ 
  className, 
  type = 'text', 
  label, 
  error, 
  icon: Icon, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:text-white dark:placeholder:text-gray-600',
            Icon && 'pl-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-semibold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
