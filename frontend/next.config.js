/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== 'production'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'
// API proxy preserves first-party httpOnly cookies across distinct Render sites.
// This origin is server-only and is fixed at build time by Next rewrites.
const backendOrigin = process.env.BACKEND_PROXY_ORIGIN
if (backendOrigin) {
  const url = new URL(backendOrigin)
  if (!['https:', ...(isDev ? ['http:'] : [])].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('BACKEND_PROXY_ORIGIN must be a bare HTTPS origin')
  }
}

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
// components/common/Avatar.tsx render nguyên trạng, nên origin này phải
// được cho phép, nếu không mọi user Google sẽ hiển thị ảnh hỏng.
const avatarOrigins = 'https://lh3.googleusercontent.com'

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
  outputFileTracingRoot: __dirname,
  experimental: { proxyTimeout: 120_000 },
  // Không để Next tự cắt dấu '/' cuối (308) trên đường dẫn API: nếu không, request
  // `/api/v1/portfolios/` bị đổi thành `/api/v1/portfolios` rồi proxy sang FastAPI.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return backendOrigin ? [{ source: '/api/v1/:path*', destination: `${backendOrigin.replace(/\/$/, '')}/api/v1/:path*` }] : []
  },
  images: {
    // remotePatterns chu khong phai domains: `domains` da deprecated o Next 15, va
    // no khong the gioi han theo duong dan - `remotePatterns` thi co the.
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
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
