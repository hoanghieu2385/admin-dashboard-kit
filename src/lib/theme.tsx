import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type Theme = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

/** Trùng key với script chống nháy theme trong index.html. */
const STORAGE_KEY = "adk-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark" || stored === "system") return stored
  } catch {
    // localStorage có thể bị chặn (chế độ riêng tư): dùng mặc định hệ thống.
  }
  return "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [prefersDark, setPrefersDark] = useState(() => window.matchMedia(DARK_QUERY).matches)

  const resolvedTheme: ResolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  }, [resolvedTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (next) => {
        setThemeState(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          // Không lưu được thì vẫn đổi theme trong phiên hiện tại.
        }
      },
    }),
    [theme, resolvedTheme]
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme phải được dùng bên trong ThemeProvider")
  }
  return context
}
