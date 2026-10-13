import { getTranslations } from 'next-intl/server'
import { SkeletonPage } from '@/components/ui/Skeleton'

export default async function SegmentLoading() {
  const t = await getTranslations('common')
  return <SkeletonPage label={t('loading')} variant="table" />
}
