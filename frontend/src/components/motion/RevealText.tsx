import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  as?: 'h1' | 'h2' | 'p' | 'span'
  className?: string
  /** Độ trễ trước từ đầu tiên (ms). */
  delay?: number
  /** Khoảng cách giữa hai từ liên tiếp (ms). */
  stagger?: number
  /** Nội dung đuôi (ví dụ dấu chấm màu nhấn) xuất hiện sau từ cuối. */
  suffix?: ReactNode
}

/**
 * Tiêu đề hiện dần theo từng từ (mờ -> rõ, trồi lên 0.4em).
 *
 * Tách theo khoảng trắng chứ không theo ký tự để giữ nguyên dấu tiếng Việt và
 * không làm gãy chữ khi xuống dòng. Trình đọc màn hình đọc nguyên câu qua
 * aria-label; các span con bị ẩn khỏi cây trợ năng. Hiệu ứng chỉ chạy một lần
 * khi phần tử được gắn vào DOM, và bị tắt bởi prefers-reduced-motion (globals.css).
 */
export function RevealText({ text, as: Tag = 'h1', className, delay = 0, stagger = 40, suffix }: RevealTextProps) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block animate-word-rise" style={{ animationDelay: `${delay + i * stagger}ms` }}>
          {word}
          {i < words.length - 1 && ' '}
        </span>
      ))}
      {suffix && (
        <span aria-hidden="true" className="inline-block animate-word-rise" style={{ animationDelay: `${delay + words.length * stagger}ms` }}>
          {suffix}
        </span>
      )}
    </Tag>
  )
}

/**
 * Bọc một khối để nó trồi lên nhẹ khi xuất hiện. Với `stagger`, mỗi phần tử con
 * trực tiếp được trễ thêm một nhịp (tối đa 8 nhịp để tổng thời gian < 600ms).
 */
export function Reveal({ children, delay = 0, stagger, className }: { children: ReactNode; delay?: number; stagger?: number; className?: string }) {
  if (!stagger) {
    return <div className={cn('animate-fade-up', className)} style={{ animationDelay: `${delay}ms` }}>{children}</div>
  }
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child
        const element = child as ReactElement<{ className?: string; style?: CSSProperties }>
        return cloneElement(element, {
          className: cn(element.props.className, 'animate-fade-up'),
          style: { ...element.props.style, animationDelay: `${delay + Math.min(i, 8) * stagger}ms` },
        })
      })}
    </div>
  )
}
