import type { ReactNode } from "react"
import { LoadingState } from "@/components/data-display/LoadingState"
import { StatCard, type StatCardProps } from "@/components/data-display/StatCard"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

export interface DashboardTemplateProps {
  title: string
  description?: string
  actions?: ReactNode
  /** Số lượng card tùy ý; grid tự xuống dòng. */
  stats?: StatCardProps[]
  /** Vùng chart (thường là SectionCard) chiếm 2/3 khi có `recentActivity`. */
  charts?: ReactNode
  recentActivity?: ReactNode
  /** Section tùy biến bên dưới chart/activity. */
  children?: ReactNode
  isLoading?: boolean
  className?: string
}

export function DashboardTemplate({
  title,
  description,
  actions,
  stats,
  charts,
  recentActivity,
  children,
  isLoading = false,
  className,
}: DashboardTemplateProps) {
  const split = Boolean(charts) && Boolean(recentActivity)

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader title={title} description={description}>
        {actions}
      </PageHeader>

      {isLoading ? (
        <LoadingState rows={6} label="Đang tải bảng điều khiển" />
      ) : (
        <>
          {stats?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCard key={`${stat.title}-${index}`} {...stat} />
              ))}
            </div>
          ) : null}

          {charts || recentActivity ? (
            <div className={cn("grid gap-6", split && "xl:grid-cols-3")}>
              {charts ? <div className={cn("min-w-0", split && "xl:col-span-2")}>{charts}</div> : null}
              {recentActivity ? <div className="min-w-0">{recentActivity}</div> : null}
            </div>
          ) : null}

          {children ? <div className="flex flex-col gap-6">{children}</div> : null}
        </>
      )}
    </div>
  )
}
