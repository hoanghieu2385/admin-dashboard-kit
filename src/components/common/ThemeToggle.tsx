import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme, type Theme } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Sáng", icon: Sun },
  { value: "dark", label: "Tối", icon: Moon },
  { value: "system", label: "Theo hệ thống", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-11" aria-label="Đổi giao diện sáng/tối">
          <CurrentIcon className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => setTheme(option.value)}>
            <option.icon aria-hidden="true" />
            {option.label}
            {theme === option.value ? <Check className="ml-auto" aria-hidden="true" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
