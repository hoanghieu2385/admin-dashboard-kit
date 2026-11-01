# Architecture — admin-dashboard-kit

Tài liệu này là **nguồn sự thật** về cấu trúc, ranh giới module và roadmap.
Quy ước code: `docs/coding-conventions.md` (Phase 5). Design tokens: `UI_GUIDELINES.md`.

## 1. Mô hình tầng

```
pages/  (demo, gắn mock data + local state)
  └→ templates/  (bố cục trang, nhận props + callback)
       └→ components/  (layout, data-table, forms, feedback, common)
            └→ components/ui/  (shadcn/ui primitives, không sửa style riêng lẻ)
```

Mọi tầng được dùng `lib/`, `hooks/`, `types/`, `config/`.

Luật bất biến:

1. Phụ thuộc chỉ đi **một chiều xuống dưới**.
2. `components/**` không import từ `pages/**`, `templates/**`, `mocks/**`.
3. `components/ui/**` giữ nguyên API shadcn/ui; tùy biến bằng `className`/variant, không fork.
4. Không có lời gọi mạng trong `components/` hay `templates/`.
5. `templates/` chỉ nhận dữ liệu qua props (kể cả `isLoading`, `error`, `onPageChange`).

## 2. Cây thư mục đích

```
admin-dashboard-kit/
├── AGENTS.md CLAUDE.md PROJECT_BRIEF.md HANDOFF.md UI_GUIDELINES.md README.md
├── .agents/skills/{admin-ui-development,component-development,page-development,ui-review}/
├── docs/{architecture,design-system,components,layouts,page-templates,coding-conventions,ai-workflow}.md
├── public/
├── src/
│   ├── app/            App.tsx · routes.tsx · providers/
│   ├── components/
│   │   ├── ui/         shadcn/ui (button, input, select, dialog, sheet, table, …)
│   │   ├── layout/     AdminShell, AdminSidebar, AdminHeader, PageHeader, MainContent
│   │   ├── navigation/ Breadcrumbs, NavGroup, NavItem, CommandMenu
│   │   ├── data-display/ StatCard, StatusBadge, EmptyState, LoadingState, ErrorState
│   │   ├── data-table/  DataTable, Pagination, SortableHeader
│   │   ├── filters/     SearchInput, FilterBar, DateFilter
│   │   ├── forms/       FormField, FormSection, FormActions (RHF)
│   │   ├── feedback/    ConfirmDialog, Alert, Toaster, SuccessState
│   │   └── common/      PageContainer, SectionCard, IconAction
│   ├── layouts/        AdminLayout.tsx
│   ├── templates/      dashboard/ list/ create/ edit/ detail/ settings/
│   ├── pages/          examples/ (customers, products, settings…)
│   ├── hooks/          use-stored-value, use-theme, use-media-query, use-debounce
│   ├── lib/            utils(cn), format, pagination, constants
│   ├── config/         nav.ts, site.ts
│   ├── types/          common.ts (Id, SortDir, PageState…)
│   ├── mocks/          customers.ts, products.ts, stats.ts
│   └── styles/         globals.css (tokens + theme)
├── components.json  package.json  pnpm-lock.yaml  tsconfig.json  vite.config.ts  eslint.config.js
```

Thư mục chỉ được tạo khi có file thật. Không tạo placeholder rỗng.

## 3. Ranh giới component

| Tầng | Được biết | Không được biết |
| --- | --- | --- |
| `ui/` | Tailwind, Radix, `cn()` | router, dữ liệu, nghiệp vụ |
| `layout/` `navigation/` | router, `config/nav.ts` | dữ liệu nghiệp vụ |
| `data-table/` | kiểu generic `TData`, TanStack Table | domain cụ thể |
| `templates/` | props, kiểu generic | API, mocks, router state |
| `pages/` | mocks, router, templates | chi tiết style của `ui/` |

`DataTable<TData>` là generic thuần: `columns`, `data`, `pageSize`, `initialSorting`, `isLoading`, `emptyState`, `toolbar`, `onRowClick`, `getRowId`, `caption`. Không biết "customer" là gì. Phân trang và sắp xếp chạy phía client (state nội bộ); khi có API thật mới chuyển sang `manualPagination`/`manualSorting`.

## 4. Routing

- `createBrowserRouter` + `RouterProvider`, route tree khai báo trong `src/app/routes.tsx`.
- `AdminLayout` là layout route; page con render qua `<Outlet />`.
- Route module lazy bằng `lazy()` để giữ bundle gọn; mỗi page export `default`.
- 404 bằng `errorElement`/`*` route dùng `ErrorState`, không để trắng trang.
- Nav config tập trung ở `src/config/nav.ts` (`label`, `href`, `icon`, `group`), sidebar và breadcrumb cùng đọc file này.

## 5. Chiến lược phiên bản

Pin theo major **đã có tài liệu ổn định**, không chạy theo bản mới nhất:

| Package | Pin | Lý do |
| --- | --- | --- |
| `react`, `react-dom` | 19.3.x | bản hiện hành, shadcn/ui hỗ trợ |
| `vite` | 7.3.x | Vite 8 vừa ra, hệ sinh thái plugin/template chưa theo kịp |
| `typescript` | 5.9.x | TS 7 (native) chưa ổn định cho tooling |
| `tailwindcss` | 4.3.x | Tailwind v4 CSS-first, khớp source tham chiếu |
| `react-router` | 7.18.x | v8 chưa có tài liệu ổn định; v7 = API data router hiện hành |
| `@tanstack/react-table` | 8.21.x | v9 còn alpha/thiếu tài liệu |
| `recharts` | 3.10.x | v3 ổn định với React 19 |
| `zod` | 4.6.x | resolver v7 hỗ trợ Zod 4 |

Nâng major phải kèm: lý do, kiểm tra build + type + lint, ghi lại trong file này.

## 6. Theme & style

- Token khai báo bằng CSS variables trong `src/styles/globals.css`, expose qua `@theme inline` (Tailwind v4).
- Không hardcode màu: dùng `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`.
- Dark mode bằng class `.dark` trên `<html>`, lưu lựa chọn ở `localStorage` (`use-stored-value`), mặc định theo `prefers-color-scheme`.
- Chi tiết token: `UI_GUIDELINES.md` §2.

## 7. Roadmap triển khai

### Phase 2 — Foundation

1. `pnpm create vite` (react-ts) tại repo, dọn boilerplate.
2. Tailwind v4 + `@tailwindcss/vite`, alias `@/*`, `tsconfig` strict.
3. `shadcn init` (new-york, neutral, cssVariables) → thêm primitive: button, input, select, checkbox, switch, dialog, sheet, dropdown-menu, popover, tooltip, tabs, badge, avatar, separator, skeleton, table, textarea, command, label.
4. `styles/globals.css`: token từ `UI_GUIDELINES.md`, Be Vietnam Pro qua `@fontsource` hoặc Google Fonts link.
5. `app/providers`: ThemeProvider (class), TooltipProvider, Toaster (Sonner).
6. `config/site.ts` + `config/nav.ts`; `app/routes.tsx` + `layouts/AdminLayout.tsx` + `components/layout/*` (shell, sidebar docked/drawer, header).
7. ESLint 9 flat + script `typecheck`, `lint`, `build`.
8. Kiểm chứng: `pnpm build` + `pnpm typecheck` sạch, sidebar/theme chạy, responsive 3 breakpoint.

### Phase 3 — Core components

1. `data-display/`: StatCard (tone generic), StatusBadge (nhận `tone`, không enum nghiệp vụ), EmptyState, LoadingState.
2. `data-table/`: DataTable generic (TanStack Table 8) + Pagination + SortableHeader.
3. `filters/`: SearchInput (debounce), FilterBar, DateFilter.
4. `forms/`: FormField/FormSection/FormActions (RHF + Zod).
5. `feedback/`: ConfirmDialog.
6. `navigation/`: Breadcrumbs (từ nav config) + `hooks/use-breadcrumbs`.
7. A11y: skip link trong `AdminShell`, tooltip cho nav khi sidebar collapsed.
8. Trang showcase `/components` (nav "UI Kit") minh hoạ toàn bộ component.

### Phase 4 — Page templates

Dashboard (stats + chart + list gần đây), List (toolbar + table + pagination + 3 state), Create/Edit (FormSection + actions + validation), Detail (descriptions + related), Settings (tabs + form).

### Phase 5 — Demo & docs

Demo nghiệp vụ "quản lý khách hàng" + "sản phẩm" bằng mock data; 4 agent skills; `docs/components.md`, `docs/page-templates.md`, `docs/layouts.md`, `docs/design-system.md`, `docs/coding-conventions.md`, `docs/ai-workflow.md`; README.

### Phase 6 — Template readiness

`.gitignore`, LICENSE (nếu user chọn), script `pnpm create:page` (tùy chọn), kiểm tra build/lint/type, dọn mock, checklist template, tag `v0.1.0`.

## 8. Quyết định đã chốt

| # | Quyết định | Ghi chú |
| --- | --- | --- |
| D1 | SPA Vite, không Next.js | kit độc lập, không phụ thuộc framework server |
| D2 | Chỉ kế thừa *design* từ `baolochp`, không copy code | khác runtime (Base UI vs Radix, Next vs Vite) |
| D3 | shadcn/ui Radix, style `radix-nova` | preset của `shadcn 4.x`; gần `new-york` nhưng dùng token mới (`data-slot`, `size-*`) |
| D4 | Tailwind v4 CSS-first, không config JS | khớp `baolochp` |
| D5 | Copy-in (source-first), không publish npm | người dùng sở hữu code |
| D6 | Copy UI tiếng Việt trong demo | đổi qua `config/site.ts` nếu cần |
| D7 | Theme context đặt ở `src/lib/theme.tsx` (không ở `app/providers/`) | để `components/**` dùng `useTheme` mà không phụ thuộc tầng `app/`; `app/providers` chỉ wire provider |
| D8 | Route chưa lazy | Phase 2 chỉ có trang tạm; chuyển sang `lazy()` ở Phase 4 khi có page thật |
| D9 | Key localStorage: `adk-theme`, `adk-sidebar-collapsed` | `adk-theme` đọc cả trong script chống nháy theme ở `index.html` |
| D10 | `FormField` dùng primitive `field` của shadcn 4.x, không có `form` component | registry 4.x bỏ `form`; `FormField` là render-prop nên bind được Input/Select/Textarea/Switch |
| D11 | Thêm token ngữ nghĩa `--success` `--warning` `--info` | tránh hardcode `text-green-600` trong `StatusBadge`/`StatCard`; dark dùng oklch sáng hơn |
| D12 | Trang showcase đặt ở `/components` (nav "UI Kit") | minh hoạ component ngay trong repo, không cần dựng page template trước Phase 4 |
| D13 | `SearchInput` đặt ở `components/filters/` | tránh nhét hành vi debounce/lọc vào `components/forms/` (form = submit + validation) |
