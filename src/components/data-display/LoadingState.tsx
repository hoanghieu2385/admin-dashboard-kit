import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface LoadingStateProps {
  /** Số dòng skeleton. */
  rows?: number
  label?: string
  className?: string
}

/** Khối skeleton dùng chung: giữ đúng nhịp với nội dung thật để tránh nhảy layout. */
export function LoadingState({ rows = 5, label = "Đang tải dữ liệu", className }: LoadingStateProps) {
  return (
    <div role="status" aria-label={label} className={cn("flex flex-col gap-3", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
