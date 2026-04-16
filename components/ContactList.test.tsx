import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ContactList from './ContactList'
import type { Contact } from '@/types/database'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/lib/queries/contacts', () => ({ useContacts: vi.fn() }))

import { useContacts } from '@/lib/queries/contacts'
const mockUseContacts = vi.mocked(useContacts)

const contacts: Contact[] = [
  {
    id: 'c1', user_id: 'u1', name: 'Jane Smith', company: 'Recruiter Co',
    email: 'jane@example.com', phone: null, next_contact_date: null,
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'c2', user_id: 'u1', name: 'Bob Jones', company: null,
    email: null, phone: null, next_contact_date: null,
    created_at: '2026-01-02T00:00:00.000Z',
  },
]

describe('ContactList', () => {
  it('renders nothing while pending', () => {
    mockUseContacts.mockReturnValue({ data: [], isPending: true } as any)
    const { container } = render(<ContactList />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when there are no contacts', () => {
    mockUseContacts.mockReturnValue({ data: [], isPending: false } as any)
    render(<ContactList />)
    expect(screen.getByText(/no contacts yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add one/i })).toHaveAttribute('href', '/contacts/new')
  })

  it('renders a list item for each contact', () => {
    mockUseContacts.mockReturnValue({ data: contacts, isPending: false } as any)
    render(<ContactList />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('renders each contact name', () => {
    mockUseContacts.mockReturnValue({ data: contacts, isPending: false } as any)
    render(<ContactList />)
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Jones')).toBeInTheDocument()
  })

  it('links each card to the correct contact detail page', () => {
    mockUseContacts.mockReturnValue({ data: contacts, isPending: false } as any)
    render(<ContactList />)
    const links = screen.getAllByRole('link').filter(l => l.getAttribute('href')?.startsWith('/contacts/'))
    expect(links.some(l => l.getAttribute('href') === '/contacts/c1')).toBe(true)
    expect(links.some(l => l.getAttribute('href') === '/contacts/c2')).toBe(true)
  })
})
