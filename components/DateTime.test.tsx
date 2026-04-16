import { render, screen } from '@testing-library/react'
import DateTime from './DateTime'

const ISO = '2026-04-16T14:30:00.000Z'

describe('DateTime', () => {
  it('renders a <time> element with the correct dateTime attribute', () => {
    render(<DateTime isoStr={ISO} />)
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', ISO)
  })

  it('applies a className to the <time> element', () => {
    render(<DateTime isoStr={ISO} className="my-class" />)
    expect(screen.getByRole('time')).toHaveClass('my-class')
  })

  it('renders non-empty text content in datetime format (default)', () => {
    render(<DateTime isoStr={ISO} />)
    expect(screen.getByRole('time').textContent).not.toBe('')
  })

  it('renders non-empty text content in time-only format', () => {
    render(<DateTime isoStr={ISO} format="time" />)
    expect(screen.getByRole('time').textContent).not.toBe('')
  })

  it('renders shorter text for time format than datetime format', () => {
    const { rerender } = render(<DateTime isoStr={ISO} format="datetime" />)
    const datetimeLength = screen.getByRole('time').textContent!.length

    rerender(<DateTime isoStr={ISO} format="time" />)
    const timeLength = screen.getByRole('time').textContent!.length

    expect(timeLength).toBeLessThan(datetimeLength)
  })
})
