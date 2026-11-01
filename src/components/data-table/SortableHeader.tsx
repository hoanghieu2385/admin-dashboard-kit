import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>
  label: string
  className?: string
}

/** Header bấm để sắp xếp; dùng làm `header` của cột trong `columns`. */
export function SortableHeader<TData>({ column, label, className }: SortableHeaderProps<TData>) {
  const sorted = column.getIsSorted()

  if (!column.getCanSort()) {
    return <span className={className}>{label}</span>
  }

  const Icon = sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn(
        "-ml-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 font-medium outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      aria-label={`Sắp xếp theo ${label}`}
    >
      {label}
      <Icon className={cn("size-3.5", sorted === false && "text-muted-foreground")} aria-hidden="true" />
    </button>
  )
}
