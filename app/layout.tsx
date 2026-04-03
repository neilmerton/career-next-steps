import type { Metadata } from 'next'
import './globals.css'

const UA = navigator.userAgent;

const IOS = UA.match(/iPhone|iPad|iPod/);
const ANDROID = UA.match(/Android/);

export const PLATFORM = IOS ? 'ios' : ANDROID ? 'android' : 'unknown';

const standalone = global.window && window.matchMedia('(display-mode: standalone)').matches;

export const INSTALLED = !!(standalone || (IOS && !UA.match(/Safari/)));

export const metadata: Metadata = {
  title: {
    template: '%s | Career Next Steps',
    default: 'Career Next Steps',
  },
  description: 'Track your job applications and recruitment conversations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={INSTALLED ? "pwa-ios" : ""}>{children}</body>
    </html>
  )
}
