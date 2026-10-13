import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createFireworks, isInteractiveTarget } from './fireworks'
import { FIREWORKS_STORAGE_KEY, useFireworksPreference } from './useFireworksPreference'

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''
})

describe('isInteractiveTarget', () => {
  it('bỏ qua phần tử tương tác và con của chúng, nhận vùng trống', () => {
    document.body.innerHTML = `
      <main id="free"><p id="text">Văn bản</p>
        <button id="btn"><span id="inner">Lưu</span></button>
        <a id="link" href="#">Liên kết</a>
        <div role="dialog"><div id="in-dialog"></div></div>
        <div data-no-fireworks><div id="opt-out"></div></div>
        <div contenteditable="true" id="editable"></div>
        <input id="field" />
      </main>`
    const byId = (id: string) => document.getElementById(id)
    expect(isInteractiveTarget(byId('free'))).toBe(false)
    expect(isInteractiveTarget(byId('text'))).toBe(false)
    expect(isInteractiveTarget(byId('text')!.firstChild)).toBe(false)
    for (const id of ['btn', 'inner', 'link', 'in-dialog', 'opt-out', 'editable', 'field']) {
      expect(isInteractiveTarget(byId(id))).toBe(true)
    }
    expect(isInteractiveTarget(null)).toBe(false)
  })
})

describe('useFireworksPreference', () => {
  it('mặc định bật và lưu lựa chọn vào localStorage', () => {
    const { result } = renderHook(() => useFireworksPreference())
    expect(result.current.enabled).toBe(true)
    expect(result.current.effectiveEnabled).toBe(true)
    act(() => result.current.setEnabled(false))
    expect(result.current.enabled).toBe(false)
    expect(localStorage.getItem(FIREWORKS_STORAGE_KEY)).toBe('false')
  })

  it('khôi phục lựa chọn đã lưu và đồng bộ từ tab khác', () => {
    localStorage.setItem(FIREWORKS_STORAGE_KEY, 'false')
    const { result } = renderHook(() => useFireworksPreference())
    expect(result.current.enabled).toBe(false)
    act(() => {
      localStorage.setItem(FIREWORKS_STORAGE_KEY, 'true')
      window.dispatchEvent(new StorageEvent('storage', { key: FIREWORKS_STORAGE_KEY, newValue: 'true' }))
    })
    expect(result.current.enabled).toBe(true)
  })
})

describe('createFireworks', () => {
  it('không ném lỗi khi canvas không có context 2D', () => {
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'getContext').mockReturnValue(null)
    const engine = createFireworks(canvas, { getMode: () => 'light' })
    expect(() => {
      engine.burst(100, 100)
      engine.resize()
      engine.destroy()
    }).not.toThrow()
  })
})
