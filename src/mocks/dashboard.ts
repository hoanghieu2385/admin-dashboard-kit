export interface RevenuePoint {
  month: string
  revenue: number
  orders: number
}

export interface Activity {
  id: string
  actor: string
  action: string
  target: string
  createdAt: string
}

export const revenueSeries: RevenuePoint[] = [
  { month: "T3", revenue: 82_000_000, orders: 41 },
  { month: "T4", revenue: 96_500_000, orders: 48 },
  { month: "T5", revenue: 88_000_000, orders: 44 },
  { month: "T6", revenue: 112_000_000, orders: 57 },
  { month: "T7", revenue: 104_500_000, orders: 52 },
  { month: "T8", revenue: 126_000_000, orders: 63 },
  { month: "T9", revenue: 118_500_000, orders: 59 },
  { month: "T10", revenue: 143_000_000, orders: 71 },
]

export const activities: Activity[] = [
  {
    id: "HD-1",
    actor: "Nguyễn An",
    action: "vừa tạo đơn",
    target: "DH-5001",
    createdAt: "2026-11-01T08:15:00",
  },
  {
    id: "HD-2",
    actor: "Trần Bình",
    action: "đã cập nhật hồ sơ",
    target: "KH-1002",
    createdAt: "2026-11-01T07:40:00",
  },
  {
    id: "HD-3",
    actor: "Lê Chi",
    action: "đã huỷ đơn",
    target: "DH-5005",
    createdAt: "2026-10-31T16:20:00",
  },
  {
    id: "HD-4",
    actor: "Phạm Dũng",
    action: "đã thanh toán",
    target: "DH-5004",
    createdAt: "2026-10-31T10:05:00",
  },
  {
    id: "HD-5",
    actor: "Hệ thống",
    action: "đã nhập thêm tồn kho",
    target: "SP-2007",
    createdAt: "2026-10-30T14:30:00",
  },
  {
    id: "HD-6",
    actor: "Ngô Linh",
    action: "đã nâng cấp gói",
    target: "KH-1009",
    createdAt: "2026-10-30T09:00:00",
  },
]
