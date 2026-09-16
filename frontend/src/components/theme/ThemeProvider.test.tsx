import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, themeInitScript, useTheme } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
function Status() { const { preference, resolved } = useTheme(); return <output>{preference}:{resolved}</output> }
function Theme() { return <ThemeProvider><ThemeToggle /><Status /></ThemeProvider> }
beforeEach(() => { localStorage.clear(); document.documentElement.className = '' })

describe('theme preferences', () => {
  it('restores saved dark mode, switches to light and persists the choice', async () => {
    localStorage.setItem('theme', 'dark')
    render(<Theme />)
    expect(document.documentElement).toHaveClass('dark')
    await userEvent.setup().click(screen.getByRole('radio', { name: 'light' }))
    expect(document.documentElement).toHaveClass('light')
    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')
  })
  it('supports arrow-key navigation and follows changes from other tabs', async () => {
    render(<Theme />)
    const selected = screen.getByRole('radio', { name: 'system' })
    selected.focus()
    await userEvent.setup().keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'dark' })).toHaveFocus()
    expect(document.documentElement).toHaveClass('dark')
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' })))
    expect(screen.getByRole('status')).toHaveTextContent('light:light')
  })
  it('resolves the OS theme before hydration even when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    new Function(themeInitScript)()
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement).not.toHaveClass('light')
  })
})
