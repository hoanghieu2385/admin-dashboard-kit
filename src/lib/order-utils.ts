import { addHours } from "date-fns"
import type { Order, OrderStatus, PaymentMethod } from "@/types/order"

export const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const

export const PAYMENT_METHODS = ["cod", "bank_transfer", "credit_card", "e_wallet"] as const satisfies readonly PaymentMethod[]

/** Luồng trạng thái hợp lệ; delivered/cancelled là trạng thái kết thúc. */
const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
}

export function getNextOrderStatuses(status: OrderStatus): OrderStatus[] {
  return STATUS_FLOW[status]
}

export interface OrderTimelineStep {
  key: string
  label: string
  at?: string
  state: "done" | "current" | "pending"
  tone?: "default" | "danger"
}

const FLOW_STEPS = [
  { key: "created", label: "Đơn hàng được tạo", offset: 0 },
  { key: "payment", label: "Xác nhận thanh toán", offset: 2 },
  { key: "processing", label: "Đang xử lý", offset: 6 },
  { key: "shipped", label: "Đã giao vận chuyển", offset: 24 },
  { key: "delivered", label: "Giao hàng thành công", offset: 42 },
]

/** Bước xa nhất đã đạt theo trạng thái đơn (index trong FLOW_STEPS). */
const REACHED_STEP: Record<Exclude<OrderStatus, "cancelled">, number> = {
  pending: 0,
  processing: 2,
  shipped: 3,
  delivered: 4,
}

/** Dựng timeline minh hoạ từ `createdAt` + trạng thái; không lưu timestamp từng bước trong mock. */
export function getOrderTimeline(order: Order): OrderTimelineStep[] {
  const at = (hours: number) => addHours(new Date(order.createdAt), hours).toISOString()

  if (order.status === "cancelled") {
    return [
      { key: "created", label: "Đơn hàng được tạo", at: order.createdAt, state: "done" },
      { key: "cancelled", label: "Đơn hàng đã huỷ", at: at(4), state: "done", tone: "danger" },
    ]
  }

  const reached = REACHED_STEP[order.status]
  const paid = order.paymentStatus !== "unpaid"

  return FLOW_STEPS.map((step, index) => {
    const isPaymentStep = step.key === "payment"
    const skippedPayment = isPaymentStep && !paid
    const state =
      skippedPayment || index > reached ? "pending" : index === reached && order.status !== "delivered" ? "current" : "done"

    return {
      key: step.key,
      label:
        isPaymentStep && !paid && order.paymentMethod === "cod"
          ? "Thanh toán khi nhận hàng"
          : step.label,
      at: skippedPayment || index > reached ? undefined : at(step.offset),
      state,
    }
  })
}
