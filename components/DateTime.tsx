'use client'

import { useSyncExternalStore } from 'react'

interface Props {
  isoStr: string
  /** 'datetime' (default) — "15 Apr 2026, 14:30" | 'time' — "14:30" */
  format?: 'datetime' | 'time'
  className?: string
}

const subscribe = () => () => {}

function formatDate(isoStr: string, format: 'datetime' | 'time'): string {
  const date = new Date(isoStr)
  return format === 'time'
    ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
}

/** Renders an ISO datetime string formatted to the user's local timezone. */
export default function DateTime({ isoStr, format = 'datetime', className }: Props) {
  const formatted = useSyncExternalStore(
    subscribe,
    () => formatDate(isoStr, format),
    () => '',
  )

  return <time dateTime={isoStr} className={className}>{formatted}</time>
}
