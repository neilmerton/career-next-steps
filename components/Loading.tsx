import styles from './Loading.module.css'

interface SkeletonProps {
  style?: React.CSSProperties
}

export function Skeleton({ style }: SkeletonProps) {
  return <div className={styles.skeleton} style={style} />
}

interface LoadingProps {
  title?: string
  children: React.ReactNode
}

export default function Loading({ title, children }: LoadingProps) {
  return (
    <div className="page-container">
      <header className={styles.pageHeader}>
        {title
          ? <h1 className="page-title">{title}</h1>
          : <Skeleton style={{ width: '10rem', height: '2rem', marginBottom: '1.5rem' }} />
        }
      </header>
      {children}
    </div>
  )
}
