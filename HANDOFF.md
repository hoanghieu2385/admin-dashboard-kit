# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **2 xong → chờ xác nhận sang Phase 3**

## Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). Code Phase 2 đã có, **chưa commit**.
- Chạy được: `pnpm install` → `pnpm dev` (http://localhost:5173).
- Đã kiểm: `pnpm typecheck` ✅ · `pnpm lint` ✅ (0 error, 0 warning) · `pnpm build` ✅ (JS 499 kB / gzip 162 kB, CSS 83 kB / gzip 13 kB).

## Đã xong

### Hạ tầng

| File | Nội dung |
| --- | --- |
| `package.json` `pnpm-workspace.yaml` | Vite 7 + React 19 + TS 5.9; script `dev/build/preview/typecheck/lint`; cho phép build script `esbuild` |
| `vite.config.ts` | plugin React + Tailwind v4, alias `@` → `src` |
| `tsconfig.json` | strict, `noUnusedLocals/Parameters`, `verbatimModuleSyntax`, path `@/*` |
| `eslint.config.js` | flat config: js + typescript-eslint + react-hooks + react-refresh; tắt `only-export-components` cho `components/ui/**` và `lib/theme.tsx` |
| `index.html` | `lang="vi"`, favicon SVG, script chống nháy theme trước paint, `theme-color` light/dark |
| `public/favicon.svg` | logo tạm (nền amber, 3 ô) |

### Design system

| File | Nội dung |
| --- | --- |
| `src/styles/globals.css` | Tailwind v4 `@theme inline`: map toàn bộ token shadcn (background/card/primary/…/chart/sidebar), radius scale, `--spacing-header/sidebar/sidebar-collapsed`, `--container-page: 90rem`; light = hex từ `baolochp`, dark = oklch neutral; font Be Vietnam Pro |
| `src/components/ui/*` (20 file) | shadcn/ui (Radix, style `radix-nova`): avatar badge button checkbox command dialog dropdown-menu input input-group label popover select separator sheet skeleton sonner switch table tabs textarea tooltip |
| `src/lib/theme.tsx` | ThemeProvider + `useTheme` (`light/dark/system`), lưu `localStorage`, theo `prefers-color-scheme` |
| `src/lib/utils.ts` | `cn` (shadcn 4.x dùng package `cn`) |
| `src/app/providers/index.tsx` | ThemeProvider + TooltipProvider(200ms) + Toaster (theme theo resolvedTheme) |

### Layout & navigation

| File | Nội dung |
| --- | --- |
| `src/layouts/AdminLayout.tsx` | layout route: `AdminShell` + `Outlet`, truyền `demoUser` |
| `src/components/layout/AdminShell.tsx` | shell `h-dvh`, chỉ `<main>` cuộn, reset scroll khi đổi route, đóng drawer khi ≥1024px |
| `src/components/layout/AdminSidebar.tsx` | docked 16rem / collapsed 4.75rem (lưu localStorage, có `title` + `aria-label`), drawer mobile bằng `Sheet`, group nav + active state |
| `src/components/layout/AdminHeader.tsx` | menu mobile, theme toggle, menu tài khoản (tên/email/vai trò + link Cài đặt); **không** chứa page title |
| `src/components/layout/PageHeader.tsx` | title + description + actions (actions full-width trên mobile) |
| `src/components/common/ThemeToggle.tsx` | dropdown Sáng / Tối / Theo hệ thống, check ở mục đang chọn |
| `src/config/site.ts` | `site` (name/shortName/description) + `demoUser` |
| `src/config/nav.ts` | 3 group / 6 item — nguồn duy nhất cho sidebar (breadcrumb Phase 3 dùng lại) |
| `src/hooks/use-stored-value.ts` | đọc/ghi localStorage an toàn + `SIDEBAR_COLLAPSED_KEY` |
| `src/types/common.ts` | `AdminUser` |

### Routing & trang

| File | Nội dung |
| --- | --- |
| `src/app/routes.tsx` | `createBrowserRouter`: `/`, `/customers`, `/products`, `/orders`, `/reports`, `/settings`, `*` |
| `src/app/App.tsx` | `AppProviders` + `RouterProvider` |
| `src/main.tsx` | font (400/500/600/700), CSS, StrictMode |
| `src/pages/ComingSoonPage.tsx` | trang tạm (PageHeader + ghi chú Phase 4) |
| `src/pages/ErrorPage.tsx` | dùng cho cả `*` và `errorElement`, tự có padding/container |

### Đã kiểm bằng trình duyệt (Chrome headless, puppeteer-core)

- 1280 / 768 / 375 px: không tràn ngang, sidebar docked ở ≥1024, drawer ở nhỏ hơn.
- Drawer mở bằng nút Menu, đóng bằng `Esc` ✅.
- Collapse sidebar → 76px, icon-only, giữ trạng thái sau F5 ✅.
- Theme: đổi sang Tối → `.dark` + `localStorage.adk-theme="dark"`, không nháy khi F5 ✅.
- Điều hướng `/customers` đổi `h1` + active nav ✅. `/khong-ton-tai` → "Không tìm thấy trang" ✅.
- Console: **0 error, 0 warning**, không request 4xx ✅.

## Dependencies đã cài

Runtime: react 19.3 · react-dom 19.3 · react-router 7.18 · @tanstack/react-table 8.21 · react-hook-form 7.91 · @hookform/resolvers 7.0 · zod 4.6 · sonner 2.0 · recharts 3.10 · date-fns 4.4 · lucide-react 1.66 · radix-ui 1.8 · cmdk 1.1 · class-variance-authority 0.7 · cn 0.5 · tailwind-merge (transitive) · tw-animate-css 1.4 · @fontsource/be-vietnam-pro 5.3 · shadcn 4.23 (cung cấp `shadcn/tailwind.css`).

Dev: vite 7.3 · @vitejs/plugin-react 5.2 · typescript 5.9 · tailwindcss + @tailwindcss/vite 4.3 · eslint 9 + typescript-eslint 8 + react-hooks 7 + react-refresh 0.5 · globals 17 · @types/{node,react,react-dom}.

Đã bỏ: `@fontsource-variable/geist`, `clsx`, `tailwind-merge` (dư — `cn` đã gồm) do shadcn init tự thêm.

## Chưa làm (có chủ đích)

- Breadcrumb, CommandMenu, DataTable, StatCard, form components → Phase 3.
- 6 page template + page demo thật → Phase 4 (hiện là `ComingSoonPage`).
- Lazy route, page titles theo route, breadcrumb từ `config/nav.ts` → Phase 3–4 (D8).
- `docs/{design-system,components,layouts,page-templates,coding-conventions,ai-workflow}.md`, 4 agent skill, LICENSE → Phase 5–6.
- Nút "bỏ qua tới nội dung" (skip link) — nên thêm khi làm a11y pass ở Phase 3.
- Tooltip cho icon khi sidebar collapsed (hiện dùng `title` native).

## Việc kế tiếp (Phase 3 — Core components)

1. `components/common/`: `PageContainer`, `SectionCard`, `IconAction`.
2. `components/data-display/`: `StatCard` (tone generic), `StatusBadge` (nhận `tone` từ page, không enum nghiệp vụ), `EmptyState`, `LoadingState`, `ErrorState`.
3. `components/data-table/`: `DataTable<TData>` (TanStack Table 8) + `TableToolbar` + `Pagination` + `SortableHeader` + `SortableHeader` action; states loading/empty.
4. `components/forms/`: `FormField`, `FormSection`, `FormActions` (RHF + Zod), `SearchInput` (debounce 300ms), `FilterBar`.
5. `components/feedback/`: `ConfirmDialog`, `Alert` (shadcn `alert` cần add), `SuccessState`.
6. `components/navigation/Breadcrumbs` đọc `config/nav.ts`.
7. Sau mỗi nhóm: `pnpm typecheck && pnpm lint && pnpm build`, kiểm tra UI bằng màn hình thật.

## Vấn đề cần xác nhận

1. **Commit Phase 2?** (chưa commit gì; có thể gộp Phase 1 + 2 vào 1 commit hoặc 2 commit riêng).
2. **License** (MIT / không license) — cần trước Phase 6.
3. **Dark mode primary** đang là neutral trắng như `baolochp`; nếu muốn amber ở dark thì đổi 2 dòng trong `globals.css` (`.dark { --primary, --primary-foreground }`).
4. **Font**: đang self-host qua `@fontsource` (4 weight, ~120 kB woff2) — nếu ưu tiên bundle nhỏ có thể giảm còn 400/600.
