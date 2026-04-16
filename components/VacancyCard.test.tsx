import { render, screen } from '@testing-library/react'
import VacancyCard from './VacancyCard'
import type { JobVacancy } from '@/types/database'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const base: JobVacancy = {
  id: 'v1',
  user_id: 'u1',
  title: 'Senior Engineer',
  description: null,
  date_applied: '2026-03-15',
  company: 'Acme Ltd',
  contact_id: null,
  source: 'linkedin',
  source_other: null,
  status: 'applied',
  created_at: '2026-03-15T09:00:00.000Z',
}

describe('VacancyCard', () => {
  it('renders the job title', () => {
    render(<VacancyCard vacancy={base} />)
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
  })

  it('renders the company name', () => {
    render(<VacancyCard vacancy={base} />)
    expect(screen.getByText('Acme Ltd')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(<VacancyCard vacancy={base} />)
    expect(screen.getByText('Applied')).toBeInTheDocument()
  })

  it('renders the applied date', () => {
    render(<VacancyCard vacancy={base} />)
    // Match the date span specifically — StatusBadge also contains "Applied"
    expect(screen.getByText(/15 Mar 2026/)).toBeInTheDocument()
  })

  it('links to the vacancy detail page', () => {
    render(<VacancyCard vacancy={base} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/vacancies/v1')
  })

  it('does not render a company when company is null', () => {
    render(<VacancyCard vacancy={{ ...base, company: null }} />)
    expect(screen.queryByText('Acme Ltd')).not.toBeInTheDocument()
  })

  it('does not render an applied date when date_applied is null', () => {
    render(<VacancyCard vacancy={{ ...base, date_applied: null }} />)
    expect(screen.queryByText(/\d+ \w+ \d{4}/)).not.toBeInTheDocument()
  })
})
