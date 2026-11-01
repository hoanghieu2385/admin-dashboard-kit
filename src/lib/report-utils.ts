import { addDays, format, parseISO, startOfMonth, startOfWeek } from "date-fns"
import { ORDER_STATUSES, PAYMENT_METHODS } from "@/lib/order-utils"
import type { Order, OrderStatus } from "@/types/order"
import type {
  PaymentBreakdownItem,
  ReportGranularity,
  ReportKpis,
  RevenuePoint,
  StatusBreakdownItem,
  TopProductItem,
} from "@/types/report"

const dayOf = (order: Order) => order.createdAt.slice(0, 10)

/** Ngày sớm nhất / muộn nhất của dữ liệu đơn hàng (dùng làm mốc cho bộ lọc báo cáo). */
export function getOrderDateBounds(orders: Order[]): { from: string; to: string } {
  const days = orders.map(dayOf).sort()
  return { from: days[0] ?? "", to: days.at(-1) ?? "" }
}

export function filterOrdersByRange(
  orders: Order[],
  from: string,
  to: string,
  status: OrderStatus | "all" = "all"
): Order[] {
  return orders.filter((order) => {
    const day = dayOf(order)
    const inRange = day >= from && day <= to
    const matchesStatus = status === "all" || order.status === status
    return inRange && matchesStatus
  })
}

/** Doanh thu ghi nhận = tổng đơn không huỷ; AOV tính trên chính số đơn đó. */
export function getReportKpis(orders: Order[]): ReportKpis {
  const recognized = orders.filter((order) => order.status !== "cancelled")
  const revenue = recognized.reduce((sum, order) => sum + order.total, 0)

  return {
    revenue,
    orderCount: orders.length,
    averageOrderValue: recognized.length ? Math.round(revenue / recognized.length) : 0,
    completedOrders: orders.filter((order) => order.status === "delivered").length,
    recognizedOrders: recognized.length,
  }
}

function bucketStart(day: string, granularity: ReportGranularity): string {
  const date = parseISO(day)
  if (granularity === "month") return format(startOfMonth(date), "yyyy-MM-dd")
  if (granularity === "week") return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
  return day
}

function bucketLabel(day: string, granularity: ReportGranularity): string {
  return format(parseISO(day), granularity === "month" ? "MM/yyyy" : "dd/MM")
}

/** Chuỗi doanh thu theo ngày/tuần/tháng, gồm cả bucket rỗng để trục thời gian liền mạch. */
export function getRevenueSeries(
  orders: Order[],
  from: string,
  to: string,
  granularity: ReportGranularity
): RevenuePoint[] {
  if (!from || !to) return []

  const buckets = new Map<string, RevenuePoint>()
  const end = parseISO(to)
  for (let cursor = parseISO(from); cursor <= end; cursor = addDays(cursor, 1)) {
    const key = bucketStart(format(cursor, "yyyy-MM-dd"), granularity)
    if (!buckets.has(key)) {
      buckets.set(key, { key, label: bucketLabel(key, granularity), revenue: 0, orders: 0 })
    }
  }

  for (const order of orders) {
    if (order.status === "cancelled") continue
    const bucket = buckets.get(bucketStart(dayOf(order), granularity))
    if (!bucket) continue
    bucket.revenue += order.total
    bucket.orders += 1
  }

  return [...buckets.values()]
}

export function getStatusBreakdown(orders: Order[]): StatusBreakdownItem[] {
  return ORDER_STATUSES.map((status) => {
    const count = orders.filter((order) => order.status === status).length
    return { status, count, percentage: orders.length ? Math.round((count / orders.length) * 100) : 0 }
  })
}

export function getPaymentBreakdown(orders: Order[]): PaymentBreakdownItem[] {
  return PAYMENT_METHODS.map((method) => {
    const count = orders.filter((order) => order.paymentMethod === method).length
    return { method, count, percentage: orders.length ? Math.round((count / orders.length) * 100) : 0 }
  })
}

/** Xếp hạng theo doanh thu sản phẩm (đơn giá × số lượng), bỏ đơn đã huỷ. */
export function getTopProducts(orders: Order[], limit = 5): TopProductItem[] {
  const totals = new Map<string, TopProductItem>()

  for (const order of orders) {
    if (order.status === "cancelled") continue
    for (const item of order.items) {
      const current = totals.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        units: 0,
        revenue: 0,
        percentage: 0,
      }
      current.units += item.quantity
      current.revenue += item.unitPrice * item.quantity
      totals.set(item.productId, current)
    }
  }

  const productRevenue = [...totals.values()].reduce((sum, item) => sum + item.revenue, 0)

  return [...totals.values()]
    .map((item) => ({
      ...item,
      percentage: productRevenue ? Math.round((item.revenue / productRevenue) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}
