import { useCallback, useState } from "react"

/** Giá trị string lưu ở localStorage, đọc đồng bộ ở lần render đầu. */
export function useStoredValue(key: string, defaultValue: string) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = useCallback(
    (next: string) => {
      setValue(next)
      try {
        localStorage.setItem(key, next)
      } catch {
        // Storage bị chặn: vẫn giữ giá trị trong phiên hiện tại.
      }
    },
    [key]
  )

  return [value, set] as const
}

export const SIDEBAR_COLLAPSED_KEY = "adk-sidebar-collapsed"
