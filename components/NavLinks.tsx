'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavLinks.module.css'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vacancies', label: 'Job Vacancies' },
  { href: '/contacts', label: 'Contacts' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname.startsWith(href) ? styles.active : styles.link}
        >
          {label}
        </Link>
      ))}
    </>
  )
}
