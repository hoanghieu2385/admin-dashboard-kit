import { AlertTriangle, Package, ShoppingCart, Users } from "lucide-react"
import { Link } from "react-router"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { SectionCard } from "@/components/common/SectionCard"
import { DashboardTemplate } from "@/templates/dashboard/DashboardTemplate"
import { formatCurrency, formatRelativeTime } from "@/lib/format"
import { customers } from "@/mocks/customers"
import { activities, revenueSeries } from "@/mocks/dashboard"
import { products } from "@/mocks/products"

const activeCustomers = customers.filter((customer) => customer.status === "active").length
const lowStockProducts = products
  .filter((product) => product.status === "active" && product.stock <= 10)
  .sort((a, b) => a.stock - b.stock)

const stats = [
  {
    title: "Tổng khách hàng",
    value: customers.length,
    description: `${activeCustomers} đang hoạt động`,
    icon: Users,
    tone: "primary" as const,
    href: "/customers",
  },
  {
    title: "Doanh thu tháng 10",
    value: `${Math.round((revenueSeries.at(-1)?.revenue ?? 0) / 1_000_000)} tr`,
    description: "Tăng 20,7% so với tháng 9",
    icon: ShoppingCart,
    tone: "success" as const,
  },
  {
    title: "Sản phẩm",
    value: products.length,
    description: "Trong danh mục hiện tại",
    icon: Package,
    tone: "info" as const,
    href: "/products",
  },
  {
    title: "Sắp hết hàng",
    value: lowStockProducts.length,
    description: "Tồn kho từ 10 trở xuống",
    icon: AlertTriangle,
    tone: "warning" as const,
    href: "/products",
  },
]

export function DashboardPage() {
  return (
    <DashboardTemplate
      title="Bảng điều khiển"
      description="Tổng quan số liệu, doanh thu và hoạt động gần đây."
      stats={stats}
      charts={
        <SectionCard title="Doanh thu" description="8 tháng gần nhất (dữ liệu minh hoạ)">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  width={48}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => `${Number(value) / 1_000_000}tr`}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#revenue-fill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      }
      recentActivity={
        <SectionCard title="Hoạt động gần đây" description="Cập nhật mới nhất trong hệ thống">
          <ul className="flex flex-col gap-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-[15px]">
                    <span className="font-medium">{activity.actor}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      }
    >
      <SectionCard title="Sắp hết hàng" description="Sản phẩm đang bán có tồn kho thấp">
        <ul className="flex flex-col divide-y divide-border">
          {lowStockProducts.slice(0, 4).map((product) => (
            <li key={product.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 flex-col">
                <Link
                  to="/products"
                  className="truncate rounded-sm font-medium outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {product.name}
                </Link>
                <span className="text-xs text-muted-foreground">{product.sku}</span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-warning tabular-nums">Còn {product.stock}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </DashboardTemplate>
  )
}

export default DashboardPage
