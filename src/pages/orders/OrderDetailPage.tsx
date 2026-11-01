import { ArrowLeft, Ban, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router"
import { toast } from "sonner"
import { SectionCard } from "@/components/common/SectionCard"
import { DescriptionList } from "@/components/data-display/DescriptionList"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge } from "@/components/data-display/StatusBadge"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate, formatNumber } from "@/lib/format"
import { getNextOrderStatuses, getOrderTimeline } from "@/lib/order-utils"
import { ORDER_STATUS_META, PAYMENT_METHOD_META, PAYMENT_STATUS_META, orders } from "@/mocks/orders.mock"
import { DetailTemplate } from "@/templates/detail/DetailTemplate"
import type { OrderStatus } from "@/types/order"
import { cn } from "@/lib/utils"
import { OrderStatusMenu } from "@/pages/orders/OrderStatusMenu"

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const source = orders.find((order) => order.id === orderId)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>({})
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null)

  if (!source) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Đơn hàng" description="Không tìm thấy bản ghi yêu cầu." />
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description={`Mã "${orderId ?? ""}" không tồn tại hoặc đã bị xoá.`}
          action={
            <Button asChild variant="outline">
              <Link to="/orders">Về danh sách đơn hàng</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const order = { ...source, status: statusOverrides[source.id] ?? source.status }
  const statusMeta = ORDER_STATUS_META[order.status]
  const paymentMeta = PAYMENT_STATUS_META[order.paymentStatus]
  const nextStatuses = getNextOrderStatuses(order.status)
  const canCancel = nextStatuses.includes("cancelled")
  const timeline = getOrderTimeline(order)
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const taxRate = order.subtotal - order.discount > 0 ? Math.round((order.tax / (order.subtotal - order.discount)) * 100) : 0

  return (
    <>
      <DetailTemplate
        title={`Đơn hàng ${order.code}`}
        description={`Đặt lúc ${formatDate(order.createdAt, "dd/MM/yyyy HH:mm")}`}
        status={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={statusMeta.tone} dot>
              {statusMeta.label}
            </StatusBadge>
            <StatusBadge tone={paymentMeta.tone}>{paymentMeta.label}</StatusBadge>
          </div>
        }
        actions={
          <>
            <Button asChild variant="ghost" className="h-11">
              <Link to="/orders">
                <ArrowLeft aria-hidden="true" />
                Danh sách
              </Link>
            </Button>
            {canCancel ? (
              <Button
                variant="destructive"
                className="h-11"
                onClick={() => setPendingStatus("cancelled")}
              >
                <Ban aria-hidden="true" />
                Huỷ đơn
              </Button>
            ) : null}
            <OrderStatusMenu
              status={order.status}
              onSelect={setPendingStatus}
              trigger={
                <Button className="h-11">
                  Cập nhật trạng thái
                  <ChevronDown aria-hidden="true" />
                </Button>
              }
            />
          </>
        }
        metadata={[
          { label: "Mã đơn hàng", value: order.code },
          { label: "Ngày đặt", value: formatDate(order.createdAt, "dd/MM/yyyy HH:mm") },
          { label: "Phương thức thanh toán", value: PAYMENT_METHOD_META[order.paymentMethod].label },
          {
            label: "Trạng thái thanh toán",
            value: <StatusBadge tone={paymentMeta.tone}>{paymentMeta.label}</StatusBadge>,
          },
          { label: "Số sản phẩm", value: `${formatNumber(totalQuantity)} sản phẩm` },
        ]}
        related={
          <SectionCard title="Khách hàng" description={`Mã ${order.customerId}`}>
            <DescriptionList
              columns={1}
              items={[
                { label: "Họ tên", value: order.customerName },
                {
                  label: "Email",
                  value: (
                    <a href={`mailto:${order.customerEmail}`} className="text-primary hover:underline">
                      {order.customerEmail}
                    </a>
                  ),
                },
                {
                  label: "Điện thoại",
                  value: (
                    <a href={`tel:${order.customerPhone.replaceAll(" ", "")}`} className="text-primary hover:underline">
                      {order.customerPhone}
                    </a>
                  ),
                },
                { label: "Địa chỉ giao hàng", value: order.shippingAddress },
              ]}
            />
          </SectionCard>
        }
      >
        <SectionCard title="Sản phẩm" description={`${formatNumber(order.items.length)} mặt hàng`}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-2">Sản phẩm</TableHead>
                <TableHead className="px-2 text-right">SL</TableHead>
                <TableHead className="px-2 text-right">Đơn giá</TableHead>
                <TableHead className="px-2 text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="px-2 py-3 whitespace-normal">
                    <div className="flex min-w-0 flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-2 text-right tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="px-2 text-right tabular-nums">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="px-2 text-right font-medium tabular-nums">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Thanh toán" description="Số tiền của đơn hàng">
          <dl className="flex flex-col gap-3 text-[15px]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Tạm tính</dt>
              <dd className="tabular-nums">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Giảm giá</dt>
              <dd className="tabular-nums">
                {order.discount > 0 ? `-${formatCurrency(order.discount)}` : formatCurrency(0)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Phí vận chuyển</dt>
              <dd className="tabular-nums">{formatCurrency(order.shippingFee)}</dd>
            </div>
            {order.tax > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Thuế (VAT {taxRate}%)</dt>
                <dd className="tabular-nums">{formatCurrency(order.tax)}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 border-t border-border pt-3 text-base font-semibold">
              <dt>Tổng cộng</dt>
              <dd className="tabular-nums">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Lịch sử đơn hàng" description="Các mốc xử lý của đơn">
          <ol className="flex flex-col" aria-label="Lịch sử đơn hàng">
            {timeline.map((step, index) => (
              <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
                {index < timeline.length - 1 ? (
                  <span className="absolute top-4 left-[5px] h-full w-px bg-border" aria-hidden="true" />
                ) : null}
                <span
                  className={cn(
                    "mt-1 size-2.5 shrink-0 rounded-full",
                    step.state === "pending" && "bg-muted-foreground/40",
                    step.state === "done" && (step.tone === "danger" ? "bg-destructive" : "bg-success"),
                    step.state === "current" && "bg-primary ring-4 ring-primary/15"
                  )}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="text-[15px] font-medium">
                    {step.label}
                    {step.state === "current" ? <span className="sr-only"> (hiện tại)</span> : null}
                  </p>
                  {step.at ? (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatDate(step.at, "dd/MM/yyyy HH:mm")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Chưa thực hiện</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </DetailTemplate>

      <ConfirmDialog
        open={pendingStatus !== null}
        onOpenChange={(open) => {
          if (!open) setPendingStatus(null)
        }}
        title={pendingStatus === "cancelled" ? "Huỷ đơn hàng?" : "Cập nhật trạng thái?"}
        description={
          pendingStatus
            ? pendingStatus === "cancelled"
              ? `Đơn ${order.code} sẽ được giữ lại với trạng thái Đã huỷ, không xoá dữ liệu.`
              : `Chuyển đơn ${order.code} sang "${ORDER_STATUS_META[pendingStatus].label}".`
            : undefined
        }
        confirmLabel={pendingStatus === "cancelled" ? "Huỷ đơn" : "Cập nhật"}
        tone={pendingStatus === "cancelled" ? "danger" : "default"}
        onConfirm={() => {
          if (!pendingStatus) return
          setStatusOverrides((current) => ({ ...current, [order.id]: pendingStatus }))
          toast.success(`Đơn ${order.code}: ${ORDER_STATUS_META[pendingStatus].label}`)
          setPendingStatus(null)
        }}
      />
    </>
  )
}

export default OrderDetailPage
