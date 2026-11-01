export type CustomerStatus = "active" | "pending" | "blocked"
export type CustomerPlan = "Cơ bản" | "Chuyên nghiệp" | "Doanh nghiệp"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  plan: CustomerPlan
  status: CustomerStatus
  createdAt: string
  address: string
  notes: string
}

export const CUSTOMER_STATUS_META = {
  active: { label: "Đang hoạt động", tone: "success" },
  pending: { label: "Chờ duyệt", tone: "warning" },
  blocked: { label: "Tạm khoá", tone: "danger" },
} as const satisfies Record<CustomerStatus, { label: string; tone: "success" | "warning" | "danger" }>

export const customers: Customer[] = [
  {
    id: "KH-1001",
    name: "Nguyễn An",
    email: "an.nguyen@example.com",
    phone: "0901 234 567",
    company: "An Phát",
    plan: "Doanh nghiệp",
    status: "active",
    createdAt: "2026-10-28",
    address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    notes: "Khách hàng lâu năm, ưu tiên hỗ trợ qua email.",
  },
  {
    id: "KH-1002",
    name: "Trần Bình",
    email: "binh.tran@example.com",
    phone: "0912 345 678",
    company: "Bình Minh",
    plan: "Chuyên nghiệp",
    status: "pending",
    createdAt: "2026-10-30",
    address: "45 Lê Lợi, Hải Châu, Đà Nẵng",
    notes: "Đang chờ xác minh giấy phép kinh doanh.",
  },
  {
    id: "KH-1003",
    name: "Lê Chi",
    email: "chi.le@example.com",
    phone: "0987 654 321",
    company: "Chi Lê Studio",
    plan: "Cơ bản",
    status: "blocked",
    createdAt: "2026-10-12",
    address: "8 Tràng Tiền, Hoàn Kiếm, Hà Nội",
    notes: "Tạm khoá do quá hạn thanh toán 30 ngày.",
  },
  {
    id: "KH-1004",
    name: "Phạm Dũng",
    email: "dung.pham@example.com",
    phone: "0903 111 222",
    company: "Dũng Phát Logistics",
    plan: "Doanh nghiệp",
    status: "active",
    createdAt: "2026-09-30",
    address: "221 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    notes: "Có 3 chi nhánh, cần báo giá riêng.",
  },
  {
    id: "KH-1005",
    name: "Hoàng Em",
    email: "em.hoang@example.com",
    phone: "0934 222 333",
    company: "Em Hoàng",
    plan: "Cơ bản",
    status: "active",
    createdAt: "2026-10-02",
    address: "17 Bạch Đằng, Hồng Bàng, Hải Phòng",
    notes: "",
  },
  {
    id: "KH-1006",
    name: "Vũ Giang",
    email: "giang.vu@example.com",
    phone: "0945 333 444",
    company: "Giang Vũ",
    plan: "Chuyên nghiệp",
    status: "pending",
    createdAt: "2026-10-05",
    address: "90 Trần Phú, Lê Chân, Hải Phòng",
    notes: "Mới đăng ký qua chiến dịch tháng 10.",
  },
  {
    id: "KH-1007",
    name: "Đỗ Hạnh",
    email: "hanh.do@example.com",
    phone: "0956 444 555",
    company: "Hạnh Đỗ",
    plan: "Chuyên nghiệp",
    status: "active",
    createdAt: "2026-10-09",
    address: "31 Pasteur, Quận 3, TP. Hồ Chí Minh",
    notes: "Quan tâm gói tích hợp API.",
  },
  {
    id: "KH-1008",
    name: "Bùi Khánh",
    email: "khanh.bui@example.com",
    phone: "0967 555 666",
    company: "Khánh Bùi",
    plan: "Cơ bản",
    status: "blocked",
    createdAt: "2026-08-21",
    address: "5 Hùng Vương, Ninh Kiều, Cần Thơ",
    notes: "Vi phạm điều khoản sử dụng, chờ xử lý.",
  },
  {
    id: "KH-1009",
    name: "Ngô Linh",
    email: "linh.ngo@example.com",
    phone: "0978 666 777",
    company: "Linh Ngô",
    plan: "Doanh nghiệp",
    status: "active",
    createdAt: "2026-10-21",
    address: "72 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    notes: "Hợp đồng 12 tháng, gia hạn tháng 10/2027.",
  },
  {
    id: "KH-1010",
    name: "Trịnh Minh",
    email: "minh.trinh@example.com",
    phone: "0989 777 888",
    company: "Minh Trịnh",
    plan: "Chuyên nghiệp",
    status: "pending",
    createdAt: "2026-10-24",
    address: "19 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    notes: "",
  },
  {
    id: "KH-1011",
    name: "Lý Nam",
    email: "nam.ly@example.com",
    phone: "0908 888 999",
    company: "Nam Lý",
    plan: "Cơ bản",
    status: "active",
    createdAt: "2026-10-25",
    address: "3 Phan Đình Phùng, Ba Đình, Hà Nội",
    notes: "",
  },
  {
    id: "KH-1012",
    name: "Phan Oanh",
    email: "oanh.phan@example.com",
    phone: "0919 999 000",
    company: "Oanh Phan",
    plan: "Doanh nghiệp",
    status: "blocked",
    createdAt: "2026-07-15",
    address: "88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh",
    notes: "Đã yêu cầu huỷ tài khoản, giữ dữ liệu 90 ngày.",
  },
]
