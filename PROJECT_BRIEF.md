# PROJECT BRIEF — admin-dashboard-kit

## 1. Mục tiêu

Một **Admin Dashboard UI Kit** độc lập, tái sử dụng cho nhiều dự án quản trị khác nhau:

- Không gắn với bất kỳ nghiệp vụ cụ thể nào (không có Post/Product/Order hardcode).
- Kế thừa **design system & trải nghiệm UI** từ dashboard `baolochp` (xem §4).
- Nền tảng component: **shadcn/ui** (Radix) + Tailwind CSS v4.
- Chuẩn hóa 4 tầng: **Design tokens → UI components → Admin components → Page templates**.
- Tài liệu hóa đủ để nhiều AI coding agent (Claude Code, OpenCode, Codex…) làm việc nối tiếp nhau mà không mất context.
- Sẵn sàng trở thành **GitHub Template Repository**.

Khi mở dự án mới: mô tả nghiệp vụ → tái sử dụng layout, component, template có sẵn → chỉ viết phần đặc thù.

## 2. Phạm vi

Trong phạm vi:

- Design system (tokens, light/dark theme).
- Admin layout: sidebar (docked + collapsible + drawer mobile), header, breadcrumb, page header.
- UI components (shadcn/ui) + admin components dùng chung (DataTable, filters, stats, status, states).
- Form building blocks (RHF + Zod).
- 6 page templates: Dashboard, List, Create, Edit, Detail, Settings.
- Demo app dùng mock data + local state.
- Tài liệu + agent skills.

Ngoài phạm vi (không làm):

- Backend, database, API, authentication, RBAC.
- Publish npm package (v1 là source-first, copy/paste).
- Business logic đặc thù.
- SSR/SEO — đây là SPA (Vite), không phải website công khai.

## 3. Stack

| Nhóm | Lựa chọn | Ghi chú |
| --- | --- | --- |
| Build | Vite 7 + `@vitejs/plugin-react` | SPA, không SSR |
| UI runtime | React 19 + TypeScript 5.9 | strict mode |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS-first, không `tailwind.config.js` |
| Components | shadcn/ui (Radix), Lucide icons | style `new-york`, neutral base |
| Routing | React Router 7 (`createBrowserRouter`) | data router, lazy route modules |
| Table | TanStack Table 8 (headless) | wrapper `DataTable` generic |
| Form | React Hook Form 7 + Zod 4 + `@hookform/resolvers` | schema ở ngoài component |
| Charts | Recharts 3 | chỉ dùng trong demo/template dashboard |
| Toast | Sonner 2 | 1 provider toàn cục |
| Date | date-fns 4 | format qua `lib/format.ts` |
| Package manager | pnpm | `packageManager: pnpm@11.10.0` |
| Lint/type | ESLint 9 (flat) + `tsc --noEmit` | không `@ts-ignore` |

Chi tiết phiên bản & lý do pin trong `docs/architecture.md` §5.

## 4. Nguồn tham chiếu thiết kế

- Đường dẫn: `/home/hoanghieu/Documents/Git_clone/hieuhm525/baolochp` (đọc-only).
- Đó là Next.js 16 + Base UI ("base-nova") + TRPC + Drizzle — **không copy code**, chỉ kế thừa:
  - Design tokens: primary amber `#b45309`, neutrals slate, radius `0.625rem`, font Be Vietnam Pro, base text 15px.
  - Quy ước layout: shell cao `h-dvh` chỉ `<main>` scroll, sidebar 16rem / 4.75rem collapsed, header 16 (4rem), container `max-w-[90rem]`.
  - Quy ước trình bày: title thuộc `PageHeader` (header toàn cục không lặp title), card `rounded-xl border-slate-200`, focus ring 3px amber.
  - Mức chất lượng accessibility: tap target ≥ 44px, `aria-*` đầy đủ, copy tiếng Việt.

Không đụng vào source `baolochp` dưới mọi hình thức.

## 5. Kiến trúc (tóm tắt)

```
src/
  app/          # App root, router, providers
  components/   # ui/ layout/ navigation/ data-display/ data-table/ forms/ feedback/ common/
  layouts/      # AdminLayout
  templates/    # dashboard/ list/ create/ edit/ detail/ settings/
  pages/        # examples/ (demo gắn mock data)
  hooks/ lib/ config/ types/ mocks/ styles/
```

Luật phụ thuộc một chiều:

`pages → templates → components → components/ui` và mọi tầng đọc `lib/ hooks/ types/ config/`.

Component **không** import từ `pages/`, **không** gọi API, **không** chứa mock data.

Chi tiết: `docs/architecture.md`.

## 6. Nguyên tắc

1. Reusable first, documentation-driven, AI-friendly.
2. Ưu tiên có sẵn: shadcn/ui → Radix → thư viện đã cài → tự viết (chỉ khi thật cần).
3. Custom component = composition của component có sẵn, không phải bản viết lại.
4. Dữ liệu vào qua props, hành vi ra qua callback. Không hardcode business logic.
5. TypeScript rõ ràng, hạn chế `any`, không `@ts-ignore`.
6. Responsive + light/dark + accessibility là yêu cầu bắt buộc.
7. Không abstraction "để sau".
8. Mọi quyết định kiến trúc ghi vào `docs/`.

## 7. Các phase

| Phase | Nội dung | Trạng thái |
| --- | --- | --- |
| 1 | Audit, planning, tài liệu nền tảng | ✅ xong |
| 2 | Foundation: Vite/TS/Tailwind/shadcn/router/theme/AdminLayout/navigation | ✅ xong |
| 3 | Core components (UI, admin, data, form, feedback) | ⏳ tiếp theo |
| 4 | Page templates (6 loại) | ⏳ |
| 5 | Demo hoàn chỉnh + docs component/template + agent skills + README | ⏳ |
| 6 | GitHub Template readiness | ⏳ |

Roadmap chi tiết từng bước: `docs/architecture.md` §7.
Trạng thái hiện tại & việc kế tiếp: `HANDOFF.md`.
