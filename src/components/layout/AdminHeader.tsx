import { Menu, Settings } from "lucide-react"
import { Link } from "react-router"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { site } from "@/config/site"
import type { AdminUser } from "@/types/common"

interface AdminHeaderProps {
  user: AdminUser
  onMenuClick: () => void
}

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const letters = words.length > 1 ? [words[0][0], words[words.length - 1][0]] : [name[0], name[1]]
  return letters.filter(Boolean).join("").toUpperCase()
}

/** Chỉ thanh toàn cục: menu mobile, theme, tài khoản. Tiêu đề trang thuộc về PageHeader. */
export function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex h-header shrink-0 items-center gap-3 border-b border-border bg-card px-4 sm:px-6 lg:px-8">
      <Button variant="outline" className="h-11 lg:hidden" onClick={onMenuClick} aria-label="Mở menu điều hướng">
        <Menu className="size-5" aria-hidden="true" />
        <span>Menu</span>
      </Button>
      <span className="min-w-0 truncate text-[15px] font-bold lg:hidden">{site.shortName}</span>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 gap-2.5 px-2 sm:pr-3" aria-label={`Tài khoản: ${user.name}`}>
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {initialsOf(user.name)}
              </span>
              <span className="hidden flex-col items-start leading-tight text-left sm:flex">
                <span className="max-w-48 truncate text-[15px] font-semibold">{user.name}</span>
                <span className="text-[13px] text-muted-foreground">{user.role}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
                <span className="text-[15px] font-semibold">{user.name}</span>
                <span className="text-sm font-normal text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <Settings aria-hidden="true" />
                Cài đặt
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
