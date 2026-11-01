import type { LucideIcon } from "lucide-react"
import { Link } from "react-router"
import { cn } from "@/lib/utils"

export type StatTone = "primary" | "success" | "warning" | "info" | "neutral"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  tone?: StatTone
  /** Có `href` thì card là liên kết (giữ nguyên component, chỉ đổi vỏ). */
  href?: string
  className?: string
}

const TONE_CLASSES: Record<StatTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  neutral: "bg-muted text-muted-foreground",
}

const BASE_CLASSES =
  "flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-colors"

export function StatCard({ title, value, description, icon: Icon, tone = "primary", href, className }: StatCardProps) {
  const content = (
    <>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[15px] font-medium text-muted-foreground">{title}</span>
        <span className="text-3xl leading-tight font-bold tracking-tight break-words tabular-nums">{value}</span>
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </div>
      {Icon ? (
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  )

  if (href) {
    return (
      <Link
        to={href}
        className={cn(
          BASE_CLASSES,
          "outline-none hover:border-primary/40 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/40",
          className
        )}
      >
        {content}
      </Link>
    )
  }

  return <div className={cn(BASE_CLASSES, className)}>{content}</div>
}
