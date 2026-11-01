import { Fragment } from "react"
import { ChevronsLeft, ChevronsRight, LayoutDashboard } from "lucide-react"
import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { navGroups } from "@/config/nav"
import { site } from "@/config/site"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

const itemClassName =
  "flex h-11 items-center gap-3 rounded-lg text-[15px] font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40"

interface SidebarPanelProps {
  collapsed: boolean
  variant: "docked" | "drawer"
  onToggleCollapse?: () => void
  onNavigate?: () => void
}

function SidebarPanel({ collapsed, variant, onToggleCollapse, onNavigate }: SidebarPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex h-header shrink-0 items-center gap-3 border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-4"
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="size-5" aria-hidden="true" />
        </div>
        {collapsed ? null : (
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-bold">{site.name}</span>
            <span className="truncate text-sm text-muted-foreground">Trang quản trị</span>
          </div>
        )}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Điều hướng chính">
        <div className="flex flex-col gap-5">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className="flex flex-col gap-1">
              {collapsed ? (
                groupIndex > 0 ? <div className="mx-auto mb-1 h-px w-8 bg-border" role="separator" /> : null
              ) : (
                <p className="px-3 pb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const link = (
                  <NavLink
                    to={item.href}
                    end={item.href === "/"}
                    onClick={onNavigate}
                    aria-label={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        itemClassName,
                        collapsed ? "mx-auto w-11 justify-center" : "px-3",
                        isActive
                          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                          : "hover:bg-muted"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn("size-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                          aria-hidden="true"
                        />
                        {collapsed ? null : <span className="truncate">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                )

                if (!collapsed) {
                  return <Fragment key={item.href}>{link}</Fragment>
                }

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </nav>

      {variant === "docked" ? (
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            className={cn(
              "h-11 gap-3 px-3 text-[15px] font-medium text-muted-foreground",
              collapsed && "mx-auto w-11 justify-center px-0"
            )}
          >
            {collapsed ? (
              <ChevronsRight className="size-5" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="size-5" aria-hidden="true" />
            )}
            {collapsed ? null : <span>Thu gọn thanh bên</span>}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

/** Sidebar docked ở lg+, drawer dưới lg — cùng một panel, khác khung. */
export function AdminSidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileOpenChange }: AdminSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "hidden h-full shrink-0 border-r border-sidebar-border transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block",
          collapsed ? "w-sidebar-collapsed" : "w-sidebar"
        )}
        aria-label="Thanh điều hướng"
      >
        <SidebarPanel collapsed={collapsed} variant="docked" onToggleCollapse={onToggleCollapse} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[min(18rem,85vw)] bg-sidebar p-0 sm:max-w-none">
          <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
          <SidebarPanel collapsed={false} variant="drawer" onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
