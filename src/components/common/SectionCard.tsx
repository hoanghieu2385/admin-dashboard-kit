import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface SectionCardProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Card nội dung có tiêu đề; dùng cho chart, khối thông tin, section tùy biến. */
export function SectionCard({ title, description, actions, children, className }: SectionCardProps) {
  const hasHeader = Boolean(title) || Boolean(description) || Boolean(actions)

  return (
    <section className={cn("flex min-w-0 flex-col rounded-xl border border-border bg-card", className)}>
      {hasHeader ? (
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      <div className="min-w-0 p-5">{children}</div>
    </section>
  )
}
