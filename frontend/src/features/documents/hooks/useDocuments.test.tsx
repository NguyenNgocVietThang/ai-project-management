import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GeneratedDocument } from '@/features/documents/types'
import { documentFilename } from '@/features/documents/documents'
import { hasActiveDocument, useDownloadDocument, useProjectDocuments } from './useDocuments'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@/services/api', () => ({ api }))

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const base = { id: 1, doc_type: 'SRS', version: 2, language: 'en', status: 'ready' } as GeneratedDocument

beforeEach(() => vi.clearAllMocks())

describe('hook tài liệu', () => {
  it('nhận biết tài liệu đang sinh để poll', () => {
    expect(hasActiveDocument([{ ...base, status: 'generating' }])).toBe(true)
    expect(hasActiveDocument([base, { ...base, status: 'needs_clarification' }])).toBe(false)
    expect(documentFilename(base)).toBe('SRS-v2-en.docx')
  })

  it('đọc danh sách từ API (khôi phục sau khi tải lại trang)', async () => {
    api.get.mockResolvedValue({ data: [base] })
    const { result } = renderHook(() => useProjectDocuments(7), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual([base]))
    expect(api.get).toHaveBeenCalledWith('/projects/7/documents')
  })

  it('tải tệp qua client có xác thực dạng blob', async () => {
    api.get.mockResolvedValue({ data: new Blob(['x']) })
    const createUrl = vi.fn(() => 'blob:x')
    const revoke = vi.fn()
    Object.assign(URL, { createObjectURL: createUrl, revokeObjectURL: revoke })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    const { result } = renderHook(() => useDownloadDocument(7), { wrapper })
    await result.current.mutateAsync(base)
    expect(api.get).toHaveBeenCalledWith('/projects/7/documents/1/download', { responseType: 'blob' })
    expect(createUrl).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    click.mockRestore()
  })
})
