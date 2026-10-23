import { getApiErrorMessage } from '@/types/api.types'

const VI_ERRORS: Record<string, string> = {
  'User does not have the Investor role': 'Người dùng chưa có vai trò Nhà đầu tư.',
  'Investor access not found': 'Không tìm thấy quyền truy cập của nhà đầu tư.',
  "This password is too common. Please choose a different one": "Mật khẩu này quá phổ biến. Vui lòng chọn mật khẩu khác.",
  "Value must not be blank": "Giá trị không được để trống.",
  "Current password is incorrect": "Mật khẩu hiện tại không đúng.",
  "New password must be different from current password": "Mật khẩu mới phải khác mật khẩu hiện tại.",
  "Avatar must be a JPEG, PNG, or WebP image": "Ảnh đại diện phải là ảnh JPEG, PNG hoặc WebP.",
  "Avatar image dimensions are too large": "Kích thước ảnh đại diện quá lớn.",
  "Avatar file is not a valid image": "Tệp ảnh đại diện không phải là ảnh hợp lệ.",
  "Avatar must not exceed 5 MiB": "Ảnh đại diện không được vượt quá 5 MiB.",
  "Avatar file is empty": "Tệp ảnh đại diện trống.",
  "Avatar storage is temporarily unavailable": "Dịch vụ lưu ảnh đại diện tạm thời không khả dụng.",
  "Avatar not found": "Không tìm thấy ảnh đại diện.",
  "Google account is not connected": "Tài khoản Google chưa được liên kết.",
  "Cannot disconnect the last sign-in method": "Không thể hủy liên kết phương thức đăng nhập cuối cùng.",
  "Unsupported OAuth provider": "Nhà cung cấp đăng nhập không được hỗ trợ.",
  "Username confirmation does not match": "Tên đăng nhập xác nhận không khớp.",
  "Invalid or expired reset token": "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
  "Invalid or expired email verification token": "Liên kết xác minh email không hợp lệ hoặc đã hết hạn.",
  "Invalid refresh token": "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",
  "Sign-in link is no longer valid": "Liên kết đăng nhập không còn hợp lệ.",
  "Sign-in security is temporarily unavailable": "Dịch vụ bảo mật đăng nhập tạm thời không khả dụng.",
  "Unable to queue email right now. Please try again.": "Hiện không thể gửi email. Vui lòng thử lại.",
  "Too many failed sign-in attempts. Please try again later.": "Đăng nhập thất bại quá nhiều lần. Vui lòng thử lại sau.",
  "This account uses social login. Please sign in with Google.": "Tài khoản này sử dụng đăng nhập mạng xã hội. Vui lòng đăng nhập bằng Google.",
  "Inactive user": "Tài khoản đã bị vô hiệu hóa.",
  "Admin privileges are required to assign roles to a new user": "Cần quyền quản trị viên để gán vai trò cho người dùng mới.",
  "Only a superuser can change superuser status": "Chỉ siêu quản trị viên mới có thể thay đổi trạng thái siêu quản trị viên.",
  "You cannot change your own superuser status": "Bạn không thể thay đổi trạng thái siêu quản trị viên của chính mình.",
  "Admin privileges are required to change role assignments": "Cần quyền quản trị viên để thay đổi vai trò được gán.",
  "You cannot change your own role assignments": "Bạn không thể thay đổi vai trò của chính mình.",
  "You cannot deactivate your own account": "Bạn không thể tự vô hiệu hóa tài khoản qua quản trị người dùng.",
  "Cannot remove Admin access from the last remaining admin": "Không thể gỡ quyền quản trị của quản trị viên cuối cùng.",
  "Cannot deactivate the last remaining admin": "Không thể vô hiệu hóa quản trị viên cuối cùng.",
  "A role with this name already exists": "Vai trò có tên này đã tồn tại.",
  "The built-in 'Admin' role cannot be renamed": "Không thể đổi tên vai trò Admin mặc định.",
  "The built-in 'Admin' role cannot be deleted": "Không thể xóa vai trò Admin mặc định.",
  "Required roles: ['Admin']": "Cần vai trò quản trị viên để thực hiện thao tác này.",
  "Password must be at least 12 characters": "Mật khẩu phải có ít nhất 12 ký tự.",
  "Password must not exceed 72 bytes": "Mật khẩu không được vượt quá 72 byte.",
  "Password must contain at least one number or special character": "Mật khẩu phải chứa ít nhất một chữ số hoặc ký tự đặc biệt.",
  "Invalid response from authentication server.": "Phản hồi không hợp lệ từ máy chủ xác thực.",
  "Failed to complete login.": "Không thể hoàn tất đăng nhập.",
  "This verification link is invalid or has expired.": "Liên kết xác minh không hợp lệ hoặc đã hết hạn.",
  "value is not a valid email address": "Địa chỉ email không hợp lệ.",
  "Input should be a valid email address": "Địa chỉ email không hợp lệ.",
  "Change request not found": "Không tìm thấy yêu cầu thay đổi.",
  "Worklog not found": "Không tìm thấy nhật ký công việc.",
  "Phase not found": "Không tìm thấy giai đoạn.",
  "Sprint not found": "Không tìm thấy sprint.",
  "Epic not found": "Không tìm thấy hạng mục lớn.",
  "Project version not found": "Không tìm thấy phiên bản dự án.",
  "End date must be on or after start date": "Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.",
  "Due date must be on or after start date": "Hạn hoàn thành phải bằng hoặc sau ngày bắt đầu.",
  "Cannot delete role": "Không thể xóa vai trò.",
  'Something went wrong. Please try again.': 'Đã xảy ra lỗi. Vui lòng thử lại.',
  'Unable to reach the server. Please check your connection and try again.': 'Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.',
  'Network Error': 'Lỗi kết nối mạng.',
  'Incorrect email or password': 'Email hoặc mật khẩu không đúng.',
  'Incorrect username or password': 'Tên đăng nhập hoặc mật khẩu không đúng.',
  'Invalid credentials': 'Thông tin đăng nhập không đúng.',
  'Email already registered': 'Email đã được đăng ký.',
  'Username already taken': 'Tên đăng nhập đã được sử dụng.',
  'Not authenticated': 'Vui lòng đăng nhập để tiếp tục.',
  'Could not validate credentials': 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
  'Permission denied': 'Bạn không có quyền thực hiện thao tác này.',
  'Not Found': 'Không tìm thấy nội dung.',
  'Forbidden': 'Bạn không có quyền truy cập.',
  'Project not found': 'Không tìm thấy dự án.',
  'Portfolio not found': 'Không tìm thấy danh mục.',
  'Task not found': 'Không tìm thấy công việc.',
  'User not found': 'Không tìm thấy người dùng.',
  'Role not found': 'Không tìm thấy vai trò.',
  'Field required': 'Trường này là bắt buộc.',
}

/** Translate recognized API diagnostics without exposing English fallback text in Vietnamese. */
function translateMessage(message: string): string | undefined {
  if (VI_ERRORS[message]) return VI_ERRORS[message]
  const value = message.replace(/^Value error, /, '')
  if (VI_ERRORS[value]) return VI_ERRORS[value]
  const wait = /^Please wait (\d+) seconds before requesting another verification email$/.exec(value)
  if (wait) return `Vui lòng chờ ${wait[1]} giây trước khi yêu cầu email xác minh mới.`
  const assigned = /^Cannot delete role: (\d+) user\(s\) are still assigned to it$/.exec(value)
  if (assigned) return `Không thể xóa vai trò: vẫn còn ${assigned[1]} người dùng được gán.`
  const missing = /^(Role|Permission) id\(s\) not found: (\[[\d, ]*\])$/.exec(value)
  if (missing) return `Không tìm thấy ${missing[1] === 'Role' ? 'vai trò' : 'quyền'} có mã: ${missing[2]}.`
  const limit = /^String should have at (least|most) (\d+) characters$/.exec(value)
  if (limit) return `Phải có ${limit[1] === 'least' ? 'ít nhất' : 'tối đa'} ${limit[2]} ký tự.`
  if (/^(value is not a valid email address|Input should be a valid email address)/.test(value)) return 'Địa chỉ email không hợp lệ.'
  // Preserve Vietnamese messages already authored by the backend or caller.
  if (/[\u00c0-\u1ef9]/.test(message)) return message
  return undefined
}

export function localizeApiError(error: unknown, locale: string, fallback?: string): string {
  const message = getApiErrorMessage(error, fallback)
  if (locale !== 'vi') return message
  const detail = (error as { response?: { data?: { detail?: unknown } } } | null)?.response?.data?.detail
  if (Array.isArray(detail) && detail.length) {
    const translated = detail.map((field) => typeof field?.msg === 'string' ? translateMessage(field.msg) : undefined)
    if (translated.every((item): item is string => Boolean(item))) return translated.join(' ')
  }
  const translated = translateMessage(message)
  if (translated) return translated
  const status = (error as { response?: { status?: number } } | null)?.response?.status
  if (status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  if (status === 403) return 'Bạn không có quyền thực hiện thao tác này.'
  if (status === 404) return 'Không tìm thấy nội dung hoặc bạn không còn quyền truy cập.'
  if (status === 409) return 'Dữ liệu bị trùng hoặc đã thay đổi. Vui lòng kiểm tra và thử lại.'
  if (status === 422) return 'Thông tin nhập chưa hợp lệ. Vui lòng kiểm tra các trường và thử lại.'
  if (status === 429) return 'Đã vượt giới hạn yêu cầu. Vui lòng chờ rồi thử lại.'
  return (fallback && translateMessage(fallback)) || VI_ERRORS['Something went wrong. Please try again.']
}
