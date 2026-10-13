import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge không biết thang chữ/bóng tùy biến trong tailwind.config.ts,
// nên mặc định coi `text-caption` là màu chữ và xoá nó khi gặp `text-success`.
// Khai báo thêm nhóm để hai loại class không ghi đè nhau.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'h4', 'lead', 'body', 'body-sm', 'caption', 'overline'] }],
      shadow: [{ shadow: ['soft', 'soft-md', 'soft-lg'] }],
    },
  },
})

/**
 * Gộp các tên class Tailwind, xử lý xung đột (class đứng sau thắng).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
