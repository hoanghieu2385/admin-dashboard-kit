import { format, formatDistanceToNow, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("vi-VN")

const compactFormatter = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 })

/** Chuỗi ISO (yyyy-mm-dd hoặc ISO đầy đủ) → ngày hiển thị. */
export function formatDate(value: string, pattern = "dd/MM/yyyy") {
  return format(parseISO(value), pattern)
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

/** Số tiền lớn rút gọn cho thẻ KPI ("82,8 Tr ₫"); dưới 1 triệu giữ đủ số. */
export function formatCompactCurrency(value: number) {
  if (Math.abs(value) < 1_000_000) return formatCurrency(value)
  return `${compactFormatter.format(value)} ₫`
}

export function formatRelativeTime(value: string) {
  return formatDistanceToNow(parseISO(value), { addSuffix: true, locale: vi })
}
