# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **4 xong → chờ xác nhận sang Phase 5**

## Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). Phase 1 + 2 đã commit (`1cd3497`, `716bae7`); **toàn bộ code Phase 3 + 4 chưa commit** (HEAD `4c0aca1`).
- Chạy: `pnpm install` → `pnpm dev` (http://localhost:5173). Showcase component: **`/components`** (nav "UI Kit").
- Quality gate: `pnpm typecheck` ✅ · `pnpm lint` ✅ (0 error, 0 warning) · `pnpm build` ✅.

## Đã xong Phase 4 — Page templates + demo

### 5 template (`src/templates/`)

| Template | Props chính | Ghi chú |
| --- | --- | --- |
| `dashboard/DashboardTemplate.tsx` | `title, description?, actions?, stats?: StatCardProps[], charts?, recentActivity?, children?, isLoading?, className?` | Chart 2/3 + activity 1/3 khi có cả hai; stats tự wrap grid |
| `list/ListTemplate.tsx` | `title, description?, actions?, columns, data, isLoading?, error?, onRetry?, filters?, onResetFilters?, emptyState?, pageSize?, initialSorting?, onRowClick?, getRowId?, caption?, className?` | Bọc `PageHeader + FilterBar + DataTable`; có sẵn empty/loading/error |
| `form/FormTemplate.tsx` | `title, description?, mode?: "create"\|"edit", form: UseFormReturn, onSubmit, onCancel?, submitLabel?, cancelLabel?, isLoading?, children` | Create/Edit dùng chung; validation + field do trang quyết định |
| `detail/DetailTemplate.tsx` | `title, description?, status?, actions?, metadata?: DescriptionItem[], metadataTitle?, related?, children?, isLoading?, error?, onRetry?, className?` | 2 cột metadata + nội dung; `related` cho section liên quan |
| `settings/SettingsTemplate.tsx` | `title, description?, sections: {id,label,icon?,content}[], activeSectionId, onSectionChange, actions?, className?` | Mount tất cả section, ẩn bằng `hidden` → giữ giá trị RHF và validate khi submit |

API đầy đủ + ví dụ ghép: `docs/page-templates.md`.

### Demo + mock

| Route | Page | Mock |
| --- | --- | --- |
| `/` | `pages/examples/DashboardPage.tsx` | `mocks/dashboard.ts`, `mocks/orders.ts` |
| `/customers` | `CustomersPage.tsx` (lọc, sắp xếp, phân trang, xoá có confirm, empty state) | `mocks/customers.ts` |
| `/customers/:id` | `CustomerDetailPage.tsx` | `mocks/customers.ts`, `mocks/orders.ts` |
| `/customers/new`, `/customers/:id/edit` | `CustomerFormPage.tsx` (1 page, `mode`) | `mocks/customers.ts` |
| `/products` | `ProductsPage.tsx` | `mocks/products.ts` |
| `/settings` | `SettingsPage.tsx` (4 tab, lưu/reset) | — |
| `/components` | `ComponentsPage.tsx` (showcase, giữ nguyên) | — |

`/orders`, `/reports` vẫn là `ComingSoonPage` (Phase 5).

### Routing / lazy

- `src/app/routes.tsx`: helper `lazyPage()` cho dashboard, customers, customer detail/form, products, components, settings. `/orders`, `/reports` giữ element tĩnh; 404 giữ nguyên.
- `HydrateFallback: AdminLoading` ở route gốc (`src/layouts/AdminLoading.tsx` = `AdminShell` + `LoadingState`), tránh màn trắng khi mở URL trực tiếp.
- `vite.config.ts`: thêm chunk `charts` (recharts) vào `manualChunks`.

### Bổ sung dùng chung

| File | Dùng để |
| --- | --- |
| `src/components/common/SectionCard.tsx` | Card có title/description/action cho section |
| `src/components/data-display/ErrorState.tsx` | Lỗi + `onRetry` (dùng trong list/detail template) |
| `src/components/data-display/DescriptionList.tsx` | Cặp nhãn/giá trị cho detail & metadata |
| `src/lib/format.ts` | `formatDate`, `formatCurrency`, `formatNumber` |
| `src/components/data-display/StatCard.tsx` | value dài tự xuống dòng (`leading-tight break-words`) |

### Sửa nhỏ ngoài phạm vi

- `CustomersPage`/`ProductsPage`/`ComponentsPage`: `columns` bọc `useMemo` — trước đó `flexRender` coi cell function mới là component mới nên **remount toàn bộ ô mỗi lần re-render** (mất focus, dialog mở là mất luôn nút trigger).
- `ConfirmDialog`: dialog điều khiển bằng state, không có `DialogTrigger` nên Radix luôn trả focus về `body`. Thêm theo dõi `focusin` khi dialog đóng để trả focus về control đã mở (Esc/Huỷ).
- `DashboardPage`: stat doanh thu rút còn `"143 tr"` để không tràn card.

## Đã kiểm (Chrome headless, CDP)

- `pnpm typecheck` / `pnpm lint` / `pnpm build` sạch.
- 1280 / 768 / 375 px: không tràn trang; bảng nhiều cột cuộn ngang trong card ở mobile (đúng guideline).
- Light + dark: đọc rõ; chart dark dùng token xám trung tính (xem mục dưới).
- URL trực tiếp `/`, `/customers`, `/customers/c-001`, `/customers/c-001/edit`, `/customers/new`, `/products`, `/settings`, `/components`; URL sai → `ErrorPage`; lazy chunk tải đúng, không 404.
- Luồng: lọc rỗng → empty state → reset; xoá → dialog → xác nhận → toast + mất dòng; validate form → 4 lỗi; submit hợp lệ → về `/customers` + toast; settings đổi tab → lưu → toast; reset → giá trị mặc định.
- Bàn phím: Tab đầu tiên = skip link; `Esc` đóng dialog; đóng dialog trả focus về nút xoá; settings nav có `aria-current` + `aria-controls`, panel active hiện đúng.
- Console: 0 error; network: 0 request lỗi/4xx.
- Lazy fallback: throttle thấy `AdminLoading` từ ~1,5 s, route load ~5 s.

Bundle sau build (`dist` 1,7 MB): `charts` 361 kB (gzip 104) · `index` 306 (95) · `radix` 131 (42) · `forms` 122 (37) · `react` 99 (34) · `table` 51 (13) · CSS 98 (15). Không còn cảnh báo chunk > 500 kB.

## Dependencies

Không thêm dependency nào ở Phase 3 lẫn Phase 4. Không thêm file shadcn mới ở Phase 4.

## Vấn đề chưa giải quyết

1. **Điều hướng client-side giữ trang cũ** trong lúc tải chunk lazy (không có suspense boundary theo route). Chấp nhận được với demo; nếu cần, bọc `Suspense`/`useNavigation` để hiện loading mảnh.
2. **Bảng khách hàng mobile > 5 cột** phải cuộn ngang trong card — guideline cho phép, nhưng nếu muốn gọn hơn thì ẩn bớt cột ở `< md`.
3. **Chart dark** dùng token xám trung tính, chưa có bảng màu chart riêng cho dark mode.
4. **Mutation demo reset khi rời trang** (state local, không persist) — đúng chủ trương không backend.
5. **Build warning từ zod** (`regexes.js` annotation) phát ra từ dependency, không phải code repo; bỏ qua.
6. **Commit**: Phase 3 + 4 chưa commit, chờ xác nhận (gộp 1 commit hay tách component/template/docs).

## Việc kế tiếp (Phase 5 — gợi ý)

1. Trang `/orders`, `/reports` thật: dùng `ListTemplate` + `DashboardTemplate`, thêm mock `mocks/reports.ts` nếu cần.
2. Rà lại `docs/page-templates.md` khi có template thứ 6 (nếu phát sinh) và bổ sung ví dụ "chọn template nào".
3. Nếu muốn mượt hơn: route-level loading indicator khi chuyển trang (mục 1 ở trên).
4. Kiểm a11y sâu: axe/Lighthouse, đặc biệt bảng cuộn ngang và tooltip sidebar.
5. Chốt commit + tag milestone Phase 4.
