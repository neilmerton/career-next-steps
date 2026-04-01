import styles from './layout.module.css'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <a href="/dashboard">Dashboard</a>
        <a href="/vacancies">Job Vacancies</a>
        <a href="/contacts">Contacts</a>
      </nav>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
