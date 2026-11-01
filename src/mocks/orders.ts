export type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

export interface Order {
  id: string
  code: string
  customerId: string
  total: number
  status: OrderStatus
  createdAt: string
}

export const ORDER_STATUS_META = {
  pending: { label: "Chờ xử lý", tone: "warning" },
  processing: { label: "Đang giao", tone: "info" },
  completed: { label: "Hoàn tất", tone: "success" },
  cancelled: { label: "Đã huỷ", tone: "danger" },
} as const satisfies Record<OrderStatus, { label: string; tone: "warning" | "info" | "success" | "danger" }>

export const orders: Order[] = [
  { id: "DH-5001", code: "DH-5001", customerId: "KH-1001", total: 4_980_000, status: "completed", createdAt: "2026-10-30" },
  { id: "DH-5002", code: "DH-5002", customerId: "KH-1001", total: 1_890_000, status: "processing", createdAt: "2026-10-29" },
  { id: "DH-5003", code: "DH-5003", customerId: "KH-1001", total: 2_490_000, status: "pending", createdAt: "2026-10-28" },
  { id: "DH-5004", code: "DH-5004", customerId: "KH-1004", total: 7_990_000, status: "completed", createdAt: "2026-10-27" },
  { id: "DH-5005", code: "DH-5005", customerId: "KH-1007", total: 5_290_000, status: "cancelled", createdAt: "2026-10-25" },
  { id: "DH-5006", code: "DH-5006", customerId: "KH-1009", total: 3_450_000, status: "processing", createdAt: "2026-10-24" },
  { id: "DH-5007", code: "DH-5007", customerId: "KH-1002", total: 990_000, status: "pending", createdAt: "2026-10-23" },
  { id: "DH-5008", code: "DH-5008", customerId: "KH-1001", total: 1_290_000, status: "completed", createdAt: "2026-10-21" },
]
