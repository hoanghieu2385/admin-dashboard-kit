import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  pageIndex: number
  pageCount: number
  onPageChange: (pageIndex: number) => void
  className?: string
}

export function Pagination({ pageIndex, pageCount, onPageChange, className }: PaginationProps) {
  const canPrevious = pageIndex > 0
  const canNext = pageIndex < pageCount - 1

  return (
    <nav
      aria-label="Phân trang"
      className={cn("flex flex-wrap items-center justify-between gap-3 px-1", className)}
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        Trang {pageCount === 0 ? 0 : pageIndex + 1} / {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPrevious}
        >
          <ChevronLeft aria-hidden="true" />
          Trước
        </Button>
        <Button
          variant="outline"
          className="h-9"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNext}
        >
          Sau
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
