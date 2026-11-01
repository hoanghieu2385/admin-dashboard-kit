# PROJECT BRIEF — admin-dashboard-kit

Tài liệu mô tả **bản chất sản phẩm**. Ổn định, không phải nhật ký công việc.
Trạng thái & việc kế tiếp: `HANDOFF.md`. Luật làm việc: `AGENTS.md`.

## 1. Mục tiêu

Một **Admin Dashboard UI Kit** độc lập, tái sử dụng cho nhiều dự án quản trị:

- Không gắn với nghiệp vụ cụ thể (không hardcode Post/Product/Order trong kit).
- Chuẩn hóa 4 tầng: **design tokens → UI primitives → admin components → page templates**.
- Tài liệu đủ để nhiều AI coding agent làm việc nối tiếp mà không mất context.
- Sẵn sàng làm **GitHub Template Repository**: copy là chạy, không phụ thuộc máy tác giả.
- Source-first: người dùng sở hữu code, không publish npm.

Khi mở dự án mới: mô tả nghiệp vụ → chọn template → tái sử dụng component → chỉ viết phần đặc thù.

## 2. Phạm vi

Trong phạm vi:

- Design system: token light/dark, typography, spacing, radius, focus ring.
- Admin layout: sidebar (docked + collapsible + drawer mobile), header, breadcrumb, page header.
- shadcn/ui primitives + admin components dùng chung.
- Form building blocks (RHF + Zod).
- 5 page template: Dashboard, List, Form (create/edit), Detail, Settings.
- Demo app dùng mock + local state.
- Tài liệu, Agent Skills, hướng dẫn tooling.

Ngoài phạm vi (không làm):

- Backend, database, API, authentication, RBAC.
- Business logic đặc thù hoặc module nghiệp vụ mặc định trong kit.
- Publish npm package.
- SSR/SEO — đây là SPA (Vite), không phải website công khai.
- i18n đa ngôn ngữ (copy hiện là tiếng Việt, đổi qua từng file/config).

## 3. Stack

| Nhóm | Lựa chọn | Ghi chú |
| --- | --- | --- |
| Build | Vite 7 + `@vitejs/plugin-react` | SPA, không SSR |
| UI runtime | React 19 + TypeScript 5.9 | strict mode |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | CSS-first, không `tailwind.config.js` |
| Components | shadcn/ui (Radix), Lucide | style `radix-nova`, neutral base |
| Routing | React Router 7 (`createBrowserRouter`) | data router, lazy route |
| Table | TanStack Table 8 | wrapper `DataTable` generic |
| Form | React Hook Form 7 + Zod 4 + `@hookform/resolvers` | schema ngoài component |
| Charts | Recharts 3 | chỉ ở demo/template dashboard |
| Toast | Sonner 2 | một provider toàn cục |
| Date | date-fns 4 | format qua `lib/format.ts` |
| Package manager | pnpm 11 | `packageManager: pnpm@11.10.0` |
| Lint/type | ESLint 9 flat + `tsc --noEmit` | không `@ts-ignore` |

Chi tiết phiên bản & lý do pin: `docs/architecture.md` §5.

## 4. Design philosophy

1. **Rõ ràng hơn hào nhoáng.** Tương phản chữ, khoảng trắng, viền mảnh; không gradient/glass/shadow nặng.
2. **Một điểm nhấn.** Primary amber chỉ cho hành động chính, trạng thái active, focus ring.
3. **Token trước, style sau.** Không hex rải rác; đổi theme không vỡ component.
4. **Dense nhưng thở.** Admin cần nhiều dữ liệu; base 15px, gap 24px giữa section, card `rounded-xl`.
5. **Accessibility là mặc định.** Label, focus ring, keyboard, tap target, contrast — không phải bước cuối.
6. **Light + dark cùng chuẩn.** Dark không giữ amber làm primary để tránh chói; dùng neutral sáng.
7. **Copy tiếng Việt, câu ngắn, động từ rõ.** Đổi ngôn ngữ là quyết định của dự án mới.

Nguồn duy nhất cho chi tiết thị giác: `UI_GUIDELINES.md`.

## 5. Architecture

```text
pages/ (mock, router, RHF, state)
  └→ templates/ (bố cục + slot)
       └→ components/ (layout, data-table, forms, feedback, common)
            └→ components/ui/ (shadcn/ui)
```

- Phụ thuộc một chiều; không import ngược.
- `components/**` không biết page/mock/API.
- Template chỉ nhận props/callback, không giữ state nghiệp vụ.
- Page quyết định dữ liệu, cột, schema, nhãn, tone.

Chi tiết: `docs/architecture.md`.

## 6. Chiến lược component

- Ưu tiên: có sẵn → shadcn/ui → Radix → composition → tự viết.
- Kit **không** chứa enum nghiệp vụ. `StatusBadge` nhận `tone`; page map trạng thái → nhãn + tone.
- Component mới phải generic: dữ liệu qua props, hành vi qua callback, override qua `className`.
- Không tạo wrapper 1-1 quanh shadcn/ui nếu không thêm giá trị.
- Không thêm dependency cho một component nhỏ.

## 7. Chiến lược template

- 5 template cố định; `FormTemplate` kiêm create + edit qua `mode`.
- Template chịu trách nhiệm: `PageHeader`, grid, loading/empty/error slot, accessibility cơ bản.
- Template **không** biết: mock, router, schema, format, nhãn nghiệp vụ.
- Chưa tạo template mới khi mới có một nhu cầu; ghép `PageHeader` + `SectionCard` trước.

## 8. Chiến lược AI coding

- Một bộ context chung: `AGENTS.md` (luật) → `PROJECT_BRIEF.md` (bản chất) → `HANDOFF.md` (trạng thái) → `UI_GUIDELINES.md` (thị giác).
- Skill chuyên biệt để giảm context: `admin-ui-development`, `admin-ui-component`, `admin-ui-review`.
- Tài liệu không lặp nội dung; mỗi file có một vai trò.
- Agent phải kiểm source thực tế và chạy quality gate trước khi báo xong.
- Công cụ ngoài (ponytail, impeccable, Context7, Headroom) là tùy chọn, không phải dependency của repo.

## 9. Giới hạn không được vượt

- Không backend/database/API/auth/RBAC.
- Không publish npm, không đổi scope khi chưa hỏi.
- Không hardcode secret, thông tin cá nhân thật, dữ liệu dự án riêng.
- Không phụ thuộc đường dẫn máy local hoặc source ngoài repo.
- Không đổi design token/stack để giải quyết một màn hình đơn lẻ.
- Không tuyên bố hoàn thành khi chưa chạy `typecheck`/`lint`/`build` và kiểm UI.
