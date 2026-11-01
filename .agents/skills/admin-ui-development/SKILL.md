---
name: admin-ui-development
description: Build or modify an admin page in this React 19 + Vite + shadcn/ui kit using the existing page templates, components, mock data, navigation and lazy routes. Use for new CRUD screens, list/search/filter pages, detail pages, create/edit forms, dashboards, settings sections, or wiring demo interactions.
---

# Admin UI development

Xây page quản trị bằng những gì repo đã có. Không thiết kế lại layout, không viết lại bảng/form.

## 1. Đọc trước (theo thứ tự)

1. `AGENTS.md` — luật, quality gate.
2. `HANDOFF.md` — trạng thái, việc đang làm.
3. `docs/page-templates.md` — chọn template + props.
4. `docs/components.md` — component + props thật.
5. `UI_GUIDELINES.md` — token, layout, responsive, a11y.
6. Page tương tự trong `src/pages/` — copy pattern, không copy nghiệp vụ.

## 2. Chọn template

| Trang | Template |
| --- | --- |
| tổng quan/KPI/chart | `DashboardTemplate` |
| danh sách + tìm kiếm/lọc/phân trang | `ListTemplate` |
| tạo mới hoặc chỉnh sửa + validation | `FormTemplate` (`mode`) |
| xem một bản ghi | `DetailTemplate` |
| cấu hình chia mục | `SettingsTemplate` |
| không khớp | `PageHeader` + `SectionCard`, chưa tạo template mới |

## 3. Luồng triển khai

1. **Type**: dùng chung → `src/types/<domain>.ts`; chỉ một file → khai báo tại page.
2. **Mock**: `src/mocks/<domain>.mock.ts`; dữ liệu hư cấu; export type + mảng + metadata trạng thái nếu cần.
3. **Page**: `src/pages/<domain>/` — state lọc/sort/format ở page.
4. **Nav**: `src/config/nav.ts` nếu mục cần hiện trong sidebar/breadcrumb.
5. **Route**: `src/app/routes.tsx` bằng `lazyPage()`.
6. **Kiểm**: typecheck → lint → build → UI 375/768/1280 → light/dark → keyboard → console.

## 4. Mẫu list page

```tsx
const columns = useMemo<ColumnDef<Supplier, unknown>[]>(
  () => [
    { accessorKey: "name", header: ({ column }) => <SortableHeader column={column} label="Nhà cung cấp" /> },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "status", header: "Trạng thái", cell: ({ row }) => <StatusBadge tone={...}>{...}</StatusBadge> },
  ],
  []
)

<ListTemplate
  title="Nhà cung cấp"
  description="Danh sách và trạng thái nhà cung cấp."
  actions={<Button asChild><Link to="/suppliers/new">Thêm nhà cung cấp</Link></Button>}
  columns={columns}
  data={filtered}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(`/suppliers/${row.id}`)}
  filters={<><SearchInput value={search} onValueChange={setSearch} /><FilterBar ... /></>}
  onResetFilters={hasFilters ? reset : undefined}
  emptyState={<EmptyState title="Không có nhà cung cấp" action={<Button onClick={reset}>Xoá bộ lọc</Button>} />}
/>
```

- Bọc `columns` trong `useMemo` — tránh remount ô mỗi render.
- Không truyền `FilterBar` lồng trong `filters` nếu `ListTemplate` đã bọc; chỉ truyền các control.
- Cột trạng thái: page map nhãn + tone; kit không có enum nghiệp vụ.

## 5. Mẫu form page

- Schema Zod + `useForm` trong page.
- `FormTemplate` bọc `FormProvider`; field dùng `FormField` render-prop.
- Create/edit dùng chung page qua `mode` hoặc `useParams`; không tạo template mới.
- Submit: cập nhật mock/state, `toast()`, điều hướng về list.
- Không đặt schema/nghiệp vụ trong `components/forms`.

## 6. Route + nav

```tsx
{ path: "suppliers", lazy: lazyPage(() => import("@/pages/suppliers/SuppliersPage")) },
{ path: "suppliers/:supplierId", lazy: lazyPage(() => import("@/pages/suppliers/SupplierDetailPage")) },
```

```ts
{ label: "Nhà cung cấp", href: "/suppliers", icon: Truck }
```

Route chi tiết phải xử lý id không tồn tại bằng `EmptyState`/`ErrorState`, không crash.

## 7. Checklist trước khi báo xong

- [ ] Đúng template, không dựng lại `PageHeader`/`DataTable`/form.
- [ ] Mock đúng vị trí; không import mock trong component/template.
- [ ] Route lazy + nav + breadcrumb hoạt động; URL trực tiếp không trắng trang.
- [ ] Loading/empty/error có đường thoát (retry/reset/quay lại).
- [ ] Responsive 375/768/1280; bảng cuộn trong card; không tràn ngang.
- [ ] Light + dark; focus ring; Tab/Enter/Esc; `aria-label` cho icon-only.
- [ ] `pnpm typecheck && pnpm lint && pnpm build` sạch; console 0 error.
- [ ] `HANDOFF.md` cập nhật nếu thay đổi phạm vi/kiến trúc.

## 8. Ví dụ prompt

> Thêm module Nhà cung cấp: list có tìm kiếm + lọc trạng thái, form tạo/sửa, trang chi tiết, mock data.
> Dùng template/component có sẵn, thêm nav + lazy route, kiểm 3 breakpoint và dark mode.
