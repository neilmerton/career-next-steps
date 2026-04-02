import NavLinks from '@/components/NavLinks'
import { signOut } from '@/lib/actions/auth'
import Link from 'next/link'
import styles from './layout.module.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <Link className={styles.homeLink} href="/">Career Next Steps</Link>
        <div className={styles.navLinks}>
          <NavLinks />
        </div>
        <form action={signOut} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutButton}>Log out</button>
        </form>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
