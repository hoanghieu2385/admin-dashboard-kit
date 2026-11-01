import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FormActionsProps {
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

/** Hàng nút cuối form: full-width trên mobile, căn phải từ `sm`. */
export function FormActions({
  submitLabel = "Lưu thay đổi",
  cancelLabel = "Huỷ",
  onCancel,
  isSubmitting = false,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}>
      {onCancel ? (
        <Button type="button" variant="outline" className="h-11" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      ) : null}
      <Button type="submit" className="h-11" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {submitLabel}
      </Button>
    </div>
  )
}
