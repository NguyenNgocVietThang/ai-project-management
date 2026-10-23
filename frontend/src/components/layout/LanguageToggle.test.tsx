import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LanguageToggle } from './LanguageToggle'

const { saveLocale, refresh } = vi.hoisted(() => ({ saveLocale: vi.fn(), refresh: vi.fn() }))

vi.mock('@/i18n/actions', () => ({ setLocale: saveLocale }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))
vi.mock('next-intl', () => ({
  useLocale: () => 'vi',
  useTranslations: () => (key: string) => ({ label: 'Language', en: 'English', vi: 'Tiếng Việt' })[key],
}))

beforeEach(() => { vi.clearAllMocks() })

describe('language switching', () => {
  it('blocks another selection while the locale cookie is being saved', async () => {
    let finishSave!: () => void
    saveLocale.mockReturnValue(new Promise<void>((resolve) => { finishSave = resolve }))
    render(<LanguageToggle />)
    const select = screen.getByRole('combobox', { name: 'Language' })
    const user = userEvent.setup()

    await user.selectOptions(select, 'en')
    expect(saveLocale).toHaveBeenCalledWith('en')
    expect(select).toBeDisabled()
    await user.selectOptions(select, 'vi')
    expect(saveLocale).toHaveBeenCalledTimes(1)

    await act(async () => { finishSave() })
    expect(select).toBeEnabled()
  })
})
