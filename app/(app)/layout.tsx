import { signOut } from '@/lib/actions/auth'
import styles from './layout.module.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          <a href="/dashboard">Dashboard</a>
          <a href="/vacancies">Job Vacancies</a>
          <a href="/contacts">Contacts</a>
        </div>
        <form action={signOut} className={styles.logoutForm}>
          <button type="submit" className={styles.logoutButton}>Log out</button>
        </form>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
