# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **5 xong → chờ xác nhận commit**

## Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). Phase 1–4 đã commit (`1cd3497`, `716bae7`, `4c0aca1`, `459c2c7`, `f9d82f5`); **toàn bộ code Phase 5 chưa commit** (HEAD `f9d82f5`).
- Chạy: `pnpm install` → `pnpm dev` (http://localhost:5173). Showcase component: **`/components`** (nav "UI Kit").
- Quality gate: `pnpm typecheck` ✅ · `pnpm lint` ✅ (0 error, 0 warning) · `pnpm build` ✅.

## Đã xong Phase 5 — Orders + Reports

### Trang mới

| Route | Page | Mock / logic |
| --- | --- | --- |
| `/orders` | `pages/orders/OrdersPage.tsx` — search mã/tên, lọc trạng thái + phương thức + khoảng ngày, sort, phân trang, đổi trạng thái có `ConfirmDialog` | `mocks/orders.mock.ts`, `lib/order-utils.ts` |
| `/orders/:orderId` | `pages/orders/OrderDetailPage.tsx` — metadata, khách hàng, sản phẩm, thanh toán, timeline, cập nhật/huỷ | `mocks/orders.mock.ts`, `lib/order-utils.ts` |
| `/reports` | `pages/reports/ReportsPage.tsx` — 4 KPI, chart doanh thu (ngày/tuần/tháng), trạng thái, phương thức, top sản phẩm, quick range 7/30/90 ngày | `mocks/reports.mock.ts`, `lib/report-utils.ts` |

- Mock 30 đơn tiếng Việt, đủ 5 trạng thái và 4 phương thức; `createOrder()` tính subtotal/discount/shipping/VAT để tổng luôn khớp. Báo cáo suy ra 100% từ `orders`, không hardcode KPI.
- `mocks/orders.ts` cũ đã xoá; `CustomerDetailPage` chuyển sang `orders.mock`. `ComingSoonPage` xoá vì không còn route dùng.
- `OrderStatusMenu` là control dùng chung cho list + detail (chỉ hiện trạng thái kế tiếp hợp lệ).
- Huỷ đơn chỉ đổi trạng thái, giữ nguyên bản ghi + tổng tiền; timeline thêm mốc huỷ.
- `formatCompactCurrency()` (`lib/format.ts`) rút gọn KPI ≥ 1 triệu (`82,8 Tr ₫`) để không xuống dòng trong card 4 cột; số chính xác vẫn hiện ở tooltip chart, bảng và trang đơn.

### Routing / lazy

- `src/app/routes.tsx`: thêm `orders`, `orders/:orderId`, `reports` qua `lazyPage()`; 404 giữ nguyên `ErrorPage`.
- Direct URL đã kiểm trên dev + `pnpm preview`: `/orders`, `/orders/DH-5028`, `/reports`, `/abc` → đúng trang, không 404 asset.

### Dùng chung / sửa nhỏ

| File | Thay đổi |
| --- | --- |
| `src/components/feedback/ConfirmDialog.tsx` | Bỏ qua `focusin` bên trong `[role="menu"]`/`[role="listbox"]` khi lưu focus cũ — trước đó chọn trạng thái từ menu xong đóng dialog thì focus rơi về `body` |
| `src/lib/format.ts` | Thêm `formatCompactCurrency` cho KPI |
| `src/lib/order-utils.ts` | `ORDER_STATUSES`, `PAYMENT_METHODS`, luồng trạng thái, timeline |
| `src/lib/report-utils.ts` | KPI, series doanh thu, breakdown trạng thái/phương thức, top sản phẩm |

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
| `/customers/:id` | `CustomerDetailPage.tsx` | `mocks/customers.ts`, `mocks/orders.mock.ts` |
| `/customers/new`, `/customers/:id/edit` | `CustomerFormPage.tsx` (1 page, `mode`) | `mocks/customers.ts` |
| `/products` | `ProductsPage.tsx` | `mocks/products.ts` |
| `/orders` | `OrdersPage.tsx` (search, 3 filter, sort, phân trang, đổi trạng thái) | `mocks/orders.mock.ts` |
| `/orders/:id` | `OrderDetailPage.tsx` (timeline, thanh toán, cập nhật/huỷ) | `mocks/orders.mock.ts` |
| `/reports` | `ReportsPage.tsx` (KPI, chart, breakdown, top sản phẩm) | `mocks/orders.mock.ts`, `mocks/reports.mock.ts` |
| `/settings` | `SettingsPage.tsx` (4 tab, lưu/reset) | — |
| `/components` | `ComponentsPage.tsx` (showcase, giữ nguyên) | — |

### Routing / lazy

- `src/app/routes.tsx`: helper `lazyPage()` cho toàn bộ page (dashboard, customers, products, orders, reports, components, settings); 404 giữ nguyên.
- `HydrateFallback: AdminLoading` ở route gốc (`src/layouts/AdminLoading.tsx` = `AdminShell` + `LoadingState`), tránh màn trắng khi mở URL trực tiếp.
- `vite.config.ts`: thêm chunk `charts` (recharts) vào `manualChunks`.

### Bổ sung dùng chung

| File | Dùng để |
| --- | --- |
| `src/components/common/SectionCard.tsx` | Card có title/description/action cho section |
| `src/components/data-display/ErrorState.tsx` | Lỗi + `onRetry` (dùng trong list/detail template) |
| `src/components/data-display/DescriptionList.tsx` | Cặp nhãn/giá trị cho detail & metadata |
| `src/lib/format.ts` | `formatDate`, `formatCurrency`, `formatNumber`, `formatCompactCurrency` |
| `src/components/data-display/StatCard.tsx` | value dài tự xuống dòng (`leading-tight break-words`) |

### Sửa nhỏ ngoài phạm vi

- `CustomersPage`/`ProductsPage`/`ComponentsPage`: `columns` bọc `useMemo` — trước đó `flexRender` coi cell function mới là component mới nên **remount toàn bộ ô mỗi lần re-render** (mất focus, dialog mở là mất luôn nút trigger).
- `ConfirmDialog`: dialog điều khiển bằng state, không có `DialogTrigger` nên Radix luôn trả focus về `body`. Thêm theo dõi `focusin` khi dialog đóng để trả focus về control đã mở (Esc/Huỷ).
- `DashboardPage`: stat doanh thu rút còn `"143 tr"` để không tràn card.

## Sidebar polish — trạng thái collapsed (2026-11-01)

Chỉ sửa `src/components/layout/AdminSidebar.tsx` (+ 1 dòng docs). Không đổi route, token, expanded layout, drawer mobile hay persistence.

**Nguyên nhân gốc:** collapsed đặt `NavLink` làm `TooltipTrigger asChild`; Radix `Slot` gộp `className` nên hàm `({ isActive }) => cn(...)` bị stringify → link mất `h-11`, `w-11`, `mx-auto`, mất luôn nền active (cao thực tế 20px, lệch trái 4px). Đã chuyển trạng thái active sang class tĩnh đọc `aria-current="page"` (NavLink tự set) — className luôn là chuỗi, tooltip giữ nguyên.

**Kết quả đo (Chrome CDP, 1280px):**

| Hạng mục | Trước | Sau |
| --- | --- | --- |
| Rộng sidebar collapsed | 76px | 76px (giữ token `w-sidebar-collapsed`) |
| Ô nav | 44×20px, tâm x=34 | 40×40px, tâm x=37.5 |
| Tâm logo / separator | 37.5 / 37.5 | 37.5 / 37.5 |
| Nút thu gọn | 44×44, tâm x=34 | 40×40, tâm x=37.5 |
| Nền active | không có (class mất) | `bg-sidebar-accent` + icon primary, rõ ở cả light/dark |
| Separator | 32px | 24px, canh giữa |

- Ô nav 40×40 (theo yêu cầu) thay vì 44px của guideline; ghi chú ngoại lệ ở `UI_GUIDELINES.md` §5.
- Tooltip: hiện khi hover **và** khi focus bàn phím (`aria-describedby` trỏ tới `role="tooltip"`), `aria-label` giữ nguyên khi collapsed.
- Focus ring giữ `focus-visible:ring-3 ring-ring/40`; Tab đi qua đủ 7 nav + nút mở rộng.
- Toggle 40×40 dùng `flex justify-center` ở khung dưới (`mx-auto` không ăn với `inline-flex`).
- Persistence: thu gọn/mở rộng ghi `adk-sidebar-collapsed`, reload giữ đúng; drawer 768/375 mở bằng nút menu, `Esc` đóng, item vẫn 44px.
- Không tràn ngang ở 375/768/1280; console 0 error.

## Đã kiểm (Chrome headless, CDP)

- `pnpm typecheck` / `pnpm lint` / `pnpm build` sạch.
- 1280 / 768 / 375 px: không tràn trang; bảng nhiều cột cuộn ngang trong card ở mobile (đúng guideline).
- Light + dark: đọc rõ; chart dark dùng token xám trung tính (xem mục dưới).
- URL trực tiếp `/`, `/customers`, `/customers/c-001`, `/customers/c-001/edit`, `/customers/new`, `/products`, `/settings`, `/components`; URL sai → `ErrorPage`; lazy chunk tải đúng, không 404.
- Luồng: lọc rỗng → empty state → reset; xoá → dialog → xác nhận → toast + mất dòng; validate form → 4 lỗi; submit hợp lệ → về `/customers` + toast; settings đổi tab → lưu → toast; reset → giá trị mặc định.
- Bàn phím: Tab đầu tiên = skip link; `Esc` đóng dialog; đóng dialog trả focus về nút xoá; settings nav có `aria-current` + `aria-controls`, panel active hiện đúng.
- Console: 0 error; network: 0 request lỗi/4xx.
- Lazy fallback: throttle thấy `AdminLoading` từ ~1,5 s, route load ~5 s.

### Phase 5 — Orders + Reports

- Orders: search `DH-5030` → 1 dòng, `nguyễn` → 3; lọc `Chờ xử lý` → 2; `Khi nhận hàng` → 10; từ 26/10 → 9; kết hợp method + ngày → 4; reset → 30. Sort tổng tiền desc/asc đúng; phân trang 3 trang × 10 dòng; row click mở chi tiết; empty state + nút xoá lọc; `DH-9999` → empty state "Không tìm thấy đơn hàng".
- Order detail: đổi `Chờ xử lý → Đang xử lý` qua menu + confirm + toast; `Huỷ đơn` → trạng thái `Đã huỷ`, timeline thêm mốc, tổng tiền/tạm tính không đổi; Esc đóng dialog, focus trả về nút trigger (kể cả khi mở từ menu).
- Reports: 30 ngày = 21 đơn / 16 ghi nhận / 82.779.000 ₫ / AOV 5.173.688 ₫ / 8 đã giao; 7 ngày = 9 / 8 / 42.047.600 ₫ / AOV 5.255.950 ₫; lọc `Đã giao` = 4 đơn / 19.982.600 ₫; đổi granularity tuần → tháng; range tay 01–15/10 = 6 đơn / 4 ghi nhận; range 2025 → empty state, nút "Về 30 ngày gần nhất" hoạt động; pie/status/top sản phẩm đổi theo filter.
- Bàn phím: Tab đầu tiên = skip link → nav → breadcrumb → search → filter → sort header → từng dòng (Enter mở chi tiết) → nút xem/đổi trạng thái; menu trạng thái mở/điều hướng bằng Enter/Arrow; Esc đóng dialog.
- Responsive: 1280/768/375 không tràn `page`/`main`; chart co 590/678/301 px; bảng Orders/detail cuộn ngang **trong card** ở mobile; ảnh chụp light/dark cho 3 route.
- Direct URL (dev + `pnpm preview`): `/orders`, `/orders/DH-5028`, `/reports` đúng trang; `/abc` → `ErrorPage` "Không tìm thấy trang"; 0 console error, 0 request 4xx/5xx.
- Bundle sau build: `charts` 381,93 kB (gzip 111,19) · `index` 306,38 (98,05) · `radix` 131,19 (42,54) · `forms` 121,87 (37,70) · `react` 99,24 (33,69) · `table` 50,53 (13,50); không có chunk > 500 kB.

## Dependencies

Không thêm dependency nào ở Phase 3, 4, 5. Không thêm file shadcn mới ở Phase 4–5.

## Vấn đề chưa giải quyết

1. **Điều hướng client-side giữ trang cũ** trong lúc tải chunk lazy (không có suspense boundary theo route). Chấp nhận được với demo; nếu cần, bọc `Suspense`/`useNavigation` để hiện loading mảnh.
2. **Bảng khách hàng/đơn hàng mobile nhiều cột** phải cuộn ngang trong card — guideline cho phép, nhưng nếu muốn gọn hơn thì ẩn bớt cột ở `< md`.
3. **Chart dark** dùng token xám trung tính, chưa có bảng màu chart riêng cho dark mode.
4. **Mutation demo reset khi rời trang** (state local, không persist) — đúng chủ trương không backend. Đổi trạng thái ở list không lan sang trang detail và ngược lại.
5. **KPI doanh thu/AOV rút gọn** (`82,8 Tr ₫`) ở card 4 cột để không xuống dòng; số chính xác nằm ở tooltip chart, bảng top sản phẩm và trang đơn.
6. **`DateFilter` dùng `<input type="date">` native** nên hiển thị theo locale trình duyệt (`mm/dd/yyyy` trên Chrome en-US). Muốn `dd/MM/yyyy` cần date-picker riêng — chưa thêm dependency.
7. **Build warning từ zod** (`regexes.js` annotation) phát ra từ dependency, không phải code repo; bỏ qua.
8. **Commit**: Phase 3 + 4 + 5 chưa commit, chờ xác nhận (gộp 1 commit hay tách component/template/module/docs).

## Việc kế tiếp

1. Chốt commit: gợi ý tách `feat: add orders and reports modules` (code) và `docs: update phase 5 handoff` nếu muốn lịch sử gọn; Phase 3 + 4 vẫn có thể gộp trước.
2. Nếu cần số KPI chính xác ở mọi breakpoint: thêm `title`/tooltip cho `StatCard` hoặc cho phép `value` là `ReactNode` để render số nhỏ hơn.
3. Kiểm a11y sâu: axe/Lighthouse toàn site, đặc biệt bảng cuộn ngang, tooltip sidebar, `DateFilter` native.
4. Cân nhắc date-picker nhẹ (không thêm dependency nếu chỉ để đổi format hiển thị).
