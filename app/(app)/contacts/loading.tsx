import Loading, { Skeleton } from '@/components/Loading'

export default function ContactsLoading() {
  return (
    <Loading title="Contacts">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} style={{ height: '3rem', marginBottom: '0.75rem' }} />
      ))}
    </Loading>
  )
}
