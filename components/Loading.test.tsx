import { render, screen } from '@testing-library/react'
import Loading, { Skeleton } from './Loading'

describe('Loading', () => {
  it('renders the title as a heading when provided', () => {
    render(<Loading title="Vacancies">content</Loading>)
    expect(screen.getByRole('heading', { name: 'Vacancies' })).toBeInTheDocument()
  })

  it('renders a skeleton placeholder when no title is provided', () => {
    const { container } = render(<Loading>content</Loading>)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(container.querySelector('[class*="skeleton"]')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Loading title="Page"><p>child content</p></Loading>)
    expect(screen.getByText('child content')).toBeInTheDocument()
  })
})

describe('Skeleton', () => {
  it('renders a div with the skeleton class', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[class*="skeleton"]')).toBeInTheDocument()
  })

  it('applies inline styles when provided', () => {
    const { container } = render(<Skeleton style={{ width: '10rem' }} />)
    const el = container.firstChild as HTMLElement
    expect(el.style.width).toBe('10rem')
  })
})
