import { AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  action?: ReactNode
  className?: string
}

/** Trạng thái lỗi ở cấp khối nội dung; trang quyết định thông điệp và cách thử lại. */
export function ErrorState({
  title = "Không tải được dữ liệu",
  description,
  onRetry,
  retryLabel = "Thử lại",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">{title}</p>
        {description ? <p className="max-w-md text-[15px] text-muted-foreground">{description}</p> : null}
      </div>
      {onRetry ? (
        <Button variant="outline" className="mt-1 h-11" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
