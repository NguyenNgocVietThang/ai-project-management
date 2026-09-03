import { redirect } from 'next/navigation'

// Nguồn dữ liệu chuẩn thực sự của luồng auth (authStore) chỉ tồn tại phía client, nên `/`
// chuyển ngay sang `/login`; nhóm route (auth) sẽ đẩy những người dùng đã xác thực
// sang `/dashboard` một khi store rehydrate xong.
export default function RootPage() {
  redirect('/login')
}
