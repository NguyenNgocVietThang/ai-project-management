'use client'

import dynamic from 'next/dynamic'

/** Recharts (~400KB) nằm sau ranh giới này.
 *
 *  `ssr: false` vì biểu đồ đo container để tự co giãn — render trên server chỉ tạo
 *  ra một lần vẽ thừa rồi bị thay ngay. Kết quả: thư viện nằm ở chunk riêng, tải
 *  sau lần vẽ đầu tiên thay vì chặn nó. */
export const ProjectOverviewCharts = dynamic(
  () =>
    import('@/features/dashboard/components/ProjectOverviewCharts').then(
      (module) => module.ProjectOverviewCharts
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 xl:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[280px] animate-pulse rounded-xl border bg-muted/30" />
        ))}
      </div>
    ),
  }
)
