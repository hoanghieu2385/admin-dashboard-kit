# Page templates — admin-dashboard-kit

Template là tầng bố cục trang: nhận **dữ liệu qua props/children**, phát **hành vi qua callback**, không import `mocks/`, không gọi API, không giữ state nghiệp vụ và không biết router.

```
pages/ (state, mock, router, RHF)
  └→ templates/ (bố cục + slot + trạng thái hiển thị)
       └→ components/ (DataTable, FormSection, StatCard, SectionCard…)
```

Demo tham chiếu: `src/pages/examples/` — dùng đúng template, mock nằm trong `src/mocks/`.

| Template | Đường dẫn | Demo |
| --- | --- | --- |
| Dashboard | `@/templates/dashboard/DashboardTemplate` | `/` |
| List | `@/templates/list/ListTemplate` | `/customers`, `/products` |
| Form | `@/templates/form/FormTemplate` | `/customers/new`, `/customers/KH-1001/edit` |
| Detail | `@/templates/detail/DetailTemplate` | `/customers/KH-1001` |
| Settings | `@/templates/settings/SettingsTemplate` | `/settings` |

`FormTemplate` dùng chung cho **Create và Edit**; `mode` chỉ đổi nhãn submit mặc định. Không có template Create/Edit riêng.

## 1. Chọn template

1. Trang tổng quan nhiều số liệu → **DashboardTemplate**.
2. Danh sách có tìm kiếm/lọc/phân trang → **ListTemplate** (luôn dùng `DataTable`, không tự viết `<table>`).
3. Trang nhập liệu có validation → **FormTemplate**.
4. Trang xem một bản ghi + thông tin phụ → **DetailTemplate**.
5. Trang cấu hình chia mục → **SettingsTemplate**.
6. Nội dung không khớp 5 loại trên → ghép `PageHeader` + `SectionCard` trong page, không tạo template mới khi chưa có nhu cầu thứ hai.

Không đưa logic lọc, format, map trạng thái vào template. Page quyết định cột, schema, nhãn và tone.

## 2. DashboardTemplate

### Props

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `title` | `string` | — | PageHeader |
| `description` | `string` | — | |
| `actions` | `ReactNode` | — | nút ở PageHeader |
| `stats` | `StatCardProps[]` | — | số lượng tùy ý, grid tự xuống dòng |
| `charts` | `ReactNode` | — | thường là `SectionCard` chứa Recharts |
| `recentActivity` | `ReactNode` | — | cột 1/3 khi có cả `charts` |
| `children` | `ReactNode` | — | section tùy biến bên dưới |
| `isLoading` | `boolean` | `false` | thay toàn bộ nội dung bằng `LoadingState` |
| `className` | `string` | — | |

### Ví dụ

```tsx
import { Users } from "lucide-react"
import { SectionCard } from "@/components/common/SectionCard"
import { DashboardTemplate } from "@/templates/dashboard/DashboardTemplate"

<DashboardTemplate
  title="Bảng điều khiển"
  description="Tổng quan số liệu."
  stats={[
    { title: "Khách hàng", value: 120, icon: Users, tone: "primary", href: "/customers" },
    { title: "Doanh thu", value: "143 tr", tone: "success" },
  ]}
  charts={<SectionCard title="Doanh thu">…chart…</SectionCard>}
  recentActivity={<SectionCard title="Hoạt động">…danh sách…</SectionCard>}
>
  <SectionCard title="Khối tùy biến">…</SectionCard>
</DashboardTemplate>
```

Responsive: stats `1 → 2 (sm) → 4 (xl)` cột; chart + activity `1 → 2/3 + 1/3 (xl)`.

## 3. ListTemplate

### Props

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `title`, `description`, `actions` | như trên | — | |
| `columns` | `ColumnDef<TData, unknown>[]` | — | TanStack Table |
| `data` | `TData[]` | — | dữ liệu đã lọc/sắp xếp do page quyết định |
| `isLoading` | `boolean` | `false` | `DataTable` tự hiện skeleton |
| `error` | `string \| null` | — | có lỗi thì thay bảng bằng `ErrorState` |
| `onRetry` | `() => void` | — | nút "Thử lại" |
| `filters` | `ReactNode` | — | SearchInput/Select/DateFilter; template bọc trong `FilterBar` |
| `onResetFilters` | `() => void` | — | có thì hiện nút xoá lọc |
| `emptyState` | `ReactNode` | `EmptyState` mặc định | |
| `pageSize` | `number` | `10` | |
| `initialSorting` | `SortingState` | `[]` | |
| `onRowClick` | `(row: TData) => void` | — | click/Enter mở chi tiết |
| `getRowId` | `(row, index) => string` | — | |
| `caption` | `string` | — | mô tả bảng cho screen reader |
| `className` | `string` | — | |

### Ví dụ

```tsx
<ListTemplate
  title="Khách hàng"
  description="Danh sách và quản lý khách hàng."
  actions={<Button asChild><Link to="/customers/new">Thêm khách hàng</Link></Button>}
  columns={columns}
  data={filtered}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(`/customers/${row.id}`)}
  filters={<SearchInput value={search} onValueChange={setSearch} />}
  onResetFilters={hasFilters ? resetFilters : undefined}
  emptyState={<EmptyState title="Không có kết quả" action={<Button onClick={resetFilters}>Xoá bộ lọc</Button>} />}
/>
```

`DataTable` tự phân trang/sắp xếp client và cuộn ngang trong card. Ở mobile bảng > 5 cột sẽ cuộn ngang; nếu cần card list riêng thì dựng page riêng, không nhét vào template.

Bọc `columns` trong `useMemo` ở page: `flexRender` coi mỗi cell function là một component, nên mảng mới mỗi render sẽ remount toàn bộ ô.

## 4. FormTemplate

### Props

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `title`, `description` | `string` | — | |
| `mode` | `"create" \| "edit"` | `"edit"` | chỉ đổi nhãn submit mặc định |
| `form` | `UseFormReturn<TValues>` | — | template bọc `FormProvider` |
| `onSubmit` | `(values: TValues) => void \| Promise<void>` | — | template gọi `form.handleSubmit` |
| `onCancel` | `() => void` | — | nút huỷ |
| `submitLabel` | `string` | `"Tạo mới"` / `"Lưu thay đổi"` | |
| `cancelLabel` | `string` | `"Huỷ"` | |
| `isLoading` | `boolean` | `false` | tải dữ liệu ban đầu |
| `children` | `ReactNode` | — | các `FormSection` |
| `className` | `string` | — | |

### Ví dụ

```tsx
const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues })

<FormTemplate
  title="Thêm khách hàng"
  mode="create"
  form={form}
  onSubmit={handleSubmit}
  onCancel={() => navigate("/customers")}
>
  <FormSection title="Thông tin cơ bản" columns={2}>
    <FormField<Values, "email"> name="email" label="Email" required>
      {({ field, id, invalid }) => <Input id={id} {...field} aria-invalid={invalid} />}
    </FormField>
  </FormSection>
</FormTemplate>
```

- Schema Zod và field do page khai báo; template không biết nghiệp vụ.
- Khi submit, `fieldset` bị disable và `FormActions` hiện spinner + `aria-busy`.
- Edit mode: page đọc `useParams`, tìm dữ liệu và truyền `defaultValues`; nếu không thấy bản ghi thì render `EmptyState` trước khi dùng template.

## 5. DetailTemplate

### Props

| Prop | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `title`, `description` | `string` | — | |
| `status` | `ReactNode` | — | thường là `StatusBadge` |
| `actions` | `ReactNode` | — | nút sửa/quay lại |
| `metadata` | `{ label: string; value: ReactNode }[]` | — | cột phụ |
| `metadataTitle` | `string` | `"Thông tin"` | |
| `related` | `ReactNode` | — | nội dung liên quan, page tự bọc `SectionCard` |
| `children` | `ReactNode` | — | section chính |
| `isLoading` | `boolean` | `false` | |
| `error` | `string \| null` | — | thay nội dung bằng `ErrorState` |
| `onRetry` | `() => void` | — | |
| `className` | `string` | — | |

### Ví dụ

```tsx
<DetailTemplate
  title={customer.name}
  description={customer.id}
  status={<StatusBadge tone="success" dot>Đang hoạt động</StatusBadge>}
  actions={<Button asChild><Link to={`/customers/${customer.id}/edit`}>Chỉnh sửa</Link></Button>}
  metadata={[
    { label: "Email", value: customer.email },
    { label: "Ngày tạo", value: formatDate(customer.createdAt) },
  ]}
  related={<SectionCard title="Đơn hàng gần đây">…</SectionCard>}
>
  <SectionCard title="Ghi chú">…</SectionCard>
</DetailTemplate>
```

Responsive: 1 cột dưới `xl`; từ `xl` main chiếm 2/3, metadata + related chiếm 1/3. Không có metadata/related thì main full width.

## 6. SettingsTemplate

### Props

| Prop | Kiểu | Ghi chú |
| --- | --- | --- |
| `title`, `description` | `string` | |
| `sections` | `{ id, label, icon?, content }[]` | mỗi mục là một vùng nội dung |
| `activeSectionId` | `string` | controlled |
| `onSectionChange` | `(id: string) => void` | |
| `actions` | `ReactNode` | hàng nút cuối trang, thường `FormActions` |
| `className` | `string` | |

### Ví dụ

```tsx
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    <SettingsTemplate
      title="Cài đặt"
      sections={sections}
      activeSectionId={activeSection}
      onSectionChange={setActiveSection}
      actions={
        <FormActions
          onCancel={() => form.reset()}
          isSubmitting={form.formState.isSubmitting}
        />
      }
    />
  </form>
</FormProvider>
```

- Tất cả section được **mount** và ẩn bằng `hidden`, nên field trong tab không active vẫn giữ value và vẫn validate khi submit toàn form.
- Nav tự wrap trên mobile và chuyển cột dọc từ `lg`.
- `actions` nằm trong `<form>` của page nên `FormActions` (type submit) hoạt động bình thường.

## 7. Building block đi kèm

| Component | Dùng khi |
| --- | --- |
| `SectionCard` (`components/common`) | card có tiêu đề cho chart, khối thông tin, section tùy biến |
| `DescriptionList` (`components/data-display`) | cặp nhãn/giá trị trong detail |
| `ErrorState` (`components/data-display`) | lỗi tải dữ liệu + nút thử lại |
| `EmptyState` | không có bản ghi / không có kết quả lọc |
| `LoadingState` | skeleton giữ nhịp layout |

## 8. Trạng thái & responsive

| Trạng thái | Cách dùng |
| --- | --- |
| Loading | `ListTemplate.isLoading`, `Dashboard/Form/Detail.isLoading` |
| Empty | `emptyState` của List; `EmptyState` cho "không tìm thấy bản ghi" |
| Error | `ListTemplate.error` / `DetailTemplate.error` + `onRetry`; route lỗi dùng `ErrorPage` |
| Submit | `FormTemplate` / `FormActions` tự disable + spinner |

Breakpoint kiểm tra: **375 / 768 / 1280**. Không dùng `h-screen`; shell đã `h-dvh` và chỉ `<main>` cuộn.

## 9. Accessibility

- Mỗi trang có đúng một `<h1>` từ `PageHeader`.
- `SectionCard`/`FormSection` dùng `<h2>`.
- Nút icon-only phải có `aria-label` (xem cột action của List).
- Dòng bảng có `onRowClick` nhận focus và Enter/Space; control trong ô không kích hoạt row click.
- Settings nav dùng `aria-current` + `aria-controls`; vùng nội dung có `role="region"` và `aria-label`.

## 10. Route demo (lazy)

| URL | Template |
| --- | --- |
| `/` | Dashboard |
| `/customers`, `/products` | List |
| `/customers/new`, `/customers/:customerId/edit` | Form |
| `/customers/:customerId` | Detail |
| `/settings` | Settings |
| `/components` | Showcase component (không phải template) |
| `/orders`, `/reports` | ComingSoon (Phase 5) |

Route khai báo `lazy` trong `src/app/routes.tsx`; `HydrateFallback` của route gốc render shell + `LoadingState` khi truy cập trực tiếp bằng URL. 404 dùng `ErrorPage`.
