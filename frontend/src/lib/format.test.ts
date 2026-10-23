import { describe, expect, it } from 'vitest'
import { formatDate, formatMoney, formatStatus } from './format'

describe('locale-aware display values', () => {
  it('formats currency according to the selected language', () => {
    for (const locale of ['vi', 'en']) {
      expect(formatMoney(1250000, 'VND', locale)).toBe(new Intl.NumberFormat(locale, {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0,
      }).format(1250000))
    }
  })

  it('formats the same calendar day according to the selected language', () => {
    const value = '2026-10-23'
    const date = new Date(2026, 9, 23)
    for (const locale of ['vi', 'en']) {
      expect(formatDate(value, locale)).toBe(new Intl.DateTimeFormat(locale, {
        year: 'numeric', month: 'short', day: 'numeric',
      }).format(date))
    }
  })

  it('localizes missing money and dates', () => {
    expect(formatMoney(null, 'VND', 'vi')).toBe('Chưa đặt')
    expect(formatDate(null, 'vi')).toBe('Chưa đặt')
    expect(formatMoney(null, 'VND', 'en')).toBe('Not set')
    expect(formatDate(undefined, 'en')).toBe('Not set')
  })

  it('translates canonical status values rather than displaying the API enum', () => {
    expect(formatStatus('IN_PROGRESS', 'vi')).toBe('Đang thực hiện')
    expect(formatStatus('COMPLETED', 'vi')).toBe('Hoàn thành')
    expect(formatStatus('IN_PROGRESS', 'en')).toBe('In Progress')
  })
})
