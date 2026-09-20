'use client'

import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider, useTheme } from '@/components/theme/ThemeProvider'
import { notifyError } from '@/lib/notify'

function ThemedToaster() {
  const { resolved } = useTheme()
  return <Toaster theme={resolved} position="top-right" richColors closeButton />
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Lưới an toàn: mọi mutation thất bại đều báo lỗi cho người dùng; từng mutation vẫn tự xử
        // lý onError được (ví dụ rollback optimistic update).
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
        <ThemedToaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
