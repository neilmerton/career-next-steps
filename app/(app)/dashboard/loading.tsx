import Loading, { Skeleton } from '@/components/Loading'

export default function DashboardLoading() {
  return (
    <Loading title="Dashboard">
      <Skeleton style={{ height: '7rem', marginBottom: '2rem' }} />
      <Skeleton style={{ height: '5rem', marginBottom: '2rem' }} />
      <Skeleton style={{ height: '10rem' }} />
    </Loading>
  )
}
