'use client'

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { notifyError } from '@/lib/notify'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Lưới an toàn cho toàn bộ ứng dụng: mọi mutation thất bại đều báo cho
        // người dùng biết. Từng mutation vẫn có thể tự xử lý onError (ví dụ để
        // rollback optimistic update) — cache này chỉ bảo đảm không có thất bại
        // nào trôi qua trong im lặng, kể cả ở mã viết sau này.
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silent) return
            notifyError(error, mutation.meta?.errorMessage as string | undefined)
          },
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
