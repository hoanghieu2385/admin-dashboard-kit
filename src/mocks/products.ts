export type ProductStatus = "active" | "draft" | "archived"

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  updatedAt: string
}

export const PRODUCT_STATUS_META = {
  active: { label: "Đang bán", tone: "success" },
  draft: { label: "Nháp", tone: "neutral" },
  archived: { label: "Ngừng bán", tone: "warning" },
} as const satisfies Record<ProductStatus, { label: string; tone: "success" | "neutral" | "warning" }>

export const products: Product[] = [
  {
    id: "SP-2001",
    name: "Bộ định tuyến Wi-Fi 6",
    sku: "RT-WF6",
    category: "Thiết bị",
    price: 2_490_000,
    stock: 34,
    status: "active",
    updatedAt: "2026-10-30",
  },
  {
    id: "SP-2002",
    name: "Bàn phím cơ không dây",
    sku: "KB-WL80",
    category: "Phụ kiện",
    price: 1_890_000,
    stock: 8,
    status: "active",
    updatedAt: "2026-10-29",
  },
  {
    id: "SP-2003",
    name: "Màn hình 27 inch 2K",
    sku: "MN-27Q",
    category: "Thiết bị",
    price: 5_290_000,
    stock: 12,
    status: "active",
    updatedAt: "2026-10-28",
  },
  {
    id: "SP-2004",
    name: "Tai nghe chống ồn",
    sku: "HP-ANC",
    category: "Phụ kiện",
    price: 3_450_000,
    stock: 5,
    status: "active",
    updatedAt: "2026-10-27",
  },
  {
    id: "SP-2005",
    name: "Gói quản trị thiết bị",
    sku: "SV-MDM",
    category: "Phần mềm",
    price: 990_000,
    stock: 999,
    status: "active",
    updatedAt: "2026-10-26",
  },
  {
    id: "SP-2006",
    name: "Camera hội nghị 4K",
    sku: "CM-4K",
    category: "Thiết bị",
    price: 7_990_000,
    stock: 0,
    status: "archived",
    updatedAt: "2026-10-20",
  },
  {
    id: "SP-2007",
    name: "Hub USB-C 8 cổng",
    sku: "HB-USBC8",
    category: "Phụ kiện",
    price: 1_290_000,
    stock: 21,
    status: "active",
    updatedAt: "2026-10-24",
  },
  {
    id: "SP-2008",
    name: "Gói sao lưu đám mây",
    sku: "SV-BKP",
    category: "Phần mềm",
    price: 1_590_000,
    stock: 999,
    status: "draft",
    updatedAt: "2026-10-22",
  },
  {
    id: "SP-2009",
    name: "Ghế công thái học",
    sku: "CH-ERGO",
    category: "Nội thất",
    price: 4_750_000,
    stock: 9,
    status: "active",
    updatedAt: "2026-10-19",
  },
  {
    id: "SP-2010",
    name: "Đèn màn hình chống chói",
    sku: "LT-SCR",
    category: "Phụ kiện",
    price: 890_000,
    stock: 0,
    status: "draft",
    updatedAt: "2026-10-15",
  },
]
