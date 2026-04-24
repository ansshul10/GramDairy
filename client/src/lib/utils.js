import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes with clsx for cleaner dynamic class handling.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats currency in INR.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

/**
 * Formats date into a human-readable string.
 */
export function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
