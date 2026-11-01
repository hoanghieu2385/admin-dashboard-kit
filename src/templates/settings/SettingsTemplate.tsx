import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SettingsSection {
  id: string
  label: string
  icon?: LucideIcon
  content: ReactNode
}

export interface SettingsTemplateProps {
  title: string
  description?: string
  sections: SettingsSection[]
  activeSectionId: string
  onSectionChange: (id: string) => void
  /** Hàng nút cuối trang (thường là FormActions). */
  actions?: ReactNode
  className?: string
}

/**
 * Mọi section được mount và ẩn bằng `hidden`, nên field trong tab không active
 * vẫn giữ state và vẫn được validate khi submit.
 */
export function SettingsTemplate({
  title,
  description,
  sections,
  activeSectionId,
  onSectionChange,
  actions,
  className,
}: SettingsTemplateProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader title={title} description={description} />

      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav aria-label="Mục cài đặt" className="min-w-0">
          <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-2 lg:flex-col">
            {sections.map((section) => {
              const Icon = section.icon
              const active = section.id === activeSectionId

              return (
                <Button
                  key={section.id}
                  type="button"
                  variant={active ? "secondary" : "ghost"}
                  className="h-10 shrink-0 justify-start gap-2 lg:w-full"
                  aria-current={active ? "true" : undefined}
                  aria-controls={`settings-panel-${section.id}`}
                  onClick={() => onSectionChange(section.id)}
                >
                  {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                  {section.label}
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="flex min-w-0 flex-col gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              id={`settings-panel-${section.id}`}
              role="region"
              aria-label={section.label}
              hidden={section.id !== activeSectionId}
              className="flex flex-col gap-4"
            >
              {section.content}
            </div>
          ))}

          {actions ? <div className="border-t border-border pt-4">{actions}</div> : null}
        </div>
      </div>
    </div>
  )
}
