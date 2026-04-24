'use client'

import { useState } from 'react'

interface Props {
  id?: string
  name: string
}

export default function DateTimeLocalInput({ id, name }: Props) {
  const [isoValue, setIsoValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setIsoValue(raw ? new Date(raw).toISOString() : '')
  }

  return (
    <>
      <input id={id} type="datetime-local" placeholder=" " onChange={handleChange} />
      <input type="hidden" name={name} value={isoValue} />
    </>
  )
}
