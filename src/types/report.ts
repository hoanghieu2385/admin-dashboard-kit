import type { OrderStatus, PaymentMethod } from "@/types/order"

export type ReportGranularity = "day" | "week" | "month"

export type ReportRangeKey = "7d" | "30d" | "90d"

export interface ReportKpis {
  revenue: number
  orderCount: number
  averageOrderValue: number
  completedOrders: number
  /** Số đơn được tính vào doanh thu (không gồm đơn đã huỷ). */
  recognizedOrders: number
}

export interface RevenuePoint {
  key: string
  label: string
  revenue: number
  orders: number
}

export interface StatusBreakdownItem {
  status: OrderStatus
  count: number
  percentage: number
}

export interface PaymentBreakdownItem {
  method: PaymentMethod
  count: number
  percentage: number
}

export interface TopProductItem {
  productId: string
  name: string
  sku: string
  units: number
  revenue: number
  percentage: number
}
