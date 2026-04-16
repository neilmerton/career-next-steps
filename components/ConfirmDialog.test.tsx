import { render, screen } from '@testing-library/react'
import ConfirmDialog from './ConfirmDialog'

const noop = async () => {}

describe('ConfirmDialog', () => {
  it('renders the trigger button with default label', () => {
    render(<ConfirmDialog entity="contact" action={noop} />)
    expect(screen.getByRole('button', { name: 'Delete contact' })).toBeInTheDocument()
  })

  it('renders the trigger button with a custom triggerLabel', () => {
    render(<ConfirmDialog entity="contact" action={noop} triggerLabel="Remove" />)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  it('renders the dialog title with the entity name', () => {
    render(<ConfirmDialog entity="vacancy" action={noop} />)
    // dialog is closed by default — elements inside are hidden from the a11y tree
    expect(screen.getByRole('heading', { name: 'Delete vacancy?', hidden: true })).toBeInTheDocument()
  })

  it('renders the warning description', () => {
    render(<ConfirmDialog entity="contact" action={noop} />)
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
  })

  it('renders the entity name in the warning description', () => {
    render(<ConfirmDialog entity="contact" action={noop} />)
    expect(screen.getByText(/delete this contact/i)).toBeInTheDocument()
  })

  it('renders a Cancel button inside the dialog', () => {
    render(<ConfirmDialog entity="contact" action={noop} />)
    expect(screen.getByRole('button', { name: 'Cancel', hidden: true })).toBeInTheDocument()
  })

  it('renders a confirm submit button inside the dialog', () => {
    render(<ConfirmDialog entity="contact" action={noop} />)
    const submitButton = screen.getAllByRole('button', { name: 'Delete contact', hidden: true })
      .find(b => b.getAttribute('type') === 'submit')
    expect(submitButton).toBeInTheDocument()
  })

  it('applies a custom triggerClassName to the trigger button', () => {
    render(<ConfirmDialog entity="contact" action={noop} triggerClassName="btn-warning" />)
    const trigger = screen.getAllByRole('button', { hidden: true })
      .find(b => b.getAttribute('command') === 'show-modal')
    expect(trigger).toHaveClass('btn-warning')
  })
})
