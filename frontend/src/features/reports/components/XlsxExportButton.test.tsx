import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/auth.types'
import messages from '../../../../messages/vi.json'
import { XlsxExportButton } from './XlsxExportButton'

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@/services/api', () => ({ api }))

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale="vi" messages={messages}><XlsxExportButton projectId={5} /></NextIntlClientProvider>
    </QueryClientProvider>,
  )
}

const job = (status: string, extra = {}) => ({ data: { id: 9, kind: 'report.xlsx', status, project_id: 5, error_code: null, result: null, ...extra } })

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
  useAuthStore.setState({ user: { id: 1 } as User, accessToken: 'fixture', hasHydrated: true })
})

describe('nút xuất XLSX', () => {
  it('bấm xuất gọi API theo ngôn ngữ, hiện trạng thái đang tạo và lưu job id', async () => {
    api.post.mockResolvedValue({ data: { job_id: 9, status: 'queued' } })
    api.get.mockResolvedValue(job('running'))
    setup()
    await userEvent.selectOptions(screen.getByRole('combobox'), 'en')
    await userEvent.click(screen.getByRole('button', { name: /Xuất XLSX/ }))
    expect(api.post).toHaveBeenCalledWith('/projects/5/reports/xlsx', { language: 'en' })
    expect(await screen.findByRole('button', { name: /Đang tạo/ })).toBeDisabled()
    expect(window.localStorage.getItem('xlsx-export-job:5')).toBe('9')
    expect(api.get).toHaveBeenCalledWith('/jobs/9', expect.anything())
  })

  it('khôi phục job đã xong sau khi tải lại và tải blob qua client có xác thực', async () => {
    window.localStorage.setItem('xlsx-export-job:5', '9')
    api.get.mockImplementation((url: string) => url === '/jobs/9'
      ? Promise.resolve(job('succeeded', { result: { filename: 'bao-cao.xlsx' } }))
      : Promise.resolve({ data: new Blob(['x']) }))
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    setup()
    await userEvent.click(await screen.findByRole('button', { name: /Tải về/ }))
    await waitFor(() => expect(click).toHaveBeenCalled())
    expect(api.get).toHaveBeenCalledWith('/projects/5/reports/xlsx/9/download', { responseType: 'blob' })
    click.mockRestore()
  })

  it('hiển thị lỗi đã dịch khi job thất bại', async () => {
    window.localStorage.setItem('xlsx-export-job:5', '9')
    api.get.mockResolvedValue(job('failed', { error_code: 'storage_error' }))
    setup()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không lưu được tệp báo cáo')
  })

  it('hiển thị lỗi quyền khi API từ chối', async () => {
    api.post.mockRejectedValue({ response: { status: 403, data: { detail: 'Forbidden' } } })
    setup()
    await userEvent.click(screen.getByRole('button', { name: /Xuất XLSX/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Bạn không có quyền')
  })
})
