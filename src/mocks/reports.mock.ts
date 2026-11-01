import type { ReportGranularity, ReportRangeKey } from "@/types/report"

export interface ReportRangeOption {
  key: ReportRangeKey
  label: string
  days: number
  granularity: ReportGranularity
}

export const REPORT_RANGES: ReportRangeOption[] = [
  { key: "7d", label: "7 ngày", days: 7, granularity: "day" },
  { key: "30d", label: "30 ngày", days: 30, granularity: "week" },
  { key: "90d", label: "90 ngày", days: 90, granularity: "month" },
]

export const REPORT_GRANULARITIES: { value: ReportGranularity; label: string }[] = [
  { value: "day", label: "Theo ngày" },
  { value: "week", label: "Theo tuần" },
  { value: "month", label: "Theo tháng" },
]
