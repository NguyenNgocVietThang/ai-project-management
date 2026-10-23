import { describe, expect, it } from 'vitest'
import { localizeApiError } from './errors'

const apiError = (detail: unknown, status = 400) => ({ response: { data: { detail }, status } })

describe('localized API errors', () => {
  it.each([
    ['Current password is incorrect', 'Mật khẩu hiện tại không đúng.'],
    ['Avatar file is not a valid image', 'Tệp ảnh đại diện không phải là ảnh hợp lệ.'],
    ["The built-in 'Admin' role cannot be deleted", 'Không thể xóa vai trò Admin mặc định.'],
    ['Cannot disconnect the last sign-in method', 'Không thể hủy liên kết phương thức đăng nhập cuối cùng.'],
    ['Please wait 45 seconds before requesting another verification email', 'Vui lòng chờ 45 giây trước khi yêu cầu email xác minh mới.'],
    ['Cannot delete role: 3 user(s) are still assigned to it', 'Không thể xóa vai trò: vẫn còn 3 người dùng được gán.'],
    ['Role id(s) not found: [3, 7]', 'Không tìm thấy vai trò có mã: [3, 7].'],
  ])('preserves the meaning of %s in Vietnamese', (english, vietnamese) => {
    expect(localizeApiError(apiError(english), 'vi')).toBe(vietnamese)
    expect(localizeApiError(apiError(english), 'en')).toBe(english)
  })

  it('translates every validation detail separately', () => {
    const error = apiError([{ msg: 'Field required' }, { msg: 'String should have at least 3 characters' }], 422)
    expect(localizeApiError(error, 'vi')).toBe('Trường này là bắt buộc. Phải có ít nhất 3 ký tự.')
  })

  it('translates network failures', () => {
    expect(localizeApiError({ response: undefined }, 'vi')).toBe('Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.')
    expect(localizeApiError(new Error('Network Error'), 'vi')).toBe('Lỗi kết nối mạng.')
  })

  it('does not leak unknown English fallback text into Vietnamese', () => {
    expect(localizeApiError(null, 'vi', 'Failed to save the operation')).toBe('Đã xảy ra lỗi. Vui lòng thử lại.')
    expect(localizeApiError(new Error('Unrecognized backend error'), 'vi', 'Failed to save')).toBe('Đã xảy ra lỗi. Vui lòng thử lại.')
    expect(localizeApiError(null, 'en', 'Failed to save')).toBe('Failed to save')
    expect(localizeApiError(null, 'vi', 'Không thể lưu dữ liệu.')).toBe('Không thể lưu dữ liệu.')
  })

  it('uses status-specific feedback for unknown errors', () => {
    expect(localizeApiError(apiError('New server error', 403), 'vi')).toBe('Bạn không có quyền thực hiện thao tác này.')
  })

  it('responds to locale changes without mutating the original error', () => {
    const error = apiError('Incorrect email or password', 401)
    expect(localizeApiError(error, 'vi')).toBe('Email hoặc mật khẩu không đúng.')
    expect(localizeApiError(error, 'en')).toBe('Incorrect email or password')
    expect(error.response.data.detail).toBe('Incorrect email or password')
  })
})
