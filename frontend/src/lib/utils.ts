import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Gộp các tên class Tailwind, xử lý xung đột (class đứng sau thắng).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
