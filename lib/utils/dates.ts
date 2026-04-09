/** Format a YYYY-MM-DD date string as "15 Apr 2026" */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Format an ISO datetime string as "14:30" */
export function formatTime(isoStr: string): string {
  const date = new Date(isoStr)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

/** Format an ISO datetime string as "15 Apr 2026, 14:30" */
export function formatDateTime(isoStr: string): string {
  const date = new Date(isoStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Returns true if a YYYY-MM-DD date is today or in the past */
export function isOverdue(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date <= today
}

/** Add days to a date string or Date, returning YYYY-MM-DD */
export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
