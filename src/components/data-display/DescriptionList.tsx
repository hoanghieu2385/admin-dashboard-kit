import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface DescriptionItem {
  label: string
  value: ReactNode
}

export interface DescriptionListProps {
  items: DescriptionItem[]
  columns?: 1 | 2
  className?: string
}

/** Cặp nhãn/giá trị cho trang chi tiết; giá trị có thể là link hoặc badge. */
export function DescriptionList({ items, columns = 2, className }: DescriptionListProps) {
  return (
    <dl className={cn("grid gap-4", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-1">
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-[15px] font-medium break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
