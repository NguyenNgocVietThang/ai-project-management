import { format, parseISO } from 'date-fns'

export function formatMoney(value: number | null, currency = 'VND'): string {
  if (value === null) return 'Not set'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not set'
  return format(parseISO(value), 'MMM d, yyyy')
}

export function formatStatus(value: string): string {
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (character: string) => character.toUpperCase())
}
