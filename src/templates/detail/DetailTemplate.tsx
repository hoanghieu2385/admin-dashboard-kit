import type { ReactNode } from "react"
import { SectionCard } from "@/components/common/SectionCard"
import { DescriptionList, type DescriptionItem } from "@/components/data-display/DescriptionList"
import { ErrorState } from "@/components/data-display/ErrorState"
import { LoadingState } from "@/components/data-display/LoadingState"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

export interface DetailTemplateProps {
  title: string
  description?: string
  /** Badge trạng thái đặt cạnh action. */
  status?: ReactNode
  actions?: ReactNode
  /** Cột phụ: các cặp nhãn/giá trị. */
  metadata?: DescriptionItem[]
  metadataTitle?: string
  /** Nội dung liên quan (đơn hàng, hoạt động…) — trang tự dựng SectionCard. */
  related?: ReactNode
  /** Các section chính. */
  children?: ReactNode
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  className?: string
}

export function DetailTemplate({
  title,
  description,
  status,
  actions,
  metadata,
  metadataTitle = "Thông tin",
  related,
  children,
  isLoading = false,
  error,
  onRetry,
  className,
}: DetailTemplateProps) {
  const hasAside = Boolean(metadata?.length) || Boolean(related)
  const headerActions =
    status || actions ? (
      <div className="flex flex-wrap items-center gap-2">
        {status}
        {actions}
      </div>
    ) : undefined

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader title={title} description={description}>
        {headerActions}
      </PageHeader>

      {error ? (
        <ErrorState description={error} onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingState rows={6} label="Đang tải chi tiết" />
      ) : (
        <div className={cn("grid gap-6", hasAside && "xl:grid-cols-3")}>
          {children ? (
            <div className={cn("flex min-w-0 flex-col gap-6", hasAside && "xl:col-span-2")}>{children}</div>
          ) : null}

          {hasAside ? (
            <div className="flex min-w-0 flex-col gap-6">
              {metadata?.length ? (
                <SectionCard title={metadataTitle}>
                  <DescriptionList items={metadata} columns={1} />
                </SectionCard>
              ) : null}
              {related}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
