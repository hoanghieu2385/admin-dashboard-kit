import { CircleCheck, Receipt, ShoppingCart, Wallet } from "lucide-react"
import { useMemo, useState } from "react"
import { format, parseISO, subDays } from "date-fns"
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { SectionCard } from "@/components/common/SectionCard"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge, type StatusTone } from "@/components/data-display/StatusBadge"
import { DateFilter, type DateRange } from "@/components/filters/DateFilter"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber } from "@/lib/format"
import {
  getOrderDateBounds,
  getPaymentBreakdown,
  getReportKpis,
  getRevenueSeries,
  getStatusBreakdown,
  getTopProducts,
  filterOrdersByRange,
} from "@/lib/report-utils"
import { cn } from "@/lib/utils"
import { ORDER_STATUS_META, PAYMENT_METHOD_META, orders } from "@/mocks/orders.mock"
import { REPORT_GRANULARITIES, REPORT_RANGES } from "@/mocks/reports.mock"
import { DashboardTemplate } from "@/templates/dashboard/DashboardTemplate"
import type { OrderStatus } from "@/types/order"
import type { ReportGranularity, ReportRangeKey } from "@/types/report"

const DATE_BOUNDS = getOrderDateBounds(orders)

const TONE_BAR: Record<StatusTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
}

const PAYMENT_DOTS = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4"]

function rangeFromDays(days: number): DateRange {
  return {
    from: format(subDays(parseISO(DATE_BOUNDS.to), days - 1), "yyyy-MM-dd"),
    to: DATE_BOUNDS.to,
  }
}

export function ReportsPage() {
  const [range, setRange] = useState<DateRange>(() => rangeFromDays(30))
  const [rangeKey, setRangeKey] = useState<ReportRangeKey | "custom">("30d")
  const [status, setStatus] = useState<OrderStatus | "all">("all")
  const [granularity, setGranularity] = useState<ReportGranularity>("week")

  const from = range.from ?? DATE_BOUNDS.from
  const to = range.to ?? DATE_BOUNDS.to

  const filtered = useMemo(() => filterOrdersByRange(orders, from, to, status), [from, to, status])
  const kpis = useMemo(() => getReportKpis(filtered), [filtered])
  const revenueSeries = useMemo(() => getRevenueSeries(filtered, from, to, granularity), [filtered, from, to, granularity])
  const statusBreakdown = useMemo(() => getStatusBreakdown(filtered), [filtered])
  const paymentBreakdown = useMemo(() => getPaymentBreakdown(filtered), [filtered])
  const topProducts = useMemo(() => getTopProducts(filtered), [filtered])

  const granularityLabel = REPORT_GRANULARITIES.find((item) => item.value === granularity)?.label ?? ""

  const selectQuickRange = (key: ReportRangeKey) => {
    const option = REPORT_RANGES.find((item) => item.key === key)
    if (!option) return
    setRangeKey(key)
    setRange(rangeFromDays(option.days))
    setGranularity(option.granularity)
  }

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCompactCurrency(kpis.revenue),
      description: `${formatNumber(kpis.recognizedOrders)} đơn ghi nhận`,
      icon: Wallet,
      tone: "success" as const,
    },
    {
      title: "Tổng đơn hàng",
      value: kpis.orderCount,
      description: "Trong khoảng đã chọn",
      icon: ShoppingCart,
      tone: "primary" as const,
    },
    {
      title: "Giá trị đơn trung bình",
      value: formatCompactCurrency(kpis.averageOrderValue),
      description: "Trên đơn không huỷ",
      icon: Receipt,
      tone: "info" as const,
    },
    {
      title: "Đơn đã giao",
      value: kpis.completedOrders,
      description: "Giao hàng thành công",
      icon: CircleCheck,
      tone: "success" as const,
    },
  ]

  const paymentData = paymentBreakdown.map((item) => ({
    ...item,
    label: PAYMENT_METHOD_META[item.method].label,
  }))

  return (
    <DashboardTemplate
      title="Báo cáo"
      description="Doanh thu, đơn hàng và sản phẩm bán chạy theo khoảng thời gian."
      actions={
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {REPORT_RANGES.map((option) => (
              <Button
                key={option.key}
                type="button"
                size="lg"
                variant={rangeKey === option.key ? "default" : "outline"}
                aria-pressed={rangeKey === option.key}
                onClick={() => selectQuickRange(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <DateFilter
              value={range}
              onChange={(next) => {
                setRange(next)
                setRangeKey("custom")
              }}
            />
            <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus | "all")}>
              <SelectTrigger className="h-9 w-44" aria-label="Lọc báo cáo theo trạng thái đơn">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(ORDER_STATUS_META).map(([value, meta]) => (
                  <SelectItem key={value} value={value}>
                    {meta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      stats={stats}
      charts={
        <SectionCard
          title="Doanh thu"
          description={`${formatDate(from)} – ${formatDate(to)} · ${granularityLabel.toLowerCase()}`}
          actions={
            <Select value={granularity} onValueChange={(value) => setGranularity(value as ReportGranularity)}>
              <SelectTrigger className="h-9 w-36" aria-label="Nhóm doanh thu theo thời gian">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_GRANULARITIES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="report-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  width={52}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(Number(value) / 1_000_000)}tr`}
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
                  fill="url(#report-revenue-fill)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      }
      recentActivity={
        <SectionCard title="Đơn theo trạng thái" description={`${formatNumber(kpis.orderCount)} đơn trong kỳ`}>
          <ul className="flex flex-col gap-4">
            {statusBreakdown.map((item) => {
              const meta = ORDER_STATUS_META[item.status]
              return (
                <li key={item.status} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge tone={meta.tone} dot>
                      {meta.label}
                    </StatusBadge>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatNumber(item.count)}
                      <span className="ml-1 font-normal text-muted-foreground">({item.percentage}%)</span>
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={item.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${meta.label}: ${item.percentage}%`}
                  >
                    <div
                      className={cn("h-full rounded-full", TONE_BAR[meta.tone])}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      }
    >
      {kpis.orderCount === 0 ? (
        <EmptyState
          title="Không có dữ liệu trong khoảng đã chọn"
          description="Chọn khoảng ngày khác hoặc bỏ lọc trạng thái để xem báo cáo."
          action={
            <Button variant="outline" onClick={() => selectQuickRange("30d")}>
              Về 30 ngày gần nhất
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Phương thức thanh toán" description="Tỷ lệ đơn theo cách thanh toán">
            <div className="flex flex-col gap-4">
              <div className="h-56 w-full" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={2}
                      isAnimationActive={false}
                    >
                      {paymentData.map((item, index) => (
                        <Cell key={item.method} fill={`var(--chart-${index + 1})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        fontSize: 13,
                      }}
                      labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                      formatter={(value, name) => [`${formatNumber(Number(value))} đơn`, String(name)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex flex-col gap-3">
                {paymentData.map((item, index) => (
                  <li key={item.method} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={cn("size-2.5 shrink-0 rounded-full", PAYMENT_DOTS[index])} aria-hidden="true" />
                      <span className="truncate text-[15px]">{item.label}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums">
                      <span className="font-semibold">{formatNumber(item.count)}</span> đơn · {item.percentage}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Sản phẩm bán chạy" description="Xếp theo doanh thu sản phẩm">
            {topProducts.length === 0 ? (
              <p className="text-[15px] text-muted-foreground">Chưa có sản phẩm trong khoảng đã chọn.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-2">Sản phẩm</TableHead>
                    <TableHead className="px-2 text-right">Đã bán</TableHead>
                    <TableHead className="px-2 text-right">Doanh thu</TableHead>
                    <TableHead className="px-2 text-right">Tỷ trọng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="px-2 py-3 whitespace-normal">
                        <div className="flex min-w-0 flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-2 text-right tabular-nums">{formatNumber(item.units)}</TableCell>
                      <TableCell className="px-2 text-right font-medium tabular-nums">
                        {formatCurrency(item.revenue)}
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className="h-1.5 w-12 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-valuenow={Math.round(item.percentage)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${item.name}: ${item.percentage}% doanh thu sản phẩm`}
                          >
                            <div className="h-full rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                          </div>
                          <span className="w-12 text-right text-xs tabular-nums">{item.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </div>
      )}
    </DashboardTemplate>
  )
}

export default ReportsPage
