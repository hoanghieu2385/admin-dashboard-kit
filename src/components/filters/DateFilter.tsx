import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface DateRange {
  from?: string
  to?: string
}

export interface DateFilterProps {
  value: DateRange
  onChange: (value: DateRange) => void
  fromLabel?: string
  toLabel?: string
  className?: string
}

/**
 * Khoảng ngày dạng chuỗi `yyyy-mm-dd` (giá trị của input date).
 * Không thêm date-picker library: input native đủ dùng và có sẵn accessibility.
 */
export function DateFilter({ value, onChange, fromLabel = "Từ ngày", toLabel = "Đến ngày", className }: DateFilterProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-2", className)}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-date-from" className="text-xs text-muted-foreground">
          {fromLabel}
        </Label>
        <Input
          id="filter-date-from"
          type="date"
          className="h-9"
          value={value.from ?? ""}
          max={value.to || undefined}
          onChange={(event) => onChange({ ...value, from: event.target.value || undefined })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-date-to" className="text-xs text-muted-foreground">
          {toLabel}
        </Label>
        <Input
          id="filter-date-to"
          type="date"
          className="h-9"
          value={value.to ?? ""}
          min={value.from || undefined}
          onChange={(event) => onChange({ ...value, to: event.target.value || undefined })}
        />
      </div>
    </div>
  )
}
