import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { ReactNode } from "react"
import { DataTable } from "@/components/data-table/DataTable"
import { ErrorState } from "@/components/data-display/ErrorState"
import { FilterBar } from "@/components/filters/FilterBar"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

export interface ListTemplateProps<TData> {
  title: string
  description?: string
  actions?: ReactNode
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  isLoading?: boolean
  /** Có lỗi thì bảng được thay bằng ErrorState. */
  error?: string | null
  onRetry?: () => void
  /** Control lọc (SearchInput, Select, DateFilter…) — trang tự giữ state. */
  filters?: ReactNode
  onResetFilters?: () => void
  emptyState?: ReactNode
  pageSize?: number
  initialSorting?: SortingState
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData, index: number) => string
  caption?: string
  className?: string
}

export function ListTemplate<TData>({
  title,
  description,
  actions,
  columns,
  data,
  isLoading,
  error,
  onRetry,
  filters,
  onResetFilters,
  emptyState,
  pageSize,
  initialSorting,
  onRowClick,
  getRowId,
  caption,
  className,
}: ListTemplateProps<TData>) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader title={title} description={description}>
        {actions}
      </PageHeader>

      {error ? (
        <ErrorState description={error} onRetry={onRetry} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          emptyState={emptyState}
          toolbar={filters ? <FilterBar onReset={onResetFilters}>{filters}</FilterBar> : undefined}
          pageSize={pageSize}
          initialSorting={initialSorting}
          onRowClick={onRowClick}
          getRowId={getRowId}
          caption={caption}
        />
      )}
    </div>
  )
}
