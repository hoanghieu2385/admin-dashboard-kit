import { AdminShell } from "@/components/layout/AdminShell"
import { LoadingState } from "@/components/data-display/LoadingState"
import { demoUser } from "@/config/site"

/** Fallback khi route lazy đang tải ở lần truy cập trực tiếp (HydrateFallback). */
export function AdminLoading() {
  return (
    <AdminShell user={demoUser}>
      <LoadingState rows={7} label="Đang tải trang" className="pt-2" />
    </AdminShell>
  )
}
