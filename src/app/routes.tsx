import type { ComponentType } from "react"
import { createBrowserRouter } from "react-router"
import { AdminLayout } from "@/layouts/AdminLayout"
import { AdminLoading } from "@/layouts/AdminLoading"
import { ErrorPage } from "@/pages/ErrorPage"

const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    HydrateFallback: AdminLoading,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("@/pages/examples/DashboardPage")),
      },
      {
        path: "customers",
        lazy: lazyPage(() => import("@/pages/examples/CustomersPage")),
      },
      {
        path: "customers/new",
        lazy: lazyPage(() => import("@/pages/examples/CustomerFormPage")),
      },
      {
        path: "customers/:customerId",
        lazy: lazyPage(() => import("@/pages/examples/CustomerDetailPage")),
      },
      {
        path: "customers/:customerId/edit",
        lazy: lazyPage(() => import("@/pages/examples/CustomerFormPage")),
      },
      {
        path: "products",
        lazy: lazyPage(() => import("@/pages/examples/ProductsPage")),
      },
      {
        path: "orders",
        lazy: lazyPage(() => import("@/pages/orders/OrdersPage")),
      },
      {
        path: "orders/:orderId",
        lazy: lazyPage(() => import("@/pages/orders/OrderDetailPage")),
      },
      {
        path: "reports",
        lazy: lazyPage(() => import("@/pages/reports/ReportsPage")),
      },
      {
        path: "components",
        lazy: lazyPage(() => import("@/pages/ComponentsPage")),
      },
      {
        path: "settings",
        lazy: lazyPage(() => import("@/pages/examples/SettingsPage")),
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
])
