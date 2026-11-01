# UI Guidelines — admin-dashboard-kit

Chuẩn thị giác & cách dùng component. Token lấy từ dashboard tham chiếu `baolochp` (đã trích xuất, không copy code).

## 1. Nguyên tắc thị giác

- **Rõ ràng hơn hào nhoáng.** Ưu tiên tương phản chữ, khoảng trắng, đường kẻ mảnh.
- **Một điểm nhấn.** Primary (amber) chỉ dùng cho hành động chính, trạng thái active, focus ring.
- **Phẳng, viền mảnh, ít đổ bóng.** Card = `rounded-xl border bg-card`. Không gradient, không glass, không shadow nặng.
- **Số liệu dùng `tabular-nums`**, tiêu đề dùng `tracking-tight`.
- Copy tiếng Việt, câu ngắn, động từ rõ ("Lưu thay đổi", "Xoá khách hàng").

## 2. Design tokens

Khai báo trong `src/styles/globals.css` (đã chuẩn bị sẵn giá trị từ `baolochp`):

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
| `--success` | `#15803d` | trạng thái thành công/hoạt động |
| `--warning` | `#b45309` | chờ xử lý, cảnh báo |
| `--info` | `#1d4ed8` | thông tin, trung tính có nhấn |
| `--border` / `--input` | `#e2e8f0` | viền |
| `--ring` | `#b45309` | focus ring |
| `--sidebar` | `#ffffff` | nền sidebar |
| `--sidebar-accent` | `#fff7ed` | item active |
| chart 1–5 | `#b45309` `#16a34a` `#d97706` `#2563eb` `#9333ea` | biểu đồ |

Dark mode: neutrals `oklch` (nền `0.145`, card `0.205`), primary đảo thành sáng `0.922`. Dark **không** giữ amber làm primary để tránh chói — dùng neutral. `--success` / `--warning` / `--info` ở dark dùng oklch sáng hơn để đủ tương phản trên nền tối.

Tone trạng thái dùng qua prop, không hardcode màu: `StatCard tone`, `StatusBadge tone` = `primary | success | warning | danger | info | neutral`.

### Typography

- Font: **Be Vietnam Pro** (fallback Inter, system-ui). Mono: Geist Mono / ui-monospace.
- Base 15px (`text-[15px]`) cho nội dung admin; shadcn mặc định 14px chỉ dùng trong control nhỏ.
- Thang: `text-sm` 14 · `text-[15px]` 15 · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 · `text-[1.75rem]` 28 (page title).
- Weight: 400 body, 500 nhấn nhẹ, 600 tiêu đề card, 700 page title + số liệu.
- Page title: `text-2xl font-bold tracking-tight` (mobile) → `sm:text-[1.75rem]`.

### Spacing & layout

- Thang 4px; gap dọc giữa section trong page: `gap-6` (24px).
- Page padding: `px-4 pt-6 sm:px-6 lg:px-8`.
- Container: `mx-auto w-full max-w-[90rem]`.
- Header cao `h-16`; sidebar rộng `w-64`, collapsed `w-[4.75rem]`.

### Radius / border / motion

- `--radius: 0.625rem`; card `rounded-xl`, control `rounded-lg`, badge trạng thái `rounded-full`.
- Viền 1px `border-border`; focus ring `ring-3 ring-primary/40`.
- Transition `duration-200 ease-out`, tôn trọng `motion-reduce`.

## 3. Layout rules

1. Shell cao `h-dvh`, `overflow-hidden`; **chỉ `<main>` scroll**. Sidebar/footer không bao giờ bị đẩy khỏi màn hình.
2. `<main>` cuộn → reset scroll khi đổi route.
3. Sidebar: docked ở `lg+`, collapsible còn icon + tooltip, drawer dưới `lg`; đóng drawer khi vượt breakpoint.
4. Header toàn cục **chỉ** chứa: nút mở menu (mobile), tên app (mobile), theme toggle, menu tài khoản. **Không** chứa page title.
5. Page title thuộc `PageHeader` của từng trang — một nơi duy nhất, kèm description và actions bên phải.
6. Thứ tự page: `PageHeader` → (alert nếu có) → nội dung.
7. Trạng thái active của nav: exact cho root, prefix cho nhánh con; kèm `aria-current="page"`.

## 4. Component usage

| Cần gì | Dùng |
| --- | --- |
| Nút | `Button` (variant: default/outline/ghost/destructive, size: sm/default/lg/icon) |
| Icon-only | `Button size="icon" variant="ghost"` + `aria-label` (không tự làm nút icon trần) |
| Form field | `FormField` (label + control + mô tả + lỗi) render-prop, bọc `Controller` |
| Nhóm field | `FormSection` (card + tiêu đề, `columns={2}` khi đủ chỗ) |
| Nút cuối form | `FormActions` (`onCancel`, `isSubmitting` → spinner + `aria-busy`) |
| Bảng dữ liệu | `DataTable` generic, không tự viết `<table>` mới |
| Cột sắp xếp | `SortableHeader` làm `header` của cột |
| Phân trang | `Pagination` (DataTable tự render) |
| Trạng thái rỗng | `EmptyState` (title + description + action) |
| Đang tải | `LoadingState` (skeleton giữ nhịp layout, `role="status"`) |
| Lỗi tải dữ liệu | `ErrorState` (thông điệp + `onRetry`/`action`) |
| Cặp nhãn/giá trị | `DescriptionList` (trang chi tiết) |
| Card section | `SectionCard` (chart, khối thông tin, section tùy biến) |
| Trang mới | Chọn template trong `docs/page-templates.md`, không dựng lại PageHeader/table/form |
| Xác nhận xoá | `ConfirmDialog` (tone `danger`) |
| Thông báo | `toast()` qua Sonner |
| Filter | `FilterBar` + `SearchInput` + `Select` + `DateFilter` |
| Đường dẫn | `Breadcrumbs` + `useBreadcrumbs()` (suy ra từ `config/nav.ts`) |
| Số liệu | `StatCard` (title, value, description, icon, tone, href) |
| Trạng thái nghiệp vụ | `StatusBadge` với `tone` do page quyết định, **không** thêm enum vào kit |

Nếu shadcn/ui có → dùng. Nếu chỉ cần composition (2–3 component ghép) → viết trong `components/common/`. Không thêm dependency mới cho 1 component.

## 5. Responsive

Breakpoints Tailwind mặc định: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`.

- **Mobile (< lg):** sidebar = drawer, page padding 16px, action của `PageHeader` full-width, bảng cuộn ngang (`overflow-x-auto`) — hoặc chuyển card list nếu cột > 5.
- **Tablet (lg):** sidebar docked 16rem, grid 2 cột cho stats.
- **Desktop (xl+):** grid 4 cột stats, table đầy đủ cột.
- Tap target ≥ 44px (`h-11`) cho mọi hành động.
- Không dùng `h-screen` (lỗi mobile browser), dùng `h-dvh`.

## 6. Accessibility (bắt buộc)

- Mỗi input có `Label` liên kết; lỗi form hiển thị text + `aria-invalid`, không chỉ đổi màu viền.
- Icon-only button có `aria-label`; icon trang trí `aria-hidden="true"`.
- Dialog/Sheet dùng component shadcn (đã có focus trap, `Esc`).
- Tương phản ≥ 4.5:1 cho chữ thường; không dùng `text-slate-400` cho nội dung quan trọng.
- Điều hướng bàn phím: focus ring hiển thị rõ, không `outline-none` mà không thay thế.
- Skip link "Bỏ qua tới nội dung" là tab stop đầu tiên (`AdminShell`), nhảy tới `#main-content`.
- Dòng bảng có `onRowClick` phải: nhận focus, Enter/Space kích hoạt, và **bỏ qua** click phát ra từ control trong ô (nút xoá, link…).

## 7. Anti-patterns

| Không làm | Vì sao |
| --- | --- |
| Hardcode `#b45309`, `text-slate-900` rải rác | đổi theme sẽ vỡ; dùng token |
| Page title nằm trong header toàn cục | trùng lặp, sai khi nhiều trang |
| `h-screen` + body scroll | sidebar trôi, mobile giật |
| Tự viết lại Button/Select/Dialog | trùng shadcn/ui |
| DataTable gắn cứng cột "customer" | mất tính tái sử dụng |
| Template import mock hoặc giữ state nghiệp vụ | template phải nhận props/children từ page |
| Tạo template Create/Edit riêng | `FormTemplate` đã xử lý cả hai qua `mode` |
| Mock data import trong `components/` | component phải nhận props |
| `any`, `@ts-ignore` để qua build | che lỗi thật |
| Nhiều primary/CTA cùng màn hình | mất điểm nhấn |
| Toast cho mọi hành động nhỏ | nhiễu; chỉ dùng cho kết quả async/quan trọng |
| Animation dài > 300ms, không `motion-reduce` | chậm và thiếu tôn trọng người dùng |
