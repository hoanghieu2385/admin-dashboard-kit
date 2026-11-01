import { ArrowLeft, Pencil } from "lucide-react"
import { Link, useParams } from "react-router"
import { SectionCard } from "@/components/common/SectionCard"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge } from "@/components/data-display/StatusBadge"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/format"
import { CUSTOMER_STATUS_META, customers } from "@/mocks/customers"
import { ORDER_STATUS_META, orders } from "@/mocks/orders"
import { DetailTemplate } from "@/templates/detail/DetailTemplate"

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const customer = customers.find((item) => item.id === customerId)

  if (!customer) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Khách hàng" description="Không tìm thấy bản ghi yêu cầu." />
        <EmptyState
          title="Không tìm thấy khách hàng"
          description={`Mã "${customerId ?? ""}" không tồn tại hoặc đã bị xoá.`}
          action={
            <Button asChild variant="outline">
              <Link to="/customers">Về danh sách khách hàng</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const statusMeta = CUSTOMER_STATUS_META[customer.status]
  const customerOrders = orders.filter((order) => order.customerId === customer.id)
  const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)
  const lastOrder = customerOrders[0]

  return (
    <DetailTemplate
      title={customer.name}
      description={`${customer.company} · ${customer.id}`}
      status={
        <StatusBadge tone={statusMeta.tone} dot>
          {statusMeta.label}
        </StatusBadge>
      }
      actions={
        <>
          <Button asChild variant="ghost" className="h-11">
            <Link to="/customers">
              <ArrowLeft aria-hidden="true" />
              Danh sách
            </Link>
          </Button>
          <Button asChild className="h-11">
            <Link to={`/customers/${customer.id}/edit`}>
              <Pencil aria-hidden="true" />
              Chỉnh sửa
            </Link>
          </Button>
        </>
      }
      metadata={[
        { label: "Mã khách hàng", value: customer.id },
        {
          label: "Email",
          value: (
            <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
              {customer.email}
            </a>
          ),
        },
        {
          label: "Điện thoại",
          value: (
            <a href={`tel:${customer.phone.replaceAll(" ", "")}`} className="text-primary hover:underline">
              {customer.phone}
            </a>
          ),
        },
        { label: "Gói dịch vụ", value: customer.plan },
        { label: "Ngày tạo", value: formatDate(customer.createdAt) },
        { label: "Địa chỉ", value: customer.address },
      ]}
      related={
        <SectionCard title="Đơn hàng gần đây" description={`${customerOrders.length} đơn hàng`}>
          {customerOrders.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">Khách hàng chưa có đơn hàng nào.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {customerOrders.map((order) => {
                const meta = ORDER_STATUS_META[order.status]
                return (
                  <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 flex-col">
                      <span className="font-medium">{order.code}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums">{formatCurrency(order.total)}</span>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </SectionCard>
      }
    >
      <SectionCard title="Tổng quan" description="Số liệu từ các đơn hàng minh hoạ">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Tổng đơn hàng</span>
            <span className="text-xl font-bold break-words tabular-nums">{customerOrders.length}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Tổng chi tiêu</span>
            <span className="text-xl font-bold break-words tabular-nums">{formatCurrency(totalSpent)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Đơn gần nhất</span>
            <span className="text-xl font-bold break-words">{lastOrder ? lastOrder.code : "Chưa có"}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Ghi chú" description="Thông tin nội bộ của khách hàng">
        <p className="text-[15px] whitespace-pre-line">
          {customer.notes || <span className="text-muted-foreground">Chưa có ghi chú.</span>}
        </p>
      </SectionCard>
    </DetailTemplate>
  )
}

export default CustomerDetailPage
