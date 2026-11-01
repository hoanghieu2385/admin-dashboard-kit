import type { ColumnDef } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { SortableHeader } from "@/components/data-table/SortableHeader"
import { EmptyState } from "@/components/data-display/EmptyState"
import { StatusBadge } from "@/components/data-display/StatusBadge"
import { SearchInput } from "@/components/filters/SearchInput"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/format"
import { PRODUCT_STATUS_META, products, type Product } from "@/mocks/products.mock"
import { ListTemplate } from "@/templates/list/ListTemplate"

type StatusFilter = "all" | Product["status"]

const CATEGORIES = [...new Set(products.map((product) => product.category))]

export function ProductsPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [category, setCategory] = useState("all")

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((product) => {
      const matchesTerm =
        term === "" || product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)
      const matchesStatus = status === "all" || product.status === status
      const matchesCategory = category === "all" || product.category === category
      return matchesTerm && matchesStatus && matchesCategory
    })
  }, [search, status, category])

  const hasFilters = search !== "" || status !== "all" || category !== "all"

  const resetFilters = () => {
    setSearch("")
    setStatus("all")
    setCategory("all")
  }

  const columns = useMemo<ColumnDef<Product, unknown>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} label="Sản phẩm" />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.sku}</span>
        </div>
      ),
    },
    { accessorKey: "category", header: "Danh mục" },
    {
      accessorKey: "price",
      header: ({ column }) => <SortableHeader column={column} label="Giá" />,
      cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.price)}</span>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <SortableHeader column={column} label="Tồn kho" />,
      cell: ({ row }) => (
        <span
          className={
            row.original.stock === 0
              ? "font-medium text-destructive tabular-nums"
              : row.original.stock <= 10
                ? "font-medium text-warning tabular-nums"
                : "tabular-nums"
          }
        >
          {row.original.stock}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const meta = PRODUCT_STATUS_META[row.original.status]
        return (
          <StatusBadge tone={meta.tone} dot>
            {meta.label}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <SortableHeader column={column} label="Cập nhật" />,
      cell: ({ row }) => <span className="tabular-nums">{formatDate(row.original.updatedAt)}</span>,
    },
  ], [])

  return (
    <ListTemplate
      title="Sản phẩm"
      description="Danh mục sản phẩm, tồn kho và trạng thái."
      columns={columns}
      data={filtered}
      pageSize={8}
      getRowId={(row) => row.id}
      initialSorting={[{ id: "updatedAt", desc: true }]}
      filters={
        <>
          <SearchInput value={search} onValueChange={setSearch} placeholder="Tìm theo tên hoặc SKU" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-40" aria-label="Lọc theo danh mục">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
            <SelectTrigger className="h-9 w-40" aria-label="Lọc theo trạng thái">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="archived">Ngừng bán</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
      onResetFilters={hasFilters ? resetFilters : undefined}
      emptyState={
        <EmptyState
          title="Không có sản phẩm phù hợp"
          description="Thử từ khoá khác hoặc xoá bộ lọc."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Xoá bộ lọc
            </Button>
          }
        />
      }
    />
  )
}

export default ProductsPage
