export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "unpaid" | "paid" | "refunded"

export type PaymentMethod = "cod" | "bank_transfer" | "credit_card" | "e_wallet"

export interface OrderItem {
  productId: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  code: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  createdAt: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  items: OrderItem[]
  subtotal: number
  discount: number
  shippingFee: number
  tax: number
  total: number
}
