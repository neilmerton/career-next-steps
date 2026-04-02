'use client'

import { ContactBookIcon, HomeIcon, PermanentJobIcon } from '@hugeicons/core-free-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'
import styles from './NavLinks.module.css'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: '/vacancies', label: 'Job Vacancies', icon: PermanentJobIcon },
  { href: '/contacts', label: 'Contacts', icon: ContactBookIcon },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map(({ href, icon, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname.startsWith(href) ? styles.active : styles.link}
        >
          <Icon icon={icon} />
          <span>{label}</span>
        </Link>
      ))}
    </>
  )
}
