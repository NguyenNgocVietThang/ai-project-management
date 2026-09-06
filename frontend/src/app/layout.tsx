import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Providers } from '@/app/providers'
import { themeInitScript } from '@/components/theme/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Project Management',
    template: '%s · AI Project Management',
  },
  description: 'AI Project Planning & Portfolio Management',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang` phải khớp ngôn ngữ thật của nội dung: nó điều khiển cách screen reader
  // phát âm và cách trình duyệt gợi ý dịch. Trước đây nó bị gán cứng là "en".
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Chạy trước lần vẽ đầu tiên, nếu không người dùng ở chế độ tối sẽ thấy
            một cú chớp trắng ở mỗi lần tải trang. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
