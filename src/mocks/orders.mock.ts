import { customers } from "@/mocks/customers"
import { products } from "@/mocks/products"
import type { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order"

export const ORDER_STATUS_META = {
  pending: { label: "Chờ xử lý", tone: "warning" },
  processing: { label: "Đang xử lý", tone: "info" },
  shipped: { label: "Đang giao", tone: "primary" },
  delivered: { label: "Đã giao", tone: "success" },
  cancelled: { label: "Đã huỷ", tone: "danger" },
} as const satisfies Record<OrderStatus, { label: string; tone: "warning" | "info" | "primary" | "success" | "danger" }>

export const PAYMENT_STATUS_META = {
  unpaid: { label: "Chưa thanh toán", tone: "warning" },
  paid: { label: "Đã thanh toán", tone: "success" },
  refunded: { label: "Đã hoàn tiền", tone: "neutral" },
} as const satisfies Record<PaymentStatus, { label: string; tone: "warning" | "success" | "neutral" }>

export const PAYMENT_METHOD_META = {
  cod: { label: "Khi nhận hàng" },
  bank_transfer: { label: "Chuyển khoản" },
  credit_card: { label: "Thẻ tín dụng" },
  e_wallet: { label: "Ví điện tử" },
} as const satisfies Record<PaymentMethod, { label: string }>

interface OrderSeed {
  id: string
  customerId: string
  createdAt: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: [productId: string, quantity: number][]
  discount?: number
  /** Mặc định miễn phí từ 5 triệu, dưới mức đó 35.000 ₫. */
  shippingFee?: number
  taxRate?: number
}

const customerById = new Map(customers.map((customer) => [customer.id, customer]))
const productById = new Map(products.map((product) => [product.id, product]))

function createOrder(seed: OrderSeed): Order {
  const customer = customerById.get(seed.customerId)
  if (!customer) throw new Error(`Đơn ${seed.id}: không tìm thấy khách hàng ${seed.customerId}`)

  const items: OrderItem[] = seed.items.map(([productId, quantity]) => {
    const product = productById.get(productId)
    if (!product) throw new Error(`Đơn ${seed.id}: không tìm thấy sản phẩm ${productId}`)
    return { productId, name: product.name, sku: product.sku, quantity, unitPrice: product.price }
  })

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = seed.discount ?? 0
  const shippingFee = seed.shippingFee ?? (subtotal >= 5_000_000 ? 0 : 35_000)
  const tax = Math.round((subtotal - discount) * (seed.taxRate ?? 0))

  return {
    id: seed.id,
    code: seed.id,
    customerId: seed.customerId,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    shippingAddress: customer.address,
    createdAt: seed.createdAt,
    status: seed.status,
    paymentStatus: seed.paymentStatus,
    paymentMethod: seed.paymentMethod,
    items,
    subtotal,
    discount,
    shippingFee,
    tax,
    total: subtotal - discount + shippingFee + tax,
  }
}

const orderSeeds: OrderSeed[] = [
  // 7 ngày gần nhất
  { id: "DH-5030", customerId: "KH-1001", createdAt: "2026-11-01T09:15:00", status: "pending", paymentStatus: "unpaid", paymentMethod: "cod", items: [["SP-2001", 1], ["SP-2007", 2]] },
  { id: "DH-5029", customerId: "KH-1009", createdAt: "2026-10-31T16:40:00", status: "processing", paymentStatus: "paid", paymentMethod: "credit_card", items: [["SP-2003", 1], ["SP-2002", 1]] },
  { id: "DH-5028", customerId: "KH-1007", createdAt: "2026-10-31T10:20:00", status: "shipped", paymentStatus: "paid", paymentMethod: "e_wallet", items: [["SP-2009", 1], ["SP-2010", 2]] },
  { id: "DH-5027", customerId: "KH-1004", createdAt: "2026-10-30T14:05:00", status: "pending", paymentStatus: "unpaid", paymentMethod: "cod", items: [["SP-2004", 1]], discount: 200_000 },
  { id: "DH-5026", customerId: "KH-1002", createdAt: "2026-10-29T09:30:00", status: "cancelled", paymentStatus: "refunded", paymentMethod: "bank_transfer", items: [["SP-2005", 2]] },
  { id: "DH-5025", customerId: "KH-1005", createdAt: "2026-10-28T15:10:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2002", 1], ["SP-2007", 1]] },
  { id: "DH-5024", customerId: "KH-1011", createdAt: "2026-10-27T11:45:00", status: "delivered", paymentStatus: "paid", paymentMethod: "e_wallet", items: [["SP-2001", 2]], taxRate: 0.08 },
  { id: "DH-5023", customerId: "KH-1006", createdAt: "2026-10-26T08:50:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2010", 1], ["SP-2005", 1]] },
  { id: "DH-5022", customerId: "KH-1012", createdAt: "2026-10-26T17:25:00", status: "delivered", paymentStatus: "paid", paymentMethod: "credit_card", items: [["SP-2003", 1], ["SP-2004", 1]], taxRate: 0.08 },
  // 8–30 ngày
  { id: "DH-5021", customerId: "KH-1008", createdAt: "2026-10-25T13:35:00", status: "cancelled", paymentStatus: "unpaid", paymentMethod: "cod", items: [["SP-2007", 1]] },
  { id: "DH-5020", customerId: "KH-1003", createdAt: "2026-10-24T10:00:00", status: "shipped", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2009", 1], ["SP-2002", 1]] },
  { id: "DH-5019", customerId: "KH-1010", createdAt: "2026-10-22T14:15:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2005", 1], ["SP-2007", 1]] },
  { id: "DH-5018", customerId: "KH-1001", createdAt: "2026-10-21T09:05:00", status: "delivered", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2003", 1]], taxRate: 0.08 },
  { id: "DH-5017", customerId: "KH-1009", createdAt: "2026-10-19T16:20:00", status: "cancelled", paymentStatus: "refunded", paymentMethod: "credit_card", items: [["SP-2001", 1], ["SP-2004", 1]] },
  { id: "DH-5016", customerId: "KH-1004", createdAt: "2026-10-18T08:40:00", status: "shipped", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2002", 2], ["SP-2007", 1]] },
  { id: "DH-5015", customerId: "KH-1007", createdAt: "2026-10-15T12:30:00", status: "delivered", paymentStatus: "paid", paymentMethod: "e_wallet", items: [["SP-2010", 2], ["SP-2005", 1]] },
  { id: "DH-5014", customerId: "KH-1002", createdAt: "2026-10-12T10:10:00", status: "processing", paymentStatus: "paid", paymentMethod: "credit_card", items: [["SP-2003", 1]], taxRate: 0.08 },
  { id: "DH-5013", customerId: "KH-1005", createdAt: "2026-10-09T15:55:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2007", 1], ["SP-2010", 1]] },
  { id: "DH-5012", customerId: "KH-1006", createdAt: "2026-10-07T09:20:00", status: "cancelled", paymentStatus: "unpaid", paymentMethod: "cod", items: [["SP-2004", 1]] },
  { id: "DH-5011", customerId: "KH-1011", createdAt: "2026-10-05T11:30:00", status: "cancelled", paymentStatus: "unpaid", paymentMethod: "e_wallet", items: [["SP-2002", 1]] },
  { id: "DH-5010", customerId: "KH-1008", createdAt: "2026-10-03T14:45:00", status: "shipped", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2009", 2]], taxRate: 0.08 },
  // 31–90 ngày
  { id: "DH-5009", customerId: "KH-1010", createdAt: "2026-09-29T08:30:00", status: "delivered", paymentStatus: "paid", paymentMethod: "credit_card", items: [["SP-2001", 1], ["SP-2005", 1]] },
  { id: "DH-5008", customerId: "KH-1003", createdAt: "2026-09-24T16:05:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2007", 1], ["SP-2004", 1]] },
  { id: "DH-5007", customerId: "KH-1012", createdAt: "2026-09-18T10:50:00", status: "cancelled", paymentStatus: "refunded", paymentMethod: "credit_card", items: [["SP-2003", 1]] },
  { id: "DH-5006", customerId: "KH-1001", createdAt: "2026-09-11T13:15:00", status: "delivered", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2006", 1], ["SP-2005", 1]], taxRate: 0.08 },
  { id: "DH-5005", customerId: "KH-1009", createdAt: "2026-09-02T09:40:00", status: "delivered", paymentStatus: "paid", paymentMethod: "e_wallet", items: [["SP-2002", 1], ["SP-2009", 1]] },
  { id: "DH-5004", customerId: "KH-1004", createdAt: "2026-08-26T15:25:00", status: "delivered", paymentStatus: "paid", paymentMethod: "bank_transfer", items: [["SP-2003", 2]], taxRate: 0.08 },
  { id: "DH-5003", customerId: "KH-1007", createdAt: "2026-08-19T11:00:00", status: "delivered", paymentStatus: "paid", paymentMethod: "cod", items: [["SP-2007", 1], ["SP-2010", 1]] },
  { id: "DH-5002", customerId: "KH-1005", createdAt: "2026-08-11T14:35:00", status: "delivered", paymentStatus: "paid", paymentMethod: "e_wallet", items: [["SP-2004", 1]] },
  { id: "DH-5001", customerId: "KH-1006", createdAt: "2026-08-04T09:10:00", status: "delivered", paymentStatus: "paid", paymentMethod: "credit_card", items: [["SP-2001", 1], ["SP-2002", 1]], taxRate: 0.08 },
]

/** Mới nhất trước; mọi mutation ở page phải tạo bản sao, không sửa mảng này. */
export const orders: Order[] = orderSeeds
  .map(createOrder)
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
