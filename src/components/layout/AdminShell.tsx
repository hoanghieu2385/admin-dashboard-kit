import { useEffect, useRef, useState, type ReactNode } from "react"
import { useLocation } from "react-router"
import { AdminHeader } from "@/components/layout/AdminHeader"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { SIDEBAR_COLLAPSED_KEY, useStoredValue } from "@/hooks/use-stored-value"
import type { AdminUser } from "@/types/common"

interface AdminShellProps {
  user: AdminUser
  children: ReactNode
}

/**
 * Shell cao bằng viewport: sidebar và cột nội dung là sibling, chỉ <main> cuộn
 * nên trang dài không kéo sidebar/footer ra khỏi màn hình.
 */
export function AdminShell({ user, children }: AdminShellProps) {
  const mainRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsedValue, setCollapsedValue] = useStoredValue(SIDEBAR_COLLAPSED_KEY, "false")
  const collapsed = collapsedValue === "true"
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  // Đóng drawer khi cửa sổ đã đủ rộng cho sidebar cố định.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const handleChange = () => {
      if (media.matches) setMobileOpen(false)
    }
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsedValue(collapsed ? "false" : "true")}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader user={user} onMenuClick={() => setMobileOpen(true)} />
        <main ref={mainRef} id="main-content" className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-page px-4 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
