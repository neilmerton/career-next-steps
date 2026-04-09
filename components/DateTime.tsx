'use client'

interface Props {
  isoStr: string
  className?: string
}

/** Renders an ISO datetime string formatted to the user's local timezone. */
export default function DateTime({ isoStr, className }: Props) {
  const date = new Date(isoStr)
  const formatted = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return <time dateTime={isoStr} className={className}>{formatted}</time>
}
