'use client'

interface Props {
  isoStr: string
  /** 'datetime' (default) — "15 Apr 2026, 14:30" | 'time' — "14:30" */
  format?: 'datetime' | 'time'
  className?: string
}

/** Renders an ISO datetime string formatted to the user's local timezone. */
export default function DateTime({ isoStr, format = 'datetime', className }: Props) {
  const date = new Date(isoStr)
  const formatted = format === 'time'
    ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
  return <time dateTime={isoStr} className={className}>{formatted}</time>
}
