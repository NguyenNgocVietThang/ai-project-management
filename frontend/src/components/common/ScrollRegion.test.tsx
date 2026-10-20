import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { describe, expect, it } from 'vitest'
import { ScrollRegion } from './ScrollRegion'

describe('ScrollRegion', () => {
  it('names the keyboard scroll stop and connects a visible scrolling hint', async () => {
    render(<NextIntlClientProvider locale="en" messages={{ remainingUi: { scrollHint: 'Scroll horizontally to see every column.' } }}><ScrollRegion label="Project members"><table><tbody><tr><td>Member</td></tr></tbody></table></ScrollRegion></NextIntlClientProvider>)
    const region = screen.getByRole('region', { name: 'Project members' })
    await userEvent.setup().tab()
    expect(region).toHaveFocus()
    expect(region).toHaveAccessibleDescription('Scroll horizontally to see every column.')
    expect(screen.getByText('Scroll horizontally to see every column.')).toBeVisible()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
