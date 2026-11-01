import { RotateCcw } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FilterBarProps {
  children: ReactNode
  /** Có `onReset` thì hiện nút "Xoá bộ lọc". */
  onReset?: () => void
  resetLabel?: string
  className?: string
}

export function FilterBar({ children, onReset, resetLabel = "Xoá bộ lọc", className }: FilterBarProps) {
  return (
    <div className={cn("flex w-full flex-wrap items-end gap-2", className)}>
      {children}
      {onReset ? (
        <Button type="button" variant="ghost" className="h-9" onClick={onReset}>
          <RotateCcw aria-hidden="true" />
          {resetLabel}
        </Button>
      ) : null}
    </div>
  )
}
