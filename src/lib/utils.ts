import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number, currency = '€') {
  if (typeof amount === 'string') {
    return amount.includes(currency) ? amount : `${currency}${amount}`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

export function formatPercentage(value: number, showSign = true) {
  const formatted = `${Math.abs(value).toFixed(1)}%`;
  if (!showSign) return formatted;
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function getStatusColor(value: number, thresholds = { good: 10, okay: 0 }) {
  if (value >= thresholds.good) return 'text-green-600';
  if (value >= thresholds.okay) return 'text-yellow-600';
  return 'text-red-600';
}

export function getTrendIcon(value: number) {
  return value >= 0 ? '↗' : '↘';
}

