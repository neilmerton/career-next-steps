import NavLinks from '@/components/NavLinks'
import { signOut } from '@/lib/actions/auth'
import Link from 'next/link'
import styles from './layout.module.css'
import { Icon } from '@/components/Icon'
import { Logout01Icon } from '@hugeicons/core-free-icons'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <Link className={styles.homeLink} href="/">Career Next Steps</Link>
        <div className={styles.navLinks}>
          <NavLinks />
        </div>
        <form action={signOut}>
          <button type="submit" className={styles.logoutButton}>
            <Icon icon={Logout01Icon} />
            <span>Log out</span>
          </button>
        </form>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
