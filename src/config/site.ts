import type { AdminUser } from "@/types/common"

export const site = {
  name: "Admin Dashboard Kit",
  shortName: "ADK",
  description: "Bộ giao diện quản trị tái sử dụng",
} as const

/** User demo: Phase 4 sẽ thay bằng dữ liệu truyền từ page. */
export const demoUser: AdminUser = {
  name: "Nguyễn Văn A",
  email: "admin@example.com",
  role: "Quản trị viên",
}
