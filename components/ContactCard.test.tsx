import { render, screen } from '@testing-library/react'
import ContactCard from './ContactCard'
import type { Contact } from '@/types/database'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const base: Contact = {
  id: 'c1',
  user_id: 'u1',
  name: 'Jane Smith',
  company: 'Recruiter Co',
  email: 'jane@example.com',
  phone: '07700 000000',
  next_contact_date: null,
  created_at: '2026-01-01T00:00:00.000Z',
}

describe('ContactCard', () => {
  it('renders the contact name', () => {
    render(<ContactCard contact={base} />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('links to the contact detail page', () => {
    render(<ContactCard contact={base} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/contacts/c1')
  })

  it('renders the company name when present', () => {
    render(<ContactCard contact={base} />)
    expect(screen.getByText('Recruiter Co')).toBeInTheDocument()
  })

  it('does not render a company when company is null', () => {
    render(<ContactCard contact={{ ...base, company: null }} />)
    expect(screen.queryByText('Recruiter Co')).not.toBeInTheDocument()
  })

  it('renders the email address when present', () => {
    render(<ContactCard contact={base} />)
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('renders the phone number when present', () => {
    render(<ContactCard contact={base} />)
    expect(screen.getByText('07700 000000')).toBeInTheDocument()
  })

  it('does not render contact meta when both email and phone are null', () => {
    render(<ContactCard contact={{ ...base, email: null, phone: null }} />)
    expect(screen.queryByText('jane@example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('07700 000000')).not.toBeInTheDocument()
  })

  it('renders the next contact date when present', () => {
    render(<ContactCard contact={{ ...base, next_contact_date: '2026-12-01' }} />)
    expect(screen.getByText('1 Dec 2026')).toBeInTheDocument()
  })

  it('does not render a date badge when next_contact_date is null', () => {
    render(<ContactCard contact={base} />)
    // formatDate on any date would return "D MMM YYYY" — if no badge, no such text
    expect(screen.queryByText(/\d+ \w+ \d{4}/)).not.toBeInTheDocument()
  })

  it('renders the date badge for an upcoming (non-overdue) contact', () => {
    render(<ContactCard contact={{ ...base, next_contact_date: '2099-01-01' }} />)
    expect(screen.getByText('1 Jan 2099')).toBeInTheDocument()
  })

  it('renders the date badge for an overdue contact', () => {
    render(<ContactCard contact={{ ...base, next_contact_date: '2000-01-01' }} />)
    expect(screen.getByText('1 Jan 2000')).toBeInTheDocument()
  })
})
