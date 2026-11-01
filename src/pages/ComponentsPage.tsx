import { zodResolver } from "@hookform/resolvers/zod"
import type { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { AlertTriangle, Plus, Trash2, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DataTable } from "@/components/data-table/DataTable"
import { SortableHeader } from "@/components/data-table/SortableHeader"
import { EmptyState } from "@/components/data-display/EmptyState"
import { LoadingState } from "@/components/data-display/LoadingState"
import { StatCard } from "@/components/data-display/StatCard"
import { StatusBadge, type StatusTone } from "@/components/data-display/StatusBadge"
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog"
import { DateFilter, type DateRange } from "@/components/filters/DateFilter"
import { FilterBar } from "@/components/filters/FilterBar"
import { SearchInput } from "@/components/filters/SearchInput"
import { FormActions } from "@/components/forms/FormActions"
import { FormField } from "@/components/forms/FormField"
import { FormSection } from "@/components/forms/FormSection"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

/** Dữ liệu minh hoạ cho showcase — không phải nghiệp vụ của kit. */
interface DemoRow {
  id: string
  name: string
  email: string
  status: "active" | "pending" | "blocked"
  createdAt: string
}

const STATUS_META: Record<DemoRow["status"], { label: string; tone: StatusTone }> = {
  active: { label: "Đang hoạt động", tone: "success" },
  pending: { label: "Chờ duyệt", tone: "warning" },
  blocked: { label: "Tạm khoá", tone: "danger" },
}

const DEMO_ROWS: DemoRow[] = [
  { id: "KH-1001", name: "Nguyễn An", email: "an.nguyen@example.com", status: "active", createdAt: "2026-10-28" },
  { id: "KH-1002", name: "Trần Bình", email: "binh.tran@example.com", status: "pending", createdAt: "2026-10-30" },
  { id: "KH-1003", name: "Lê Chi", email: "chi.le@example.com", status: "blocked", createdAt: "2026-10-12" },
  { id: "KH-1004", name: "Phạm Dũng", email: "dung.pham@example.com", status: "active", createdAt: "2026-09-30" },
  { id: "KH-1005", name: "Hoàng Em", email: "em.hoang@example.com", status: "active", createdAt: "2026-10-02" },
  { id: "KH-1006", name: "Vũ Giang", email: "giang.vu@example.com", status: "pending", createdAt: "2026-10-05" },
  { id: "KH-1007", name: "Đỗ Hạnh", email: "hanh.do@example.com", status: "active", createdAt: "2026-10-09" },
  { id: "KH-1008", name: "Bùi Khánh", email: "khanh.bui@example.com", status: "blocked", createdAt: "2026-08-21" },
  { id: "KH-1009", name: "Ngô Linh", email: "linh.ngo@example.com", status: "active", createdAt: "2026-10-21" },
  { id: "KH-1010", name: "Trịnh Minh", email: "minh.trinh@example.com", status: "pending", createdAt: "2026-10-24" },
  { id: "KH-1011", name: "Lý Nam", email: "nam.ly@example.com", status: "active", createdAt: "2026-10-25" },
  { id: "KH-1012", name: "Phan Oanh", email: "oanh.phan@example.com", status: "blocked", createdAt: "2026-07-15" },
]

const filterSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  status: z.enum(["active", "pending"]),
  note: z.string().max(200, "Tối đa 200 ký tự").optional(),
})

type FilterFormValues = z.infer<typeof filterSchema>

export function ComponentsPage() {
  const [rows, setRows] = useState<DemoRow[]>(DEMO_ROWS)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | DemoRow["status"]>("all")
  const [range, setRange] = useState<DateRange>({})
  const [pendingDelete, setPendingDelete] = useState<DemoRow | null>(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesTerm =
        term === "" || row.name.toLowerCase().includes(term) || row.email.toLowerCase().includes(term)
      const matchesStatus = status === "all" || row.status === status
      const matchesFrom = !range.from || row.createdAt >= range.from
      const matchesTo = !range.to || row.createdAt <= range.to
      return matchesTerm && matchesStatus && matchesFrom && matchesTo
    })
  }, [rows, search, status, range])

  const hasFilters = search !== "" || status !== "all" || Boolean(range.from) || Boolean(range.to)

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setRange({})
  }

  const columns = useMemo<ColumnDef<DemoRow, unknown>[]>(() => [
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
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <StatusBadge tone={STATUS_META[row.original.status].tone} dot>
          {STATUS_META[row.original.status].label}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} label="Ngày tạo" />,
      cell: ({ row }) => <span className="tabular-nums">{format(parseISO(row.original.createdAt), "dd/MM/yyyy")}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-destructive"
          aria-label={`Xoá ${row.original.name}`}
          onClick={() => setPendingDelete(row.original)}
        >
          <Trash2 aria-hidden="true" />
        </Button>
      ),
    },
  ], [])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="UI Kit"
        description="Showcase component dùng chung: dữ liệu và callback đều truyền từ trang này vào."
      >
        <Button className="h-11">
          <Plus aria-hidden="true" />
          Tạo mới
        </Button>
      </PageHeader>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">StatCard</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Tổng khách hàng" value={rows.length} description="Dữ liệu minh hoạ" icon={Users} tone="primary" />
          <StatCard title="Đang hoạt động" value={rows.filter((row) => row.status === "active").length} icon={Users} tone="success" />
          <StatCard title="Chờ duyệt" value={rows.filter((row) => row.status === "pending").length} icon={AlertTriangle} tone="warning" />
          <StatCard title="Đang hiển thị" value={filtered.length} description="Sau khi lọc" tone="info" href="/components" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">StatusBadge</h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="primary">Mới</StatusBadge>
          <StatusBadge tone="success" dot>
            Thành công
          </StatusBadge>
          <StatusBadge tone="warning" dot>
            Chờ xử lý
          </StatusBadge>
          <StatusBadge tone="danger" dot>
            Thất bại
          </StatusBadge>
          <StatusBadge tone="info">Thông tin</StatusBadge>
          <StatusBadge tone="neutral">Lưu trữ</StatusBadge>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">DataTable + filter</h2>
        <DataTable
          columns={columns}
          data={filtered}
          pageSize={5}
          onRowClick={(row) => toast(`Đã chọn ${row.name}`)}
          toolbar={
            <FilterBar onReset={hasFilters ? resetFilters : undefined}>
              <SearchInput value={search} onValueChange={setSearch} placeholder="Tìm theo tên hoặc email" />
              <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
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
              <DateFilter value={range} onChange={setRange} />
            </FilterBar>
          }
          emptyState={
            <EmptyState
              title="Không có kết quả"
              description="Thử từ khoá khác hoặc xoá bộ lọc."
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Xoá bộ lọc
                </Button>
              }
            />
          }
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Form (React Hook Form + Zod)</h2>
        <DemoForm />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">LoadingState</h2>
        <LoadingState rows={3} />
      </section>

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
    </div>
  )
}

function DemoForm() {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: { name: "", email: "", status: "active", note: "" },
  })

  const onSubmit = async (values: FilterFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    toast.success("Đã lưu (demo, không gọi API)", { description: `${values.name} · ${values.email}` })
    form.reset()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <FormSection title="Thông tin cơ bản" description="Field, label, mô tả và lỗi đều lấy từ FormField." columns={2}>
          <FormField<FilterFormValues, "name"> name="name" label="Tên" required>
            {({ field, id, invalid }) => <Input id={id} {...field} aria-invalid={invalid} placeholder="Nguyễn Văn A" />}
          </FormField>
          <FormField<FilterFormValues, "email"> name="email" label="Email" required description="Dùng để gửi thông báo.">
            {({ field, id, invalid }) => (
              <Input id={id} {...field} type="email" aria-invalid={invalid} placeholder="email@example.com" />
            )}
          </FormField>
          <FormField<FilterFormValues, "status"> name="status" label="Trạng thái" required>
            {({ field, id, invalid }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={id} className="h-9 w-full" aria-invalid={invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField<FilterFormValues, "note"> name="note" label="Ghi chú" className="md:col-span-2">
            {({ field, id, invalid }) => (
              <Textarea id={id} {...field} aria-invalid={invalid} placeholder="Tối đa 200 ký tự" rows={3} />
            )}
          </FormField>
        </FormSection>
        <FormActions onCancel={() => form.reset()} isSubmitting={form.formState.isSubmitting} />
      </form>
    </FormProvider>
  )
}

export default ComponentsPage
