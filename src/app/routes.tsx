import { createBrowserRouter } from "react-router"
import { AdminLayout } from "@/layouts/AdminLayout"
import { ComingSoonPage } from "@/pages/ComingSoonPage"
import { ComponentsPage } from "@/pages/ComponentsPage"
import { ErrorPage } from "@/pages/ErrorPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ComingSoonPage title="Bảng điều khiển" description="Tổng quan số liệu, biểu đồ và hoạt động gần đây." />,
      },
      {
        path: "customers",
        element: <ComingSoonPage title="Khách hàng" description="Danh sách, tìm kiếm và quản lý khách hàng." />,
      },
      {
        path: "products",
        element: <ComingSoonPage title="Sản phẩm" description="Danh mục sản phẩm, tồn kho và trạng thái." />,
      },
      {
        path: "orders",
        element: <ComingSoonPage title="Đơn hàng" description="Theo dõi và xử lý đơn hàng." />,
      },
      {
        path: "reports",
        element: <ComingSoonPage title="Báo cáo" description="Số liệu tổng hợp theo thời gian." />,
      },
      {
        path: "components",
        element: <ComponentsPage />,
      },
      {
        path: "settings",
        element: <ComingSoonPage title="Cài đặt" description="Thông tin chung và tùy chọn hiển thị." />,
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
])
