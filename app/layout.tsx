import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Career Next Steps',
  description: 'Track your job applications and recruitment conversations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
