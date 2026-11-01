# Components — admin-dashboard-kit

Tham chiếu API cho component dùng chung. Nguyên tắc: **component không biết nghiệp vụ** — dữ liệu qua props, hành vi qua callback, style override qua `className`.
Demo chạy được: `/components` (`src/pages/ComponentsPage.tsx`).

| Nhóm | Component |
| --- | --- |
| Data display | `StatCard`, `StatusBadge`, `EmptyState`, `LoadingState` |
| Data table | `DataTable`, `Pagination`, `SortableHeader` |
| Filters | `SearchInput`, `FilterBar`, `DateFilter` |
| Forms | `FormField`, `FormSection`, `FormActions` |
| Feedback | `ConfirmDialog` |
| Navigation | `Breadcrumbs`, `useBreadcrumbs` |

## 1. Data display

### StatCard — `@/components/data-display/StatCard`

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `title` | `string` | — | nhãn phía trên số |
| `value` | `string \| number` | — | số liệu chính (đã có `tabular-nums`) |
| `description` | `string` | — | dòng phụ dưới số |
| `icon` | `LucideIcon` | — | icon trong khối tone |
| `tone` | `"primary" \| "success" \| "warning" \| "info" \| "neutral"` | `"primary"` | chỉ đổi màu icon |
| `href` | `string` | — | có thì card là `Link` (thêm hover + focus ring) |
| `className` | `string` | — | |

```tsx
<StatCard title="Đang hoạt động" value={6} icon={Users} tone="success" />
<StatCard title="Đang hiển thị" value={filtered.length} description="Sau khi lọc" tone="info" href="/components" />
```

### StatusBadge — `@/components/data-display/StatusBadge`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `children` | `ReactNode` | — |
| `tone` | `"primary" \| "success" \| "warning" \| "danger" \| "info" \| "neutral"` | `"neutral"` |
| `dot` | `boolean` | `false` |
| `className` | `string` | — |

Trang tự map trạng thái → nhãn + tone, kit không chứa enum nghiệp vụ:

```tsx
const STATUS = { active: { label: "Đang hoạt động", tone: "success" }, blocked: { label: "Tạm khoá", tone: "danger" } } as const

<StatusBadge tone={STATUS[row.status].tone} dot>{STATUS[row.status].label}</StatusBadge>
```

### EmptyState — `@/components/data-display/EmptyState`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `title` | `string` | — |
| `description` | `string` | — |
| `icon` | `LucideIcon` | `Inbox` |
| `action` | `ReactNode` | — |
| `className` | `string` | — |

```tsx
<EmptyState title="Không có kết quả" description="Thử từ khoá khác hoặc xoá bộ lọc." action={<Button variant="outline" onClick={reset}>Xoá bộ lọc</Button>} />
```

### LoadingState — `@/components/data-display/LoadingState`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `rows` | `number` | `5` |
| `label` | `string` | `"Đang tải dữ liệu"` |
| `className` | `string` | — |

`role="status"` + `sr-only` label. Dùng cho khối nội dung; `DataTable` đã tự hiện khi `isLoading`.

## 2. Data table

### DataTable — `@/components/data-table/DataTable`

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `columns` | `ColumnDef<TData, unknown>[]` | — | TanStack Table |
| `data` | `TData[]` | — | |
| `isLoading` | `boolean` | `false` | hiện `LoadingState` thay bảng |
| `emptyState` | `ReactNode` | `EmptyState` mặc định | |
| `toolbar` | `ReactNode` | — | slot trên bảng (`FilterBar`…) |
| `pageSize` | `number` | `10` | |
| `initialSorting` | `SortingState` | `[]` | |
| `onRowClick` | `(row: TData) => void` | — | thêm `cursor-pointer`, `tabIndex`, Enter/Space; click từ control trong ô bị bỏ qua |
| `getRowId` | `(row, index) => string` | — | |
| `caption` | `string` | — | `<caption>` cho screen reader |
| `className` | `string` | — | |

Phân trang + sắp xếp chạy phía client. Bảng rộng hơn màn hình sẽ cuộn ngang **bên trong** card (`min-w-0` ở gốc component).

```tsx
const columns: ColumnDef<DemoRow, unknown>[] = [
  { accessorKey: "name", header: ({ column }) => <SortableHeader column={column} label="Khách hàng" /> },
  { accessorKey: "email", header: "Email" },
]

<DataTable
  columns={columns}
  data={filtered}
  pageSize={5}
  onRowClick={(row) => toast(`Đã chọn ${row.name}`)}
  toolbar={<FilterBar onReset={hasFilters ? reset : undefined}>{/* SearchInput, Select, DateFilter */}</FilterBar>}
/>
```

### Pagination — `@/components/data-table/Pagination`

| Prop | Kiểu |
| --- | --- |
| `pageIndex` | `number` (0-based) |
| `pageCount` | `number` |
| `onPageChange` | `(pageIndex: number) => void` |
| `className` | `string` |

`nav aria-label="Phân trang"`, nút Trước/Sau tự `disabled` ở đầu/cuối.

### SortableHeader — `@/components/data-table/SortableHeader`

| Prop | Kiểu |
| --- | --- |
| `column` | `Column<TData, unknown>` |
| `label` | `string` |
| `className` | `string` |

Dùng làm `header` trong `columns`; cột không sort được thì render text thường.

## 3. Filters

### SearchInput — `@/components/filters/SearchInput`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `value` | `string` | — |
| `onValueChange` | `(value: string) => void` | — |
| `placeholder` | `string` | `"Tìm kiếm…"` |
| `debounceMs` | `number` | `300` |
| `label` | `string` | `placeholder` (dùng cho `aria-label`) |
| `className` | `string` | — |

Có nút clear; tự đồng bộ khi trang reset `value` từ bên ngoài. Trong `onValueChange` không cần memo hoá: nhận diện thay đổi qua giá trị.

### FilterBar — `@/components/filters/FilterBar`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `children` | `ReactNode` | — |
| `onReset` | `() => void` | — (có thì hiện nút xoá) |
| `resetLabel` | `string` | `"Xoá bộ lọc"` |
| `className` | `string` | — |

### DateFilter — `@/components/filters/DateFilter`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `value` | `{ from?: string; to?: string }` | — |
| `onChange` | `(value: DateRange) => void` | — |
| `fromLabel` / `toLabel` | `string` | `"Từ ngày"` / `"Đến ngày"` |
| `className` | `string` | — |

Chuỗi `yyyy-mm-dd` (giá trị `input[type=date]`); `max`/`min` chặn khoảng ngược. Không thêm date-picker library.

## 4. Forms (React Hook Form + Zod)

`FormField` đọc `control` từ `useFormContext` → form phải bọc `FormProvider`.

### FormField — `@/components/forms/FormField`

| Prop | Kiểu | Ghi chú |
| --- | --- | --- |
| `name` | `Path<TValues>` | |
| `label` | `string` | |
| `description` | `string` | |
| `required` | `boolean` | thêm dấu `*` |
| `className` | `string` | |
| `children` | `({ field, id, invalid }) => ReactNode` | render prop, bind thủ công |

```tsx
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    <FormSection title="Thông tin cơ bản" columns={2}>
      <FormField<Values, "email"> name="email" label="Email" required description="Dùng để gửi thông báo.">
        {({ field, id, invalid }) => <Input id={id} {...field} type="email" aria-invalid={invalid} />}
      </FormField>
      <FormField<Values, "status"> name="status" label="Trạng thái" required>
        {({ field, id, invalid }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={id} className="w-full" aria-invalid={invalid}><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="active">Đang hoạt động</SelectItem></SelectContent>
          </Select>
        )}
      </FormField>
    </FormSection>
    <FormActions onCancel={() => form.reset()} isSubmitting={form.formState.isSubmitting} />
  </form>
</FormProvider>
```

Render prop là lý do không cần wrapper riêng cho từng control (Input/Select/Textarea/Switch).

### FormSection — `@/components/forms/FormSection`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `title` | `string` | — |
| `description` | `string` | — |
| `columns` | `1 \| 2` | `1` (2 cột từ `md`) |
| `children` | `ReactNode` | — |
| `className` | `string` | — |

### FormActions — `@/components/forms/FormActions`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `submitLabel` | `string` | `"Lưu thay đổi"` |
| `cancelLabel` | `string` | `"Huỷ"` |
| `onCancel` | `() => void` | — (không có thì chỉ hiện nút submit) |
| `isSubmitting` | `boolean` | `false` → spinner + `aria-busy` + disable |
| `className` | `string` | — |

## 5. Feedback

### ConfirmDialog — `@/components/feedback/ConfirmDialog`

| Prop | Kiểu | Mặc định |
| --- | --- | --- |
| `open` | `boolean` | — |
| `onOpenChange` | `(open: boolean) => void` | — |
| `title` | `string` | — |
| `description` | `string` | fallback `sr-only` |
| `confirmLabel` | `string` | `"Xác nhận"` |
| `cancelLabel` | `string` | `"Huỷ"` |
| `tone` | `"default" \| "danger"` | `"default"` |
| `onConfirm` | `() => void` | — |

Dialog đóng ngay khi xác nhận (Radix `AlertDialogAction`); nếu hành động lỗi, trang tự mở lại dialog và báo toast. Luôn render `AlertDialogDescription` (kể cả `sr-only`) để đủ a11y.

```tsx
<ConfirmDialog
  open={pendingDelete !== null}
  onOpenChange={(open) => { if (!open) setPendingDelete(null) }}
  title="Xoá khách hàng?"
  description={pendingDelete ? `${pendingDelete.name} sẽ bị xoá.` : undefined}
  confirmLabel="Xoá"
  tone="danger"
  onConfirm={handleDelete}
/>
```

## 6. Navigation

### Breadcrumbs — `@/components/navigation/Breadcrumbs`

| Prop | Kiểu |
| --- | --- |
| `items` | `{ label: string; href?: string }[]` |
| `className` | `string` |

`<nav aria-label="Đường dẫn">`, item cuối có `aria-current="page"`. `AdminShell` đã render sẵn.

### useBreadcrumbs — `@/hooks/use-breadcrumbs`

Suy ra mảng item từ `config/nav.ts` + URL hiện tại: `Trang chủ → <group> → <item>`. Trang gốc `/` trả `[]` (không hiện breadcrumb). Thêm trang mới chỉ cần khai báo trong `config/nav.ts`.
