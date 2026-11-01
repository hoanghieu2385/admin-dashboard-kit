import { format, formatDistanceToNow, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("vi-VN")

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

export function formatRelativeTime(value: string) {
  return formatDistanceToNow(parseISO(value), { addSuffix: true, locale: vi })
}
