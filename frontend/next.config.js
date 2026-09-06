/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'

/** Origin của một URL, hoặc '' nếu không thể phân tích (giữ cho CSP không trở nên không hợp lệ). */
function originOf(value) {
  try {
    return new URL(value).origin
  } catch {
    return ''
  }
}

const apiOrigin = originOf(API_URL)
const wsOrigin = originOf(WS_URL)

// Ảnh đại diện của social-login. OAuthService lưu URL avatar tuyệt đối của
// provider trên user (xem backend app/services/oauth_service.py), và
// components/common/Avatar.tsx render nguyên trạng, nên các origin này phải
// được cho phép, nếu không mọi user Google/Facebook sẽ hiển thị ảnh hỏng.
const avatarOrigins = [
  'https://lh3.googleusercontent.com',
  'https://platform-lookaside.fbsbx.com',
  'https://*.fbcdn.net',
].join(' ')

// 'unsafe-inline' / 'unsafe-eval' trong script-src: App Router khởi động qua
// các inline script và, ở môi trường dev, dùng HMR dựa trên eval. Siết chặt
// thành policy dựa trên nonce đòi hỏi sinh một nonce cho mỗi request trong
// middleware.ts và đáng để làm như một việc tiếp theo — policy bên dưới vẫn
// chặn các origin script bên ngoài, framing, chiếm quyền form và chèn base-tag.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: ${apiOrigin} ${avatarOrigins}`.trim(),
  `connect-src 'self' ${apiOrigin} ${wsOrigin}`.trim(),
]
  .filter(Boolean)
  .join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

if (!isDev) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  })
}

const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts")

const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns chu khong phai domains: `domains` da deprecated o Next 15, va
    // no khong the gioi han theo duong dan - `remotePatterns` thi co the.
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

module.exports = withNextIntl(nextConfig)
