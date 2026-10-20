import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import messages from '../../../../messages/en.json'
import { ProjectNavigation } from './ProjectNavigation'

function renderNav(pathname = '/projects/2/wbs') {
  return render(<NextIntlClientProvider locale="en" messages={messages}><ProjectNavigation projectId={2} pathname={pathname} unread={3} /></NextIntlClientProvider>)
}

describe('ProjectNavigation', () => {
  it('keeps all thirteen existing destinations within two actions', async () => {
    renderNav()
    const user = userEvent.setup()
    await user.click(screen.getByText('Planning'))
    expect(screen.getByRole('link', { name: messages.project.wbs })).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByText('More'))
    expect(screen.getByRole('link', { name: /Chat/ })).toHaveTextContent('3')
    const links = within(screen.getByRole('navigation')).getAllByRole('link', { hidden: true })
    expect(links).toHaveLength(13)
    expect(new Set(links.map(link => link.getAttribute('href'))).size).toBe(13)
  })

  it.each(['settings', 'documents'])('shows direct %s route context and returns focus with Escape', async section => {
    renderNav(`/projects/2/${section}`)
    const user = userEvent.setup()
    const more = screen.getByText('More').closest('summary')!
    await user.click(more)
    expect(screen.getByRole('link', { name: messages.project[section as 'settings' | 'documents'] })).toHaveAttribute('aria-current', 'page')
    await user.keyboard('{Escape}')
    expect(more.closest('details')).not.toHaveAttribute('open')
    expect(more).toHaveFocus()
  })
})
