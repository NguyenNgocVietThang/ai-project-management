import { redirect } from 'next/navigation'

// authStore chỉ tồn tại phía client nên `/` chuyển sang `/login`; nhóm route (auth) đẩy người dùng
// đã xác thực sang `/dashboard` sau khi store rehydrate.
export default function RootPage() {
  redirect('/login')
}
