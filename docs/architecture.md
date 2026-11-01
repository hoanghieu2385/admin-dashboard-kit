# Architecture — admin-dashboard-kit

**Nguồn sự thật** về cấu trúc, ranh giới module, routing và các quyết định kiến trúc.
Quy ước code: `AGENTS.md`. Design tokens: `UI_GUIDELINES.md`. API: `docs/components.md`, `docs/page-templates.md`.

## 1. Mô hình tầng

```text
pages/  (demo, mock data + local state + RHF + router)
  └→ templates/  (bố cục trang, nhận props + callback)
       └→ components/  (layout, data-table, forms, feedback, common)
            └→ components/ui/  (shadcn/ui primitives)
```

Mọi tầng được dùng `lib/`, `hooks/`, `types/`, `config/`.

Luật bất biến:

1. Phụ thuộc chỉ đi **một chiều xuống dưới**.
2. `components/**` không import `pages/**`, `templates/**`, `mocks/**`.
3. `components/ui/**` giữ API shadcn/ui; tùy biến bằng `className`/variant, không fork.
4. Không có lời gọi mạng trong `components/` hay `templates/`.
5. `templates/` chỉ nhận dữ liệu qua props (`isLoading`, `error`, `onPageChange` nếu có).

## 2. Cây thư mục

```text
admin-dashboard-kit/
├── README.md AGENTS.md CLAUDE.md PROJECT_BRIEF.md HANDOFF.md UI_GUIDELINES.md
├── CONTRIBUTING.md LICENSE
├── .github/                 PULL_REQUEST_TEMPLATE.md · ISSUE_TEMPLATE/
├── .agents/skills/          admin-ui-development/ admin-ui-component/ admin-ui-review/
├── .claude/skills/          symlink tới .agents/skills/* (Claude Code)
├── docs/                    architecture.md components.md page-templates.md tooling.md validation.md
├── public/                  favicon.svg
├── src/
│   ├── app/                 App.tsx · routes.tsx · providers/
│   ├── components/
│   │   ├── ui/              shadcn/ui (23 primitive)
│   │   ├── layout/          AdminShell · AdminSidebar · AdminHeader · PageHeader
│   │   ├── navigation/      Breadcrumbs
│   │   ├── data-display/    StatCard · StatusBadge · EmptyState · LoadingState · ErrorState · DescriptionList
│   │   ├── data-table/      DataTable · Pagination · SortableHeader
│   │   ├── filters/         SearchInput · FilterBar · DateFilter
│   │   ├── forms/           FormField · FormSection · FormActions
│   │   ├── feedback/        ConfirmDialog
│   │   └── common/          SectionCard · ThemeToggle
│   ├── layouts/             AdminLayout · AdminLoading
│   ├── templates/           dashboard/ list/ form/ detail/ settings/
│   ├── pages/               examples/ dashboard-customers-products-settings · orders/ · reports/ · components · error
│   ├── hooks/               use-stored-value · use-breadcrumbs
│   ├── lib/                 utils · format · theme · order-utils · report-utils
│   ├── config/              nav.ts · site.ts
│   ├── types/               common.ts · order.ts · report.ts
│   ├── mocks/               customers · products · orders.mock · reports.mock · dashboard
│   └── styles/              globals.css
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

`DataTable<TData>` là generic thuần: `columns`, `data`, `pageSize`, `initialSorting`, `isLoading`, `emptyState`, `toolbar`, `onRowClick`, `getRowId`, `caption`.
Phân trang/sắp xếp chạy phía client (state nội bộ); khi có API thật mới chuyển sang `manualPagination`/`manualSorting`.

## 4. Routing

- `createBrowserRouter` + `RouterProvider`; route tree trong `src/app/routes.tsx`.
- `AdminLayout` là layout route; page con render qua `<Outlet />`.
- Page lazy bằng `lazy()` + helper `lazyPage()`; mỗi page export `default`.
- Route gốc có `HydrateFallback: AdminLoading` cho lần truy cập trực tiếp bằng URL.
  Điều hướng client-side giữ trang cũ tới khi chunk xong (không có Suspense boundary theo route).
- 404 bằng route `*` + `errorElement` dùng `ErrorPage`, không để trắng trang.
- Nav config tập trung ở `src/config/nav.ts` (`NavGroup[]`, mỗi item có `label`, `href`, `icon`); sidebar và breadcrumb cùng đọc file này.
- Breadcrumb suy ra từ URL + nav config (`hooks/use-breadcrumbs.ts`); không khai báo riêng trong page.

## 5. Chiến lược phiên bản

Pin theo major **đã có tài liệu ổn định**, không chạy theo bản mới nhất:

| Package | Pin hiện tại | Lý do |
| --- | --- | --- |
| `react`, `react-dom` | 19.3.x | bản hiện hành, shadcn/ui hỗ trợ |
| `vite` | 7.3.x | Vite 8 chưa cần; hệ sinh thái plugin/template còn theo Vite 7 |
| `typescript` | 5.9.x | TS 7 (native) chưa ổn định cho tooling |
| `tailwindcss` | 4.3.x | Tailwind v4 CSS-first |
| `react-router` | 7.18.x | v8 chưa có tài liệu ổn định; v7 = data router hiện hành |
| `@tanstack/react-table` | 8.21.x | v9 còn alpha/thiếu tài liệu |
| `recharts` | 3.10.x | v3 ổn định với React 19 |
| `zod` | 4.6.x | resolver v7 hỗ trợ Zod 4 |

Nâng major phải kèm: lý do, kiểm tra build + type + lint, ghi lại trong file này.
Dependency dùng chung để ghép class là `cn` (drop-in cho clsx + tailwind-merge); import qua `@/lib/utils`.

## 6. Theme & style

- Token khai báo bằng CSS variables trong `src/styles/globals.css`, expose qua `@theme inline` (Tailwind v4).
- Không hardcode màu: dùng `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`.
- Dark mode bằng class `.dark` trên `<html>`, lưu ở `localStorage` (`adk-theme`), mặc định theo `prefers-color-scheme`.
- Script chống nháy theme nằm trong `index.html`; dùng cùng key với `src/lib/theme.tsx`.
- Chi tiết token: `UI_GUIDELINES.md` §2.

## 7. Roadmap & trạng thái

| Phase | Nội dung | Trạng thái |
| --- | --- | --- |
| 1 | Audit, planning, tài liệu nền tảng | ✅ |
| 2 | Vite/TS/Tailwind/shadcn/router/theme/AdminLayout/navigation | ✅ |
| 3 | Core components (UI, admin, data, form, feedback) | ✅ |
| 4 | Page templates + demo mock + lazy route | ✅ |
| 5 | Demo orders/reports + docs component/template | ✅ |
| 6 | GitHub Template readiness, AI context, skills, tooling, validation | ✅ repo · ⏳ thao tác GitHub của chủ repo |

Chi tiết việc đã làm & việc kế tiếp: `HANDOFF.md`.

## 8. Quyết định đã chốt

| # | Quyết định | Ghi chú |
| --- | --- | --- |
| D1 | SPA Vite, không Next.js | kit độc lập, không phụ thuộc framework server |
| D2 | Chỉ kế thừa *design*, không copy code nguồn ngoài | runtime/stack khác; token được Việt hoá cho kit |
| D3 | shadcn/ui Radix, style `radix-nova` | preset `shadcn 4.x`; dùng `data-slot`, `size-*` |
| D4 | Tailwind v4 CSS-first, không config JS | CSS variables + `@theme inline` |
| D5 | Copy-in (source-first), không publish npm | người dùng sở hữu code |
| D6 | Copy UI tiếng Việt trong demo | đổi ở `config/site.ts` và từng page khi dự án mới |
| D7 | Theme context ở `src/lib/theme.tsx` | `components/**` dùng `useTheme` mà không phụ thuộc `app/` |
| D8 | Route lazy từ Phase 4 | `lazy()` + `lazyPage`; `HydrateFallback` cho direct URL |
| D9 | Key localStorage: `adk-theme`, `adk-sidebar-collapsed` | `adk-theme` đọc cả trong script `index.html` |
| D10 | `FormField` dùng primitive `field` của shadcn 4.x | registry 4.x bỏ `form`; render-prop bind mọi control |
| D11 | Token ngữ nghĩa `--success` `--warning` `--info` | tránh hardcode màu trong `StatusBadge`/`StatCard` |
| D12 | Showcase ở `/components` (nav "UI Kit") | minh hoạ component ngay trong repo |
| D13 | `SearchInput` ở `components/filters/` | tách hành vi debounce khỏi `forms/` (submit + validation) |
| D14 | 5 template, `FormTemplate` kiêm create + edit | tránh 2 template trùng 95% code |
| D15 | Template không giữ form state | `FormTemplate` nhận `UseFormReturn`; `SettingsTemplate` nhận section + callback |
| D16 | `SettingsTemplate` mount mọi section, ẩn bằng `hidden` | field tab không active vẫn giữ value + validate khi submit |
| D17 | `SectionCard`, `DescriptionList`, `ErrorState` là building block | tránh lặp markup trong template/page |
| D18 | Mock tách theo domain | page tự lọc/format; template không import `mocks/` |
| D19 | `mocks/orders.mock.ts` là nguồn đơn hàng duy nhất | `createOrder()` sinh tổng tiền; báo cáo đọc lại, không hardcode KPI |
| D20 | Tổng hợp báo cáo ở `lib/report-utils.ts` | hàm thuần; loại đơn `cancelled` khỏi doanh thu/AOV/top sản phẩm |
| D21 | Skill canonical ở `.agents/skills/`, symlink từ `.claude/skills/` | Codex + OpenCode đọc `.agents`; Claude Code đọc `.claude` |
| D22 | Công cụ AI ngoài là tùy chọn, không phải dependency | không thêm package/chỉ dẫn cài đặt máy cụ thể vào repo |
| D23 | `LICENSE` MIT với placeholder chủ sở hữu | không tự bịa tên pháp lý; người dùng điền trước publish |
| D24 | Validation chạy trong thư mục tách biệt, không đưa module Suppliers vào repo chính | giữ kit trung lập nghiệp vụ; biên bản ở `docs/validation.md` |
