import { Outlet } from "react-router"
import { AdminShell } from "@/components/layout/AdminShell"
import { demoUser } from "@/config/site"

export function AdminLayout() {
  return (
    <AdminShell user={demoUser}>
      <Outlet />
    </AdminShell>
  )
}
