import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import vi from '../../messages/vi.json'

function flatten(catalog: object, prefix = ''): Record<string, string> {
  return Object.fromEntries(Object.entries(catalog).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [[path, value]] : Object.entries(flatten(value, path))
  }))
}

const english = flatten(en)
const vietnamese = flatten(vi)
const argumentsIn = (message: string) => [...new Set(
  Array.from(message.matchAll(/\{\s*([a-zA-Z_]\w*)\s*[,}]/g), (match) => match[1]),
)].sort()

describe('bilingual message catalogs', () => {
  it('provides the same message keys in both languages', () => {
    expect(Object.keys(vietnamese).sort()).toEqual(Object.keys(english).sort())
  })

  it('keeps interpolation arguments consistent so neither locale loses dynamic values', () => {
    const mismatches = Object.entries(english).flatMap(([key, message]) => {
      const translated = vietnamese[key]
      return translated !== undefined && JSON.stringify(argumentsIn(message)) !== JSON.stringify(argumentsIn(translated))
        ? [key] : []
    })
    expect(mismatches).toEqual([])
  })

  it('contains no blank translations', () => {
    const blanks = [english, vietnamese].flatMap((catalog) => Object.entries(catalog)
      .filter(([, message]) => !message.trim()).map(([key]) => key))
    expect(blanks).toEqual([])
  })
})
