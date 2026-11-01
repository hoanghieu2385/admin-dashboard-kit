import { BarChart3, Blocks, FileText, LayoutDashboard, Package, Settings, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Nguồn duy nhất cho sidebar (và breadcrumb ở Phase 3). */
export const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ label: "Bảng điều khiển", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Quản lý",
    items: [
      { label: "Khách hàng", href: "/customers", icon: Users },
      { label: "Sản phẩm", href: "/products", icon: Package },
      { label: "Đơn hàng", href: "/orders", icon: FileText },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "UI Kit", href: "/components", icon: Blocks },
      { label: "Báo cáo", href: "/reports", icon: BarChart3 },
      { label: "Cài đặt", href: "/settings", icon: Settings },
    ],
  },
]
