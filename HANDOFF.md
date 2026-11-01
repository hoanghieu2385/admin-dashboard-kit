# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **3 xong → chờ xác nhận sang Phase 4**

## Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). Phase 1 + 2 đã commit (`1cd3497`, `716bae7`); **code Phase 3 chưa commit**.
- Chạy: `pnpm install` → `pnpm dev` (http://localhost:5173). Trang showcase component: **`/components`** (nav "UI Kit").
- Quality gate: `pnpm typecheck` ✅ · `pnpm lint` ✅ (0 error, 0 warning) · `pnpm build` ✅.

## Đã xong Phase 3 — Core components

| File | Props / API (tóm tắt) |
| --- | --- |
| `src/components/data-display/StatCard.tsx` | `title, value, description?, icon?, tone?, href?, className?` |
| `src/components/data-display/StatusBadge.tsx` | `children, tone?, dot?, className?` |
| `src/components/data-display/EmptyState.tsx` | `title, description?, icon?, action?, className?` |
| `src/components/data-display/LoadingState.tsx` | `rows?, label?, className?` (`role="status"`) |
| `src/components/data-table/DataTable.tsx` | `columns, data, isLoading?, emptyState?, toolbar?, pageSize?, initialSorting?, onRowClick?, getRowId?, caption?, className?` |
| `src/components/data-table/Pagination.tsx` | `pageIndex, pageCount, onPageChange, className?` |
| `src/components/data-table/SortableHeader.tsx` | `column, label, className?` |
| `src/components/filters/SearchInput.tsx` | `value, onValueChange, placeholder?, debounceMs?, label?, className?` |
| `src/components/filters/FilterBar.tsx` | `children, onReset?, resetLabel?, className?` |
| `src/components/filters/DateFilter.tsx` | `value {from?,to?}, onChange, fromLabel?, toLabel?, className?` |
| `src/components/forms/FormField.tsx` | `name, label, description?, required?, className?, children({field,id,invalid})` — render prop |
| `src/components/forms/FormSection.tsx` | `title, description?, columns?: 1\|2, children, className?` |
| `src/components/forms/FormActions.tsx` | `submitLabel?, cancelLabel?, onCancel?, isSubmitting?, className?` |
| `src/components/feedback/ConfirmDialog.tsx` | `open, onOpenChange, title, description?, confirmLabel?, cancelLabel?, tone?: "default"\|"danger", onConfirm` |
| `src/components/navigation/Breadcrumbs.tsx` | `items: {label, href?}[], className?` |
| `src/hooks/use-breadcrumbs.ts` | suy breadcrumb từ `config/nav.ts` + URL |

Sửa bổ sung ngoài danh sách component:

| File | Thay đổi |
| --- | --- |
| `src/components/layout/AdminShell.tsx` | skip link "Bỏ qua tới nội dung" (tab stop đầu tiên), render `Breadcrumbs` đầu nội dung |
| `src/components/layout/AdminSidebar.tsx` | nav collapsed dùng `Tooltip` (thay `title` native) + `aria-label` |
| `src/styles/globals.css` | thêm token `--success` `--warning` `--info` (light hex, dark oklch) + map `@theme inline` |
| `src/components/ui/field.tsx` | shadcn `field` (registry 4.x không còn `form`) |
| `src/pages/ComponentsPage.tsx` | trang showcase: StatCard, StatusBadge, DataTable + filter, form RHF+Zod, ConfirmDialog, LoadingState |
| `src/app/routes.tsx` `src/config/nav.ts` | route + nav item `/components` ("UI Kit", icon `Blocks`) |
| `vite.config.ts` | `manualChunks`: react / radix / table / forms |
| `eslint.config.js` | tắt `react-hooks/incompatible-library` riêng cho `DataTable.tsx` (TanStack Table trả hàm không memoize được) |
| `docs/components.md` | **mới** — bảng props + snippet cho 16 component |
| `docs/architecture.md` | D3 → `radix-nova`; thêm D10–D13; cập nhật cây thư mục + Phase 3 |
| `UI_GUIDELINES.md` | token `success/warning/info`, bảng "Component usage", a11y skip link + row-click |

### Đã kiểm (Chrome headless, puppeteer-core)

- 1280 / 768 / 375 px: không tràn trang, **card bảng không còn vượt viewport** (đã sửa bằng `min-w-0` ở gốc `DataTable`); ở 375 bảng cuộn ngang trong card, các section dưới (form, LoadingState) cuộn tới được.
- Light + dark: token mới đọc rõ ở cả hai theme.
- Sắp xếp cột: đổi thứ tự ✅. Tìm kiếm debounce: 12 → 1 dòng, xoá lọc → 5 dòng/trang ✅.
- Phân trang: "Trang 2 / 3" ✅. Validate form: `["Tên tối thiểu 2 ký tự","Email không hợp lệ"]` ✅, submit hợp lệ → toast ✅.
- ConfirmDialog: xoá → **1 toast** "Đã xoá…", dòng biến mất; Huỷ → giữ nguyên ✅.
- Row click: click ô → toast chọn dòng; Enter trên dòng → toast; Enter trên nút xoá → mở dialog, **không** phát sinh toast chọn dòng ✅.
- Bàn phím: Tab đầu tiên = skip link; tooltip nav collapsed hiện "Khách hàng" ✅.
- Console: 0 error, 0 warning; không request 4xx ✅.

## Dependencies

Không thêm dependency nào ở Phase 3 (TanStack Table / RHF / Zod / Sonner / date-fns đã cài từ Phase 2). Chỉ thêm 1 file shadcn: `src/components/ui/field.tsx`.

Bundle sau build: `index` 361 kB (gzip 113) · `radix` 128 (42) · `forms` 121 (38) · `react` 99 (34) · `table` 51 (14) · CSS 98 kB (gzip 16). Không còn cảnh báo chunk > 500 kB.

## Vấn đề chưa giải quyết

1. **Chưa có `ErrorState`** — Phase 3 roadmap cũ có, nhưng demo chưa có luồng lỗi thật; để lại khi làm list template ở Phase 4 (sẽ dùng cùng empty/loading).
2. **`DataTable` chỉ phân trang/sắp xếp client** — chưa có `manualPagination`/`manualSorting`; thêm khi có API thật (ghi ở `docs/architecture.md` §3).
3. **Build in cảnh báo của zod**: `node_modules/.../zod/v4/core/regexes.js contains an annotation that Rollup cannot interpret` — phát ra từ dependency, không phải code repo; bỏ qua.
4. **Form mobile**: nút submit nằm trên nút Huỷ (`flex-col-reverse`). Nếu muốn submit ở dưới cho dễ với ngón tay thì đổi 1 dòng trong `FormActions`.
5. **Commit**: 2 commit Phase 1 + Phase 2 đã có; Phase 3 chưa commit, chờ xác nhận (gộp 1 commit hay tách theo nhóm component).

## Việc kế tiếp (Phase 4 — Page templates, chờ xác nhận)

1. `src/templates/`: `DashboardTemplate` (StatCard + chart Recharts + list gần đây), `ListTemplate` (PageHeader + FilterBar + DataTable + 3 state), `FormTemplate` (FormSection + FormActions + validation), `DetailTemplate` (descriptions + related), `SettingsTemplate` (Tabs + form).
2. `src/pages/examples/` + `src/mocks/`: demo "quản lý khách hàng" và "sản phẩm" dùng mock data, thay dần `ComingSoonPage`.
3. Chuyển route sang `lazy()` (D8) khi đã có page thật; page title theo route.
4. Thêm `ErrorState` + luồng lỗi cho list template.
5. Sau mỗi template: `pnpm typecheck && pnpm lint && pnpm build` + kiểm 3 breakpoint, light/dark.
