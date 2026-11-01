import type { ReactNode } from "react"
import { ThemeProvider, useTheme } from "@/lib/theme"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <ThemedToaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  return <Toaster theme={resolvedTheme} position="bottom-right" />
}
