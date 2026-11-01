# UI Guidelines — admin-dashboard-kit

**Nguồn duy nhất** về chuẩn thị giác và cách dùng component. Token khai báo trong `src/styles/globals.css`.
Tài liệu khác chỉ được tham chiếu file này, không định nghĩa lại token.

## 1. Nguyên tắc thị giác

- **Rõ ràng hơn hào nhoáng.** Ưu tiên tương phản chữ, khoảng trắng, đường kẻ mảnh.
- **Một điểm nhấn.** Primary (amber) chỉ cho hành động chính, trạng thái active, focus ring.
- **Phẳng, viền mảnh, ít đổ bóng.** Card = `rounded-xl border border-border bg-card`. Không gradient, không glass, không shadow nặng.
- **Số liệu `tabular-nums`**, tiêu đề `tracking-tight`.
- Copy tiếng Việt, câu ngắn, động từ rõ ("Lưu thay đổi", "Xoá nhà cung cấp").

## 2. Design tokens

### Colors — light

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--background` | `#f8fafc` | nền app |
| `--foreground` | `#1f2937` | chữ chính |
| `--card` / `--popover` | `#ffffff` | card, popover |
| `--primary` | `#b45309` | hành động chính, active |
| `--primary-foreground` | `#ffffff` | chữ trên primary |
| `--secondary` / `--muted` | `#f1f5f9` | nền phụ, disabled |
| `--muted-foreground` | `#64748b` | chữ phụ, mô tả |
| `--accent` | `#fff7ed` | hover/active nhạt |
| `--destructive` | `#dc2626` | xoá, lỗi |
| `--success` | `#15803d` | thành công/hoạt động |
| `--warning` | `#b45309` | chờ xử lý, cảnh báo |
| `--info` | `#1d4ed8` | thông tin |
| `--border` / `--input` | `#e2e8f0` | viền |
| `--ring` | `#b45309` | focus ring |
| `--sidebar` | `#ffffff` | nền sidebar |
| `--sidebar-accent` | `#fff7ed` | item active |
| `--chart-1…5` | `#b45309` `#16a34a` `#d97706` `#2563eb` `#9333ea` | biểu đồ |

Dark mode: neutrals `oklch` (nền `0.145`, card `0.205`), primary đảo thành sáng `0.922`.
Dark **không** giữ amber làm primary để tránh chói — dùng neutral. `--success` / `--warning` / `--info` ở dark dùng oklch sáng hơn để đủ tương phản.

Tone trạng thái dùng qua prop, không hardcode màu:
`StatCard tone`, `StatusBadge tone` = `primary | success | warning | danger | info | neutral`.

### Typography

- Font: **Be Vietnam Pro** (fallback Inter, system-ui). Mono: ui-monospace / Geist Mono.
- Base 15px (`text-[15px]`) cho nội dung admin; shadcn mặc định 14px cho control nhỏ.
- Thang: `text-xs` 12 · `text-sm` 14 · `text-[15px]` 15 · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 · `text-[1.75rem]` 28 (page title).
- Weight: 400 body, 500 nhấn nhẹ, 600 tiêu đề card, 700 page title + số liệu.
- Page title: `text-2xl font-bold tracking-tight` → `sm:text-[1.75rem]`.

### Spacing & layout

- Thang 4px; gap giữa section trong page: `gap-6` (24px).
- Page padding: `px-4 pt-6 sm:px-6 lg:px-8`; container `mx-auto w-full max-w-page` (`90rem`).
- Header cao `h-16`; sidebar `w-sidebar` (16rem), collapsed `w-sidebar-collapsed` (4.75rem).

### Radius / border / shadow

- `--radius: 0.625rem`; card `rounded-xl`, control `rounded-lg`, badge trạng thái `rounded-full`.
- Viền 1px `border-border`; focus ring `ring-3 ring-ring/40`.
- Shadow chỉ ở overlay (dialog, dropdown, popover, sheet) do primitive shadcn quy định.
  Card/table/inline control **không** thêm shadow; phân cấp bằng border + nền.
- Transition `duration-200 ease-out`, tôn trọng `motion-reduce`.

## 3. Layout rules

1. Shell cao `h-dvh`, `overflow-hidden`; **chỉ `<main>` scroll**. Sidebar/header không bị đẩy khỏi màn hình.
2. `<main>` cuộn → reset scroll khi đổi route.
3. Sidebar: docked ở `lg+`, collapsible còn icon + tooltip, drawer dưới `lg`; đóng drawer khi vượt breakpoint.
4. Header toàn cục **chỉ** chứa: nút mở menu (mobile), tên app (mobile), theme toggle, menu tài khoản. **Không** chứa page title.
5. Page title thuộc `PageHeader` của từng trang — một nơi duy nhất, kèm description và actions bên phải.
6. Thứ tự page: `PageHeader` → (alert nếu có) → nội dung.
7. Active nav: exact cho root, prefix cho nhánh con; kèm `aria-current="page"`.
8. Breadcrumb do `AdminShell` render từ `config/nav.ts`; không tự viết breadcrumb trong page.

## 4. Buttons

| Nhu cầu | Dùng |
| --- | --- |
| Hành động chính | `Button` (default) — mỗi vùng chỉ một primary |
| Hành động phụ | `Button variant="outline"` |
| Hành động trong toolbar/row | `Button variant="ghost"` hoặc `size="icon-sm"` |
| Hành động nguy hiểm | `Button variant="destructive"` + `ConfirmDialog` |
| Icon-only | `Button size="icon"` + `aria-label`; icon `aria-hidden` |

- `FormActions` dùng `h-11` (44px) cho submit/cancel. Filter/table dùng `h-9`.
- Không tự làm nút icon trần bằng `<button>`; không đặt nhiều primary cạnh nhau.
- Disabled phải kèm lý do nhìn thấy được (tooltip/description), không chỉ mờ.

## 5. Forms

- `FormField` (render-prop) bọc `Controller`, đọc `control` từ `FormProvider`.
- Mỗi field: label liên kết (`id`), description nếu cần, lỗi bằng text + `aria-invalid`.
- Nhóm field: `FormSection` (`columns={2}` từ `md` khi đủ chỗ).
- Submit: `FormActions` (spinner + `aria-busy`, disable toàn fieldset khi submitting).
- Schema Zod đặt ngoài component, trong file page hoặc `lib/`; không đặt nghiệp vụ trong `components/forms`.
- Select/Switch/Checkbox bind thủ công qua `field`; không tạo wrapper riêng cho từng control.

## 6. Tables

- Luôn dùng `DataTable` generic; không viết `<table>` mới trong page.
- Cột sắp xếp dùng `SortableHeader`; cột thường render text.
- Bảng rộng cuộn ngang **trong card** (`overflow-x-auto`, `min-w-0`); không đẩy vỡ layout trang.
- `columns` phải `useMemo` ở page — mảng mới mỗi render làm remount toàn bộ ô.
- Dòng có `onRowClick`: nhận focus, Enter/Space kích hoạt, bỏ qua click từ button/link/input trong ô.
- Luôn có `caption` hoặc `emptyState` mô tả ngữ cảnh cho screen reader.
- Trên mobile, nếu > 5 cột quan trọng: ẩn bớt cột phụ hoặc dựng card list riêng; không nhồi vào template.

## 7. Dialogs & feedback

- Dialog/Sheet/AlertDialog dùng primitive shadcn (focus trap, `Esc`, scroll lock).
- Xác nhận hành động không hoàn tác: `ConfirmDialog`, `tone="danger"`, mô tả hậu quả cụ thể.
- Đóng dialog phải trả focus về control đã mở; không để focus rơi về `body`.
- Toast (Sonner) chỉ cho kết quả quan trọng/async; không toast cho mọi thao tác nhỏ.
- Lỗi form hiển thị tại field; lỗi tải dữ liệu dùng `ErrorState` + `onRetry`.

## 8. Charts

- Chỉ dùng Recharts trong demo/template dashboard; không import chart vào component dùng chung.
- Bọc chart trong `SectionCard` có title/description; chiều cao cố định để không nhảy layout.
- Dùng `--chart-1…5`; grid/trục dùng `border`/`muted-foreground`.
- Số liệu chính xác để ở tooltip/bảng; card KPI có thể rút gọn (`formatCompactCurrency`).
- Chart phải có text thay thế hoặc bảng dữ liệu tương đương; không truyền đạt thông tin chỉ bằng màu.
- Dark mode hiện dùng thang xám trung tính cho chart; chưa có palette màu riêng.

## 9. Empty / Loading / Error

| Trạng thái | Component | Quy ước |
| --- | --- | --- |
| Rỗng | `EmptyState` | title nói rõ đang trống gì; action reset/tạo mới nếu có |
| Đang tải | `LoadingState` | skeleton giữ nhịp layout; `role="status"` + label |
| Lỗi tải | `ErrorState` | mô tả ngắn + `onRetry`/`action`; `role="alert"` |
| Không tìm thấy bản ghi | `EmptyState` | kèm link quay lại danh sách |
| Submit | `FormActions` | disable + spinner + `aria-busy`, không đổi layout |

Không dùng spinner toàn trang cho khối nội dung nhỏ; không để trắng trang khi lỗi.

## 10. Responsive

Breakpoints Tailwind: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`. Kiểm tối thiểu **375 / 768 / 1280**.

- **Mobile (< lg):** sidebar = drawer; padding 16px; action `PageHeader` full-width; bảng cuộn trong card.
- **Tablet (lg):** sidebar docked 16rem; stats 2 cột; detail 1 cột tới `xl`.
- **Desktop (xl+):** stats 4 cột; detail 2/3 + 1/3; chart 2/3 + activity 1/3.
- Tap target: tối thiểu 24×24 (WCAG 2.2 AA); control admin phổ biến 32–36px; hành động chính/form 44px (`h-11`).
  Ngoại lệ đã chốt: ô nav sidebar collapsed 40×40, canh giữa trong 76px.
- Không dùng `h-screen` (lỗi mobile browser), dùng `h-dvh`.

## 11. Dark mode

- Bật bằng class `.dark` trên `<html>`; lưu `adk-theme`, mặc định theo `prefers-color-scheme`.
- Script trong `index.html` đặt theme trước paint để không nháy.
- Không hardcode `text-white`/`bg-black`; dùng token để cả hai theme đọc được.
- Kiểm lại: border, disabled, placeholder, chart, badge trạng thái, focus ring trên nền tối.
- Primary dark là neutral sáng; đừng dùng amber cho CTA ở dark.

## 12. Accessibility (bắt buộc)

- Mỗi input có `Label`/`aria-label`; lỗi có text + `aria-invalid`, không chỉ đổi màu viền.
- Icon-only button có `aria-label`; icon trang trí `aria-hidden="true"`.
- Dialog/Sheet dùng shadcn (focus trap, `Esc`); đóng phải trả focus.
- Tương phản ≥ 4.5:1 cho chữ thường; không dùng `text-muted-foreground` cho nội dung quan trọng ở cỡ nhỏ.
- Focus ring hiển thị rõ; không `outline-none` mà không thay thế.
- Skip link "Bỏ qua tới nội dung" là tab stop đầu tiên (`AdminShell`) → `#main-content`.
- Dòng bảng có `onRowClick` phải nhận focus, Enter/Space kích hoạt, bỏ qua click từ control trong ô.
- Mỗi trang đúng một `<h1>` (`PageHeader`); section dùng `<h2>` (`SectionCard`, `FormSection`).
- Settings nav có `aria-current` + `aria-controls`; panel có `role="region"` + `aria-label`.

## 13. Anti-patterns

| Không làm | Vì sao |
| --- | --- |
| Hardcode `#b45309`, `text-slate-900` rải rác | đổi theme sẽ vỡ; dùng token |
| Page title nằm trong header toàn cục | trùng lặp, sai khi nhiều trang |
| `h-screen` + body scroll | sidebar trôi, mobile giật |
| Tự viết lại Button/Select/Dialog/table | trùng shadcn/ui và DataTable |
| DataTable gắn cứng cột "customer" | mất tính tái sử dụng |
| Template import mock hoặc giữ state nghiệp vụ | template phải nhận props/children từ page |
| Tạo template Create/Edit riêng | `FormTemplate` đã xử lý qua `mode` |
| Mock data import trong `components/` | component phải nhận props |
| `any`, `@ts-ignore` để qua build | che lỗi thật |
| Nhiều primary/CTA cùng màn hình | mất điểm nhấn |
| Toast cho mọi hành động nhỏ | nhiễu; chỉ dùng cho kết quả async/quan trọng |
| Animation > 300ms, không `motion-reduce` | chậm và thiếu tôn trọng người dùng |
| Đổi token/radius/font để polish một màn hình | phá design system toàn kit |
