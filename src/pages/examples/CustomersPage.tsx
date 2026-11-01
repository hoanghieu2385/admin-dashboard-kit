import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { SortableHeader } from "@/components/data-table/SortableHeader"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge } from "@/components/data-display/StatusBadge"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { SearchInput } from "@/components/filters/SearchInput"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/format"
import { CUSTOMER_STATUS_META, customers, type Customer } from "@/mocks/customers"
import { ListTemplate } from "@/templates/list/ListTemplate"

type StatusFilter = "all" | Customer["status"]

export function CustomersPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Customer[]>(customers)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [pendingDelete, setPendingDelete] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesTerm =
        term === "" ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.company.toLowerCase().includes(term)
      const matchesStatus = status === "all" || row.status === status
      return matchesTerm && matchesStatus
    })
  }, [rows, search, status])

  const hasFilters = search !== "" || status !== "all"

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
  }

  const columns = useMemo<ColumnDef<Customer, unknown>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} label="Khách hàng" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.id}</span>
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "plan", header: "Gói" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const meta = CUSTOMER_STATUS_META[row.original.status]
        return (
          <StatusBadge tone={meta.tone} dot>
            {meta.label}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} label="Ngày tạo" />,
      cell: ({ row }) => <span className="tabular-nums">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="size-9">
            <Link to={`/customers/${row.original.id}/edit`} aria-label={`Sửa ${row.original.name}`}>
              <Pencil aria-hidden="true" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-destructive"
            aria-label={`Xoá ${row.original.name}`}
            onClick={() => setPendingDelete(row.original)}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ], [])

  return (
    <>
      <ListTemplate
        title="Khách hàng"
        description="Danh sách, tìm kiếm và quản lý khách hàng."
        actions={
          <Button asChild className="h-11">
            <Link to="/customers/new">
              <Plus aria-hidden="true" />
              Thêm khách hàng
            </Link>
          </Button>
        }
        columns={columns}
        data={filtered}
        pageSize={8}
        getRowId={(row) => row.id}
        onRowClick={(row) => navigate(`/customers/${row.id}`)}
        filters={
          <>
            <SearchInput value={search} onValueChange={setSearch} placeholder="Tìm theo tên, email, công ty" />
            <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
              <SelectTrigger className="h-9 w-44" aria-label="Lọc theo trạng thái">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="blocked">Tạm khoá</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
        onResetFilters={hasFilters ? resetFilters : undefined}
        emptyState={
          <EmptyState
            title="Không có khách hàng phù hợp"
            description="Thử từ khoá khác hoặc xoá bộ lọc."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Xoá bộ lọc
              </Button>
            }
          />
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Xoá khách hàng?"
        description={pendingDelete ? `${pendingDelete.name} sẽ bị xoá khỏi danh sách minh hoạ.` : undefined}
        confirmLabel="Xoá"
        tone="danger"
        onConfirm={() => {
          if (!pendingDelete) return
          setRows((current) => current.filter((row) => row.id !== pendingDelete.id))
          toast.success(`Đã xoá ${pendingDelete.name}`)
          setPendingDelete(null)
        }}
      />
    </>
  )
}

export default CustomersPage
