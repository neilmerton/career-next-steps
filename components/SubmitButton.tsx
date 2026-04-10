'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  label: string
  pendingLabel?: string
  className?: string
}

export default function SubmitButton({ label, pendingLabel, className }: Props) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending && pendingLabel ? pendingLabel : label}
    </button>
  )
}
