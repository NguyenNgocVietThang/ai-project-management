import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các route yêu cầu xác thực
const PROTECTED_PREFIXES = ['/dashboard', '/projects', '/portfolios', '/profile', '/admin', '/notifications']
// Các route dành cho người dùng chưa xác thực
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

/** Cờ do backend đặt cùng lúc với cookie phiên httpOnly. KHÔNG phải credential:
 *  nó không mang token và server không bao giờ tin nó.
 *
 *  Middleware này là một tiện ích điều hướng, không phải một cổng bảo mật. Nó chạy
 *  ở origin của frontend nên không thể đọc — càng không thể xác minh — cookie do
 *  API đặt. Việc thực thi phân quyền thật nằm ở backend, nơi mỗi request đều được
 *  kiểm tra chữ ký, danh sách thu hồi, auth_version và is_active. Trước đây cookie
 *  ở đây chứa nguyên access token, nghĩa là nó vừa đọc được bằng JavaScript vừa
 *  sống 7 ngày cho một token có hiệu lực 30 phút. */
const SESSION_FLAG_COOKIE = 'has-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = request.cookies.get(SESSION_FLAG_COOKIE)?.value === '1'

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route)

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
