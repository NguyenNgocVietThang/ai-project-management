/** Ngôn ngữ được hỗ trợ.
 *
 *  `vi` là mặc định: toàn bộ tài liệu, roadmap và bình luận mã nguồn của dự án
 *  đều bằng tiếng Việt, trong khi giao diện trước đây lại 100% tiếng Anh.
 */
export const LOCALES = ['vi', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'vi'

/** Cookie giữ lựa chọn ngôn ngữ. Không có prefix locale trong URL — thêm một
 *  đoạn `[locale]` sẽ buộc phải tái cấu trúc toàn bộ cây route và làm hỏng mọi
 *  liên kết đã lưu. */
export const LOCALE_COOKIE = 'locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
