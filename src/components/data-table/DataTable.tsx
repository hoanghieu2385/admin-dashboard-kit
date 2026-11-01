import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { useState, type ReactNode } from "react"
import { Pagination } from "@/components/data-table/Pagination"
import { EmptyState } from "@/components/data-display/EmptyState"
import { LoadingState } from "@/components/data-display/LoadingState"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

/** Click vào các control này không được coi là click vào dòng. */
const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, label, [role='checkbox'], [role='switch']"

export interface DataTableProps<TData> {  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  isLoading?: boolean
  /** Thay cho trạng thái rỗng mặc định. */
  emptyState?: ReactNode
  /** Slot phía trên bảng: SearchInput, FilterBar, nút thêm mới… */
  toolbar?: ReactNode
  pageSize?: number
  initialSorting?: SortingState
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData, index: number) => string
  caption?: string
  className?: string
}

/**
 * Bảng generic: phân trang + sắp xếp xử lý phía client bằng TanStack Table.
 * Không biết gì về nghiệp vụ — cột, dữ liệu và hành vi đều do trang truyền vào.
 * `min-w-0` ở gốc: bảng rộng hơn màn hình phải cuộn trong card, không đẩy vỡ layout cha.
 */
export function DataTable<TData>({  columns,
  data,
  isLoading = false,
  emptyState,
  toolbar,
  pageSize = 10,
  initialSorting = [],
  onRowClick,
  getRowId,
  caption,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    getRowId,
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}

      {isLoading ? (
        <LoadingState rows={pageSize > 6 ? 6 : pageSize} label="Đang tải bảng dữ liệu" />
      ) : data.length === 0 ? (
        (emptyState ?? <EmptyState title="Chưa có dữ liệu" description="Khi có bản ghi, danh sách sẽ hiện ở đây." />)
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              {caption ? <caption className="px-3 pb-3 text-left text-sm text-muted-foreground">{caption}</caption> : null}
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-3 text-xs tracking-wide text-muted-foreground uppercase">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={
                      onRowClick
                        ? (event) => {
                            // Bỏ qua click phát ra từ control bên trong ô (nút, link, input…).
                            if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return
                            onRowClick(row.original)
                          }
                        : undefined
                    }
                    className={onRowClick ? "cursor-pointer" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => {
                            if (event.target !== event.currentTarget) return
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              onRowClick(row.original)
                            }
                          }
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={pageCount}
            onPageChange={(index) => table.setPageIndex(index)}
          />
        </>
      )}
    </div>
  )
}
