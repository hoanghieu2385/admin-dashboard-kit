import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

/** Nơi duy nhất hiển thị tiêu đề trang (header toàn cục không lặp lại title). */
export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="text-[15px] text-muted-foreground">{description}</p> : null}
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2 *:max-sm:flex-1">{children}</div>
      ) : null}
    </div>
  )
}
