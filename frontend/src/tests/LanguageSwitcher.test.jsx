import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import LanguageSwitcher from '../components/LanguageSwitcher'
import i18n from '../i18n'

describe('LanguageSwitcher', () => {
  afterEach(async () => {
    await i18n.changeLanguage('es')
  })

  it('renders ES and EN buttons', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByText('ES')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('marks the active language as pressed', () => {
    render(<LanguageSwitcher />)
    expect(screen.getByText('ES')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('EN')).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches to English when the EN button is clicked', () => {
    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByText('EN'))

    expect(i18n.resolvedLanguage).toBe('en')
  })

  it('switches back to Spanish when the ES button is clicked', async () => {
    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByText('EN'))
    fireEvent.click(screen.getByText('ES'))

    expect(i18n.resolvedLanguage).toBe('es')
  })
})
