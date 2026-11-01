import { useLocation } from "react-router"
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumbs"
import { navGroups } from "@/config/nav"

/** Suy ra breadcrumb từ `config/nav.ts` + URL hiện tại; trang gốc không có breadcrumb. */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const { pathname } = useLocation()

  if (pathname === "/") return []

  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return [{ label: "Trang chủ", href: "/" }, { label: group.label }, { label: item.label }]
      }
    }
  }

  return []
}
