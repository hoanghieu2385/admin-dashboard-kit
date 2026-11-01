import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchInputProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  /** Trì hoãn gọi `onValueChange` để không lọc theo từng ký tự. */
  debounceMs?: number
  label?: string
  className?: string
}

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Tìm kiếm…",
  debounceMs = 300,
  label,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value)
  const lastEmitted = useRef(value)

  // Đồng bộ khi trang reset giá trị từ bên ngoài (ví dụ nút "Xoá bộ lọc").
  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value
      setText(value)
    }
  }, [value])

  useEffect(() => {
    if (text === value) return
    const timer = setTimeout(() => {
      lastEmitted.current = text
      onValueChange(text)
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [text, value, debounceMs, onValueChange])

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="h-9 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <button
          type="button"
          onClick={() => {
            setText("")
            lastEmitted.current = ""
            onValueChange("")
          }}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Xoá nội dung tìm kiếm"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
