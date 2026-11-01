import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "primary" | "success" | "warning" | "danger" | "info" | "neutral"

export interface StatusBadgeProps {
  children: ReactNode
  /** Trang quyết định tone — kit không chứa enum trạng thái nghiệp vụ. */
  tone?: StatusTone
  dot?: boolean
  className?: string
}

const TONE_CLASSES: Record<StatusTone, string> = {
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-destructive/30 bg-destructive/10 text-destructive",
  info: "border-info/30 bg-info/10 text-info",
  neutral: "border-border bg-muted text-muted-foreground",
}

export function StatusBadge({ children, tone = "neutral", dot = false, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 shrink-0 gap-1.5 rounded-full px-2.5 text-xs font-medium", TONE_CLASSES[tone], className)}
    >
      {dot ? <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </Badge>
  )
}
