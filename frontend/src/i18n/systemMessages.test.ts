import { createTranslator } from 'next-intl'
import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import vi from '../../messages/vi.json'
import { localizeActivityAction, localizeEntityType, localizeSystemText } from './systemMessages'

type LeafKeys<T> = { [K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafKeys<T[K]>}` }[keyof T & string]
type SystemKey = LeafKeys<typeof en.systemUi>

function isSystemKey(key: string): key is SystemKey {
  let value: unknown = en.systemUi
  for (const part of key.split('.')) {
    if (!value || typeof value !== 'object' || !(part in value)) return false
    value = Reflect.get(value, part)
  }
  return typeof value === 'string'
}

function translator(locale: string, messages: typeof en.systemUi) {
  const translate = createTranslator({ locale, messages })
  return (key: string, values?: Record<string, string | number>) => {
    if (!isSystemKey(key)) throw new Error(`Unknown system message: ${key}`)
    return translate(key, values)
  }
}

const tVi = translator('vi', vi.systemUi)
const tEn = translator('en', en.systemUi)

describe('localized server system templates', () => {
  it('translates task messages while preserving quoted task names', () => {
    const name = "API 'v2' review"
    const result = localizeSystemText(`You have been assigned to task '${name}'`, tVi, 'vi')
    expect(result).toContain(name)
    expect(result).toContain('Bạn đã được phân công')
    expect(result).not.toContain('{name}')
  })

  it('translates stored Vietnamese approval messages back to English', () => {
    const result = localizeSystemText("Change request 'Extra API scope' đã được duyệt", tEn, 'en')
    expect(result).toContain('Extra API scope')
    expect(result).toContain('has been approved')
  })

  it('translates structured field names, actor and task content independently', () => {
    const result = localizeSystemText("Alex changed due_date, priority on task 'Do not rename me'", tVi, 'vi')
    expect(result).toContain('Alex')
    expect(result).toContain('hạn hoàn thành, độ ưu tiên')
    expect(result).toContain('Do not rename me')
  })

  it('keeps unknown and user-written notification text intact', () => {
    const message = 'Please review my custom note about task planning'
    expect(localizeSystemText(message, tVi, 'vi')).toBe(message)
  })

  it('translates known audit actions and entity types', () => {
    expect(localizeActivityAction('CREATE', tVi, 'vi')).toBe('Đã tạo')
    expect(localizeEntityType('ChangeRequest', tVi)).toBe('Yêu cầu thay đổi')
    expect(localizeSystemText('Created phase API rollout', tVi, 'vi')).toBe('Đã tạo giai đoạn API rollout')
    expect(localizeSystemText('Grant investor on portfolio Alpha', tVi, 'vi')).toBe('Đã thêm nhà đầu tư vào danh mục Alpha')
  })
})
