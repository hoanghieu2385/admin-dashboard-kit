import type { ColumnDef } from "@tanstack/react-table"
import { Ellipsis, Eye } from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { SortableHeader } from "@/components/data-table/SortableHeader"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge } from "@/components/data-display/StatusBadge"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { DateFilter, type DateRange } from "@/components/filters/DateFilter"
import { SearchInput } from "@/components/filters/SearchInput"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import { ORDER_STATUSES, PAYMENT_METHODS } from "@/lib/order-utils"
import {
  ORDER_STATUS_META,
  PAYMENT_METHOD_META,
  PAYMENT_STATUS_META,
  orders,
} from "@/mocks/orders.mock"
import { ListTemplate } from "@/templates/list/ListTemplate"
import type { Order, OrderStatus, PaymentMethod } from "@/types/order"
import { OrderStatusMenu } from "@/pages/orders/OrderStatusMenu"

type StatusFilter = OrderStatus | "all"
type MethodFilter = PaymentMethod | "all"

interface PendingUpdate {
  order: Order
  next: OrderStatus
}

const itemCount = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0)

export function OrdersPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Order[]>(orders)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [method, setMethod] = useState<MethodFilter>("all")
  const [dateRange, setDateRange] = useState<DateRange>({})
  const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((order) => {
      const day = order.createdAt.slice(0, 10)
      const matchesTerm =
        term === "" || order.code.toLowerCase().includes(term) || order.customerName.toLowerCase().includes(term)
      const matchesStatus = status === "all" || order.status === status
      const matchesMethod = method === "all" || order.paymentMethod === method
      const matchesFrom = !dateRange.from || day >= dateRange.from
      const matchesTo = !dateRange.to || day <= dateRange.to
      return matchesTerm && matchesStatus && matchesMethod && matchesFrom && matchesTo
    })
  }, [rows, search, status, method, dateRange])

  const hasFilters = search !== "" || status !== "all" || method !== "all" || Boolean(dateRange.from || dateRange.to)

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setMethod("all")
    setDateRange({})
  }

  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "code",
        header: ({ column }) => <SortableHeader column={column} label="Mã đơn" />,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.code}</span>
            <span className="text-xs text-muted-foreground">{row.original.customerId}</span>
          </div>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Khách hàng",
        cell: ({ row }) => <span className="font-medium">{row.original.customerName}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <SortableHeader column={column} label="Ngày đặt" />,
        cell: ({ row }) => (
          <span className="tabular-nums">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: "items",
        accessorFn: (order) => itemCount(order),
        header: ({ column }) => <SortableHeader column={column} label="Số lượng" />,
        cell: ({ row }) => <span className="tabular-nums">{formatNumber(itemCount(row.original))}</span>,
      },
      {
        accessorKey: "total",
        header: ({ column }) => <SortableHeader column={column} label="Tổng tiền" />,
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums whitespace-nowrap">{formatCurrency(row.original.total)}</span>
        ),
      },
      {
        id: "payment",
        header: "Thanh toán",
        cell: ({ row }) => {
          const paymentMeta = PAYMENT_STATUS_META[row.original.paymentStatus]
          return (
            <div className="flex flex-col items-start gap-1">
              <span className="text-[15px]">{PAYMENT_METHOD_META[row.original.paymentMethod].label}</span>
              <StatusBadge tone={paymentMeta.tone}>{paymentMeta.label}</StatusBadge>
            </div>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const meta = ORDER_STATUS_META[row.original.status]
          return (
            <StatusBadge tone={meta.tone} dot>
              {meta.label}
            </StatusBadge>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button asChild variant="ghost" size="icon" className="size-9">
              <Link to={`/orders/${row.original.id}`} aria-label={`Xem đơn ${row.original.code}`}>
                <Eye aria-hidden="true" />
              </Link>
            </Button>
            <OrderStatusMenu
              status={row.original.status}
              onSelect={(next) => setPendingUpdate({ order: row.original, next })}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label={`Đổi trạng thái đơn ${row.original.code}`}
                >
                  <Ellipsis aria-hidden="true" />
                </Button>
              }
            />
          </div>
        ),
      },
    ],
    []
  )

  return (
    <>
      <ListTemplate
        title="Đơn hàng"
        description={`Tổng ${formatNumber(rows.length)} đơn hàng · ${formatNumber(filtered.length)} đang hiển thị`}
        columns={columns}
        data={filtered}
        pageSize={10}
        initialSorting={[{ id: "createdAt", desc: true }]}
        getRowId={(row) => row.id}
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
        caption="Danh sách đơn hàng, nhấn Enter để xem chi tiết."
        filters={
          <>
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder="Tìm mã đơn hoặc khách hàng"
              label="Tìm theo mã đơn hoặc tên khách hàng"
            />
            <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
              <SelectTrigger className="h-9 w-44" aria-label="Lọc theo trạng thái đơn">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {ORDER_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {ORDER_STATUS_META[value].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={(value) => setMethod(value as MethodFilter)}>
              <SelectTrigger className="h-9 w-48" aria-label="Lọc theo phương thức thanh toán">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi phương thức</SelectItem>
                {PAYMENT_METHODS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {PAYMENT_METHOD_META[value].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DateFilter value={dateRange} onChange={setDateRange} />
          </>
        }
        onResetFilters={hasFilters ? resetFilters : undefined}
        emptyState={
          <EmptyState
            title="Không có đơn hàng phù hợp"
            description="Thử từ khoá khác, đổi khoảng ngày hoặc xoá bộ lọc."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Xoá bộ lọc
              </Button>
            }
          />
        }
      />

      <ConfirmDialog
        open={pendingUpdate !== null}
        onOpenChange={(open) => {
          if (!open) setPendingUpdate(null)
        }}
        title={pendingUpdate?.next === "cancelled" ? "Huỷ đơn hàng?" : "Cập nhật trạng thái?"}
        description={
          pendingUpdate
            ? pendingUpdate.next === "cancelled"
              ? `Đơn ${pendingUpdate.order.code} sẽ được giữ lại với trạng thái Đã huỷ.`
              : `Chuyển đơn ${pendingUpdate.order.code} sang "${ORDER_STATUS_META[pendingUpdate.next].label}".`
            : undefined
        }
        confirmLabel={pendingUpdate?.next === "cancelled" ? "Huỷ đơn" : "Cập nhật"}
        tone={pendingUpdate?.next === "cancelled" ? "danger" : "default"}
        onConfirm={() => {
          if (!pendingUpdate) return
          const { order, next } = pendingUpdate
          setRows((current) =>
            current.map((row) => (row.id === order.id ? { ...row, status: next } : row))
          )
          toast.success(`Đơn ${order.code}: ${ORDER_STATUS_META[next].label}`)
          setPendingUpdate(null)
        }}
      />
    </>
  )
}

export default OrdersPage
