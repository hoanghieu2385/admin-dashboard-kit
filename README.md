# Admin Dashboard Kit

Admin dashboard UI kit tái sử dụng: **design system + admin components + page templates + demo**, không có backend.
Dự án mới chỉ cần mô tả nghiệp vụ, tái sử dụng những gì có sẵn thay vì thiết kế lại từ đầu.

- React 19 · TypeScript strict · Vite 7 · Tailwind CSS v4 · shadcn/ui (Radix)
- React Router 7 · TanStack Table 8 · React Hook Form 7 + Zod 4 · Recharts 3 · Sonner
- Dữ liệu demo là mock + local state. Không API, không database, không auth/RBAC.

> Đây là **source-first kit**: copy repo hoặc dùng GitHub *Use this template*. Không publish npm.

## Tính năng

- Design tokens light/dark hoàn chỉnh, font Be Vietnam Pro, primary amber.
- Admin shell: sidebar docked/collapsible/drawer mobile, header, breadcrumb, page header.
- 23 shadcn/ui primitives + 20 admin components dùng chung.
- 5 page template: Dashboard, List, Form (create + edit), Detail, Settings.
- Demo chạy được: khách hàng, sản phẩm, đơn hàng, báo cáo, cài đặt, showcase component.
- Tài liệu cho người và AI: `AGENTS.md`, `CLAUDE.md`, `UI_GUIDELINES.md`, `docs/`, 3 Agent Skills.
- Quality gate: `typecheck`, `lint`, `build`, keyboard/aria, responsive 375/768/1280, light/dark.

## Bắt đầu

Yêu cầu: Node 20.19+ / 22.12+ / 24 và pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev          # http://localhost:5173
```

| Lệnh | Việc |
| --- | --- |
| `pnpm dev` | dev server |
| `pnpm build` | `tsc --noEmit` + build production vào `dist/` |
| `pnpm preview` | xem bản build |
| `pnpm typecheck` | TypeScript strict, không emit |
| `pnpm lint` | ESLint 9 flat config |

## Cấu trúc

```text
src/
  app/            # App root, router, providers
  components/
    ui/           # shadcn/ui primitives — không fork
    layout/       # AdminShell, AdminSidebar, AdminHeader, PageHeader
    navigation/   # Breadcrumbs
    data-display/ # StatCard, StatusBadge, EmptyState, LoadingState, ErrorState, DescriptionList
    data-table/   # DataTable, Pagination, SortableHeader
    filters/      # SearchInput, FilterBar, DateFilter
    forms/        # FormField, FormSection, FormActions
    feedback/     # ConfirmDialog
    common/       # SectionCard, ThemeToggle
  layouts/        # AdminLayout, AdminLoading
  templates/      # dashboard/ list/ form/ detail/ settings/
  pages/          # demo theo domain (examples/, orders/, reports/) + showcase
  hooks/ lib/ config/ types/ mocks/ styles/
```

Luật phụ thuộc một chiều:

```text
pages → templates → components → components/ui
```

Mọi tầng được dùng `lib/`, `hooks/`, `types/`, `config/`. `components/**` không import `pages/**`, `mocks/**`, `templates/**` và không gọi API.

## Component inventory

API đầy đủ + ví dụ: [`docs/components.md`](docs/components.md). Showcase chạy được ở route `/components`.

| Nhóm | Component |
| --- | --- |
| Layout | `AdminShell`, `AdminHeader`, `AdminSidebar`, `PageHeader` |
| Navigation | `Breadcrumbs`, `useBreadcrumbs` |
| Data display | `StatCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `DescriptionList` |
| Data table | `DataTable`, `Pagination`, `SortableHeader` |
| Filters | `SearchInput`, `FilterBar`, `DateFilter` |
| Forms | `FormField`, `FormSection`, `FormActions` |
| Feedback | `ConfirmDialog` |
| Common | `SectionCard`, `ThemeToggle` |
| UI primitives | 23 file shadcn/ui trong `src/components/ui/` |

## Page template inventory

Chọn template theo loại trang, không dựng lại `PageHeader`/bảng/form. API + ví dụ: [`docs/page-templates.md`](docs/page-templates.md).

| Template | Dùng cho | Demo |
| --- | --- | --- |
| `DashboardTemplate` | tổng quan, KPI, chart, hoạt động | `/`, `/reports` |
| `ListTemplate` | danh sách + tìm kiếm/lọc/phân trang | `/customers`, `/products`, `/orders` |
| `FormTemplate` | tạo mới + chỉnh sửa, validation | `/customers/new`, `/customers/KH-1001/edit` |
| `DetailTemplate` | xem một bản ghi + metadata + related | `/customers/KH-1001`, `/orders/DH-5028` |
| `SettingsTemplate` | cấu hình chia mục | `/settings` |

## Tạo page mới

Ví dụ thêm module "Nhà cung cấp":

1. **Type dùng chung** (nếu có): `src/types/supplier.ts`.
2. **Mock**: `src/mocks/suppliers.mock.ts` — dữ liệu hư cấu, không thông tin thật.
3. **Page**: `src/pages/suppliers/SuppliersPage.tsx`, dùng `ListTemplate`; form dùng `FormTemplate`; chi tiết dùng `DetailTemplate`.
4. **Nav**: thêm mục vào `src/config/nav.ts` — sidebar và breadcrumb tự có.
5. **Route**: thêm entry lazy trong `src/app/routes.tsx`.
6. **Kiểm**: `pnpm typecheck && pnpm lint && pnpm build`, rồi xem 375/768/1280 + light/dark.

Quy ước mock: page tự lọc/sắp xếp/format; template và component không import mock.
`columns` của bảng phải bọc `useMemo` để tránh remount ô mỗi lần render.

## Dùng component

```tsx
import { Link } from "react-router"
import { EmptyState } from "@/components/data-display/EmptyState"
import { SearchInput } from "@/components/filters/SearchInput"
import { Button } from "@/components/ui/button"
import { ListTemplate } from "@/templates/list/ListTemplate"

<ListTemplate
  title="Nhà cung cấp"
  description="Danh sách nhà cung cấp."
  actions={<Button asChild><Link to="/suppliers/new">Thêm nhà cung cấp</Link></Button>}
  columns={columns}
  data={filtered}
  getRowId={(row) => row.id}
  filters={<SearchInput value={search} onValueChange={setSearch} />}
  onResetFilters={hasFilters ? reset : undefined}
  emptyState={<EmptyState title="Không có nhà cung cấp" />}
/>
```

Thứ tự ưu tiên khi cần UI mới: component có sẵn → shadcn/ui → Radix → ghép 2–3 component → tự viết.
Chi tiết: [`AGENTS.md`](AGENTS.md) §5.

## Tùy chỉnh theme

Token nằm trong `src/styles/globals.css` (Tailwind v4 CSS-first, không `tailwind.config.js`).
Sửa `:root` cho light và `.dark` cho dark; **không hardcode hex trong component dùng chung**.

```css
:root {
  --primary: #b45309;
  --radius: 0.625rem;
}
```

Tên app, mô tả, user demo: `src/config/site.ts`. Tiêu đề tab: `index.html`.
Chi tiết token, typography, layout, anti-pattern: [`UI_GUIDELINES.md`](UI_GUIDELINES.md).

## AI coding

Thứ tự đọc cho agent mới:

1. [`AGENTS.md`](AGENTS.md) — hợp đồng làm việc.
2. [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) — sản phẩm là gì, giới hạn.
3. [`HANDOFF.md`](HANDOFF.md) — trạng thái hiện tại, việc kế tiếp.
4. [`UI_GUIDELINES.md`](UI_GUIDELINES.md) — chuẩn giao diện.
5. `docs/` — kiến trúc, component, template, tooling.

Agent Skills có sẵn trong `.agents/skills/` (Codex, OpenCode) và `.claude/skills/` (Claude Code):

| Skill | Dùng khi |
| --- | --- |
| `admin-ui-development` | xây page quản trị từ template + mock |
| `admin-ui-component` | tạo component dùng chung mới |
| `admin-ui-review` | review UI/responsive/a11y trước khi báo xong |

Công cụ tùy chọn (ponytail, impeccable, frontend-design, Context7, Headroom): [`docs/tooling.md`](docs/tooling.md).

## Tạo repository mới từ template

1. Trên GitHub: **Use this template → Create a new repository**. Không fork nếu muốn lịch sử sạch.
2. Đổi định danh: `package.json` (`name`, `version`), `src/config/site.ts`, `index.html` (`<title>`), favicon.
3. Điền chủ sở hữu vào `LICENSE` (đang là placeholder).
4. Đổi tiền tố localStorage `adk-` nếu cần tránh trùng: `src/lib/theme.tsx`, `src/hooks/use-stored-value.ts`, script trong `index.html`.
5. Xoá demo không cần: `src/pages/examples|orders|reports`, `src/mocks`, route/nav tương ứng. Giữ `templates/`, `components/`.
6. Bật **Settings → General → Template repository** nếu repo mới tiếp tục làm template.
7. Chạy lại quality gate trước commit đầu tiên.

Checklist chi tiết: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Tài liệu

| File | Nội dung |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | luật làm việc cho AI agent |
| [`CLAUDE.md`](CLAUDE.md) | entry point ngắn cho Claude Code |
| [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) | mục tiêu, phạm vi, chiến lược |
| [`HANDOFF.md`](HANDOFF.md) | trạng thái & bàn giao giữa session |
| [`UI_GUIDELINES.md`](UI_GUIDELINES.md) | nguồn duy nhất về giao diện |
| [`docs/architecture.md`](docs/architecture.md) | tầng, ranh giới, routing, quyết định |
| [`docs/components.md`](docs/components.md) | API component |
| [`docs/page-templates.md`](docs/page-templates.md) | API + cách ghép template |
| [`docs/tooling.md`](docs/tooling.md) | Agent Skills & công cụ AI |
| [`docs/validation.md`](docs/validation.md) | biên bản validation dự án mới |

## Giới hạn

- SPA Vite, không SSR/SEO. Không backend, database, API thật, auth, RBAC.
- Mutation chỉ là local state: reload/rời trang sẽ reset.
- Phân trang/sắp xếp chạy client; dữ liệu lớn cần chuyển sang manual pagination.
- `DateFilter` dùng `<input type="date">` native nên format theo locale trình duyệt.
- Chart dark dùng thang xám trung tính, chưa có palette chart riêng cho dark.
- Chunk `charts` (Recharts) ~382 kB; chỉ tải ở route có chart.
- Copy tiếng Việt trong demo; kit không có i18n.
- `LICENSE` chưa có tên chủ sở hữu — phải điền trước khi phát hành.

## License

MIT — xem [`LICENSE`](LICENSE). Thay `[COPYRIGHT HOLDER]` bằng tên/chủ sở hữu thật trước khi publish.
