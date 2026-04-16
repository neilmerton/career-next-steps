import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import VacancyList from './VacancyList'
import type { JobVacancy } from '@/types/database'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/lib/queries/vacancies', () => ({ useVacancies: vi.fn() }))

import { useVacancies } from '@/lib/queries/vacancies'
const mockUseVacancies = vi.mocked(useVacancies)

const vacancies: JobVacancy[] = [
  {
    id: 'v1', user_id: 'u1', title: 'Senior Engineer', description: null,
    date_applied: '2026-03-01', company: 'Acme Ltd', contact_id: null,
    source: 'linkedin', source_other: null, status: 'applied',
    created_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'v2', user_id: 'u1', title: 'Frontend Developer', description: null,
    date_applied: '2026-03-10', company: 'Beta Corp', contact_id: null,
    source: 'indeed', source_other: null, status: 'interviewing',
    created_at: '2026-03-10T00:00:00.000Z',
  },
  {
    id: 'v3', user_id: 'u1', title: 'Tech Lead', description: null,
    date_applied: '2026-03-15', company: 'Gamma Inc', contact_id: null,
    source: 'referral', source_other: null, status: 'applied',
    created_at: '2026-03-15T00:00:00.000Z',
  },
]

describe('VacancyList', () => {
  it('renders nothing while pending', () => {
    mockUseVacancies.mockReturnValue({ data: [], isPending: true } as any)
    const { container } = render(<VacancyList />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the empty state when there are no vacancies', () => {
    mockUseVacancies.mockReturnValue({ data: [], isPending: false } as any)
    render(<VacancyList />)
    expect(screen.getByText(/no vacancies yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /add one/i })).toHaveAttribute('href', '/vacancies/new')
  })

  it('renders a group heading for each status that has entries', () => {
    mockUseVacancies.mockReturnValue({ data: vacancies, isPending: false } as any)
    render(<VacancyList />)
    expect(screen.getByRole('heading', { name: /applied/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /interviewing/i })).toBeInTheDocument()
  })

  it('does not render group headings for statuses with no entries', () => {
    mockUseVacancies.mockReturnValue({ data: vacancies, isPending: false } as any)
    render(<VacancyList />)
    expect(screen.queryByRole('heading', { name: /offered/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /rejected/i })).not.toBeInTheDocument()
  })

  it('renders the count next to each group heading', () => {
    mockUseVacancies.mockReturnValue({ data: vacancies, isPending: false } as any)
    render(<VacancyList />)
    // Two vacancies are 'applied', one is 'interviewing'
    const appliedHeading = screen.getByRole('heading', { name: /applied/i })
    expect(appliedHeading).toHaveTextContent('2')
    const interviewingHeading = screen.getByRole('heading', { name: /interviewing/i })
    expect(interviewingHeading).toHaveTextContent('1')
  })

  it('renders a card for each vacancy', () => {
    mockUseVacancies.mockReturnValue({ data: vacancies, isPending: false } as any)
    render(<VacancyList />)
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('Tech Lead')).toBeInTheDocument()
  })
})
