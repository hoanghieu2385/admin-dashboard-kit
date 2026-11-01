import type { ReactNode } from "react"
import { FieldGroup } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormSectionProps {
  title: string
  description?: string
  /** 1 cột (mặc định) hoặc 2 cột từ `md` trở lên. */
  columns?: 1 | 2
  children: ReactNode
  className?: string
}

/** Nhóm field trong một card có tiêu đề; dùng bên trong `<form>` có `FormProvider`. */
export function FormSection({ title, description, columns = 1, children, className }: FormSectionProps) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <FieldGroup className={cn(columns === 2 && "md:grid md:grid-cols-2 md:gap-5 md:space-y-0")}>{children}</FieldGroup>
    </section>
  )
}
