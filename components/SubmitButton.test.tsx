import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import SubmitButton from './SubmitButton'

vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>()
  return { ...actual, useFormStatus: vi.fn().mockReturnValue({ pending: false }) }
})

import { useFormStatus } from 'react-dom'
const mockUseFormStatus = vi.mocked(useFormStatus)

describe('SubmitButton', () => {
  beforeEach(() => {
    mockUseFormStatus.mockReturnValue({ pending: false, data: null, method: null, action: null })
  })

  it('renders the label when not pending', () => {
    render(<SubmitButton label="Save" />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('is enabled when not pending', () => {
    render(<SubmitButton label="Save" />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('applies the className', () => {
    render(<SubmitButton label="Save" className="btn-primary" />)
    expect(screen.getByRole('button')).toHaveClass('btn-primary')
  })

  it('is disabled when pending', () => {
    mockUseFormStatus.mockReturnValue({ pending: true, data: null, method: null, action: null })
    render(<SubmitButton label="Save" />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows pendingLabel when pending and pendingLabel is provided', () => {
    mockUseFormStatus.mockReturnValue({ pending: true, data: null, method: null, action: null })
    render(<SubmitButton label="Save" pendingLabel="Saving…" />)
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeInTheDocument()
  })

  it('falls back to label when pending but no pendingLabel provided', () => {
    mockUseFormStatus.mockReturnValue({ pending: true, data: null, method: null, action: null })
    render(<SubmitButton label="Save" />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
