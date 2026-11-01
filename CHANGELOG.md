# Changelog

Mọi thay đổi đáng chú ý của kit được ghi ở đây. Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/); phiên bản theo [SemVer](https://semver.org/lang/vi/).

## [0.1.0] — 2026-11-01

Bản phát hành đầu tiên: GitHub Template Repository dùng được ngay, không có backend.

### Design System

- Token light/dark đầy đủ trong `src/styles/globals.css` (Tailwind v4 CSS-first, không `tailwind.config.js`).
- Font Be Vietnam Pro, primary amber ở light và neutral sáng ở dark, focus ring `ring-3`.
- Quy chuẩn typography, spacing, radius, màu trạng thái: `UI_GUIDELINES.md`.

### shadcn/ui components

- 23 primitive trong `src/components/ui/`, giữ API shadcn/ui, tùy biến qua `className`/variant.
- Không fork primitive; dark mode dùng cùng token.

### Admin Layout

- `AdminShell`: `h-dvh`, chỉ `<main>` scroll, skip link là tab stop đầu tiên.
- Sidebar docked/collapsible (tooltip khi thu gọn) và drawer dưới `lg`.
- `AdminHeader` (menu, theme toggle, tài khoản), `PageHeader`, breadcrumb suy ra từ `config/nav.ts`.

### 23 admin components

- Layout/nav: `AdminShell`, `AdminHeader`, `AdminSidebar`, `PageHeader`, `Breadcrumbs`, `useBreadcrumbs`, `ThemeToggle`.
- Hiển thị: `StatCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `DescriptionList`.
- Bảng/lọc: `DataTable`, `Pagination`, `SortableHeader`, `SearchInput`, `FilterBar`, `DateFilter`.
- Form/phản hồi: `FormField`, `FormSection`, `FormActions`, `ConfirmDialog`, `SectionCard`.
- API: `docs/components.md`; showcase chạy được ở `/components`.

### 5 page templates

- `DashboardTemplate`, `ListTemplate`, `FormTemplate` (create + edit qua `mode`), `DetailTemplate`, `SettingsTemplate`.
- Template chỉ nhận props/callback; không import mock, không giữ state nghiệp vụ. API: `docs/page-templates.md`.

### Demo Orders và Reports

- Demo khách hàng, sản phẩm, đơn hàng, báo cáo, cài đặt trên mock + local state.
- Đơn hàng: list, chi tiết, đổi trạng thái; báo cáo: KPI, chart Recharts, lọc khoảng thời gian.
- Không API/database/auth; mutation reset khi reload (chủ trương no-backend).

### Agent Skills

- `admin-ui-development`, `admin-ui-component`, `admin-ui-review` trong `.agents/skills/`.
- `.claude/skills/*` là symlink; OpenCode/Codex đọc trực tiếp `.agents/skills/`.

### AI Context

- `AGENTS.md` (hợp đồng), `CLAUDE.md`, `PROJECT_BRIEF.md`, `HANDOFF.md`, `UI_GUIDELINES.md`.
- `docs/`: kiến trúc + ranh giới, component, page template, tooling, validation.

### Developer Tooling

- `docs/tooling.md`: ponytail, impeccable/frontend-design, Context7, Headroom — tùy chọn, không phải dependency.
- Quality gate: `pnpm typecheck`, `pnpm lint`, `pnpm build` (không test framework, không CI ở bản này).

### Independent Validation

- Một AI session fresh context nhận repo như template mới và tự dựng module nghiệp vụ (Suppliers), không cần giải thích kiến trúc: 0 component dùng chung mới, 0 dependency mới. Biên bản: `docs/validation.md`.
- Kiểm lại trên repo tạo từ GitHub Template (module Warehouses): gate pass; 1280/768/375 × light/dark không tràn ngang, 0 console error.

### Ghi chú

- Chưa có backend, auth, RBAC, i18n, SSR; phân trang/sắp xếp chạy client.
- Chi tiết giới hạn: `README.md` §Giới hạn.
