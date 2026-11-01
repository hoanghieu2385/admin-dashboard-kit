import { useEffect, useRef } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: "default" | "danger"
  onConfirm: () => void
}

/**
 * Xác nhận hành động không hoàn tác được (xoá, huỷ…).
 * Dialog đóng ngay khi xác nhận; nếu hành động lỗi, trang tự mở lại và báo toast.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Huỷ",
  tone = "default",
  onConfirm,
}: ConfirmDialogProps) {
  // Dialog điều khiển bằng state, không có trigger nên Radix không tự trả focus về chỗ cũ.
  const restoreRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open) return
    const track = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      // Bỏ qua focus bên trong dialog và menu: item menu unmount khi chọn nên không trả focus được.
      if (target?.closest('[role="alertdialog"], [role="menu"], [role="listbox"]')) return
      restoreRef.current = target
    }
    document.addEventListener("focusin", track)
    return () => document.removeEventListener("focusin", track)
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          const target = restoreRef.current
          restoreRef.current = null
          if (target?.isConnected) {
            event.preventDefault()
            target.focus()
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className={description ? undefined : "sr-only"}>
            {description ?? "Hành động này không thể hoàn tác."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className="h-10"
            variant={tone === "danger" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
