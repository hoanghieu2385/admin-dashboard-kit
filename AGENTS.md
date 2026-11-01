# AGENTS.md

Hợp đồng làm việc cho mọi AI coding agent (Claude Code, OpenCode, Codex, Cursor, Windsurf…) trong repo này.
Đọc file này trước khi sửa code. Trạng thái hiện tại: `HANDOFF.md`. Chuẩn thị giác: `UI_GUIDELINES.md`.

## 1. Project là gì

`admin-dashboard-kit` — Admin Dashboard UI Kit tái sử dụng: design system + admin components + page templates + demo, **không có backend**. Mọi dữ liệu demo là mock + local state.

Mục tiêu: dự án mới chỉ cần mô tả nghiệp vụ, tái sử dụng những gì có sẵn, không thiết kế lại.
Đây là GitHub Template Repository: mọi thứ trong repo phải dùng được sau khi copy sang dự án mới.

## 2. Stack đã chốt

React 19 · TypeScript 5.9 (strict) · Vite 7 · Tailwind CSS v4 · shadcn/ui (Radix) · React Router 7 · TanStack Table 8 · React Hook Form 7 + Zod 4 · Sonner · Recharts · date-fns · Lucide · pnpm.

Không đổi stack, không thêm dependency trùng chức năng, không thêm framework CSS khác.

## 3. Thứ tự đọc trước khi code

1. `AGENTS.md` (file này).
2. `PROJECT_BRIEF.md` — phạm vi và giới hạn.
3. `HANDOFF.md` — đang ở đâu, việc kế tiếp.
4. `UI_GUIDELINES.md` — nếu chạm UI.
5. `docs/architecture.md` + `docs/components.md` + `docs/page-templates.md` — nếu chạm cấu trúc/component/template.
6. Source code thực tế — **nguồn sự thật**. Không tin báo cáo cũ nếu code khác.

Với task UI, nạp skill `admin-ui-development` (xây page), `admin-ui-component` (tạo component), `admin-ui-review` (review). Skill nằm trong `.agents/skills/`; `.claude/skills/` là symlink cho Claude Code.

## 4. Kiến trúc & ranh giới

```text
pages/  (demo, mock, router, RHF, state)
  └→ templates/  (bố cục + slot, chỉ nhận props/callback)
       └→ components/  (layout, data-table, forms, feedback, common)
            └→ components/ui/  (shadcn/ui primitives)
```

- Phụ thuộc chỉ đi một chiều xuống dưới.
- `components/**` không import `pages/**`, `templates/**`, `mocks/**`; không gọi API.
- `templates/**` không biết router, không giữ state nghiệp vụ, không import mock.
- `components/ui/**` giữ API shadcn/ui; tùy biến bằng `className`/variant, không fork.
- Không tạo kiến trúc song song (state library, fetch layer, CSS framework, i18n…) khi chưa được yêu cầu.

Chi tiết bảng ranh giới + cây thư mục: `docs/architecture.md`.

## 5. Luật tái sử dụng component

Thứ tự bắt buộc khi cần một UI:

1. Đã có trong `src/components/**`? → dùng.
2. shadcn/ui có? → `pnpm dlx shadcn@latest add <component>` rồi **đọc lại file vừa sinh**, chỉnh cho khớp token dự án.
3. Radix có primitive phù hợp? → bọc theo phong cách shadcn.
4. Ghép được từ 2–3 component sẵn có? → composition trong `components/common/`.
5. Chỉ khi (1)–(4) đều không → tự viết, đặt đúng thư mục theo `docs/architecture.md` §3.

Component mới phải: không phụ thuộc dữ liệu cụ thể, dữ liệu qua props, hành vi qua callback, có `className`, responsive, dark mode, keyboard/`aria` cơ bản.

Không viết lại `Button`, `Select`, `Dialog`, `<table>` trần, `ConfirmDialog`, `EmptyState`, `LoadingState`… đã có.

## 6. Luật design system

- Chỉ dùng token: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`… **Không** hardcode hex/`slate-*` trong component dùng chung (ngoại lệ: demo minh họa tone).
- Light + dark phải cùng đẹp; kiểm tra trước khi xong.
- Không tự sáng tạo radius, spacing, font, shadow nếu token đã có.
- Không đổi design system để "polish" một màn hình. Thay đổi token là quyết định kiến trúc: hỏi trước, ghi vào `docs/architecture.md` §8.

Chi tiết: `UI_GUIDELINES.md` (nguồn duy nhất về giao diện).

## 7. Luật thiết kế page

- Trang tổng quan → `DashboardTemplate`.
- Danh sách/tìm kiếm/lọc/phân trang → `ListTemplate` + `DataTable`; không tự viết `<table>`.
- Nhập liệu/validation → `FormTemplate` (create + edit qua `mode`).
- Xem một bản ghi → `DetailTemplate`.
- Cấu hình chia mục → `SettingsTemplate`.
- Không khớp 5 loại → ghép `PageHeader` + `SectionCard`, chưa tạo template mới khi chưa có nhu cầu thứ hai.

Page quyết định cột, schema, nhãn, tone trạng thái và format. Template quyết định bố cục và trạng thái hiển thị.

## 8. Luật mock data & routing

- Mock đặt trong `src/mocks/<domain>.mock.ts`, dữ liệu hư cấu, **không** thông tin cá nhân thật, không secret.
- Mock không được import vào `components/**` hay `templates/**`.
- Type dùng chung → `src/types/`; type chỉ dùng 1 file → khai báo tại file đó.
- Route khai báo tập trung ở `src/app/routes.tsx`, dùng helper `lazyPage()`; 404 giữ `ErrorPage`.
- Nav khai báo ở `src/config/nav.ts` — sidebar và breadcrumb cùng đọc file này. Thêm trang phải thêm nav (nếu người dùng cần thấy) và route.
- Dữ liệu vào template phải đã lọc/sắp xếp/format ở page. Phân trang/sắp xếp hiện chạy client.

## 9. Luật TypeScript

- Strict. Cấm `any` (dùng `unknown` + narrowing), cấm `@ts-ignore`/`@ts-expect-error`.
- Component function, không `class`. Props interface đặt trên component, tên `<Name>Props`.
- Đặt tên: component `PascalCase.tsx`, hook `use-kebab-case.ts`, util `kebab-case.ts`, type `PascalCase`.
- Import tuyệt đối qua alias `@/*`; không `../../..`.
- Class Tailwind ghép bằng `cn()` (`@/lib/utils`); không tạo class CSS mới nếu Tailwind đủ.
- Comment chỉ giải thích **vì sao**, một dòng. Không comment mô tả lại code.
- Không để `console.log` trong code giao nộp.

## 10. Responsive & accessibility

- Kiểm tối thiểu **375 / 768 / 1280 px**, không tràn ngang; bảng rộng cuộn trong card.
- Shell `h-dvh`, chỉ `<main>` scroll; không dùng `h-screen`.
- Tap target tối thiểu 24×24 (WCAG 2.2 AA); hành động chính/form dùng 44px; ngoại lệ ô nav sidebar collapsed 40×40 (đã ghi trong `UI_GUIDELINES.md` §10).
- Mỗi input có label; lỗi có text + `aria-invalid`, không chỉ đổi màu.
- Icon-only button có `aria-label`; icon trang trí `aria-hidden`.
- Dialog/Sheet dùng shadcn (focus trap + `Esc`); đóng dialog phải trả focus về trigger.
- Dòng bảng có `onRowClick` nhận focus, Enter/Space kích hoạt, bỏ qua click từ control trong ô.
- Skip link là tab stop đầu tiên; focus ring thấy rõ.

## 11. Testing & quality gate

Không thêm test framework chỉ để đủ checklist. Với logic mới không tầm thường (parser, tính tiền, lọc/aggregate), thêm một self-check nhỏ hoặc test chạy được bằng script hiện có.

Trước khi báo xong, chạy:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build
```

Rồi kiểm thủ công: mọi route bị ảnh hưởng, responsive 3 breakpoint, light/dark, keyboard, console 0 error.
Build warning phát ra từ dependency (ví dụ zod) không tính là lỗi repo; warning từ code repo phải sửa.

## 12. Git

- Không tự `git commit`/`git push`/`git tag` trừ khi được yêu cầu rõ.
- Không `git push --force`, không sửa/xoá thay đổi chưa commit của người khác.
- Không commit secrets, `.env` thật, `dist/`, `node_modules/`, dump dữ liệu.
- Không đổi remote, không publish npm, không đổi package name/scope khi chưa hỏi.
- Commit (khi được phép) phải nhỏ, thông điệp nói **vì sao**, không gộp file không liên quan.

## 13. Workflow theo phase

1. Đọc tài liệu + kiểm source + `git status`.
2. Xác định phạm vi: caller, route, nav config, type, mock, docs, skill liên quan.
3. Làm thay đổi **nhỏ nhất hoàn chỉnh**; không thêm option/abstraction "để sau".
4. Tự kiểm theo §11.
5. Cập nhật `HANDOFF.md` (Done / Doing / Next) sau milestone.
6. Quyết định kiến trúc → ghi `docs/architecture.md` §8.
7. Báo cáo kết quả phase rồi dừng. Không tự mở phase mới.

## 14. Handoff

Cuối phiên, cập nhật `HANDOFF.md`:

- Phase hiện tại, đã xong gì.
- File/component mới + cách dùng một dòng.
- Vấn đề chưa giải quyết + lý do.
- Việc kế tiếp cụ thể, đủ rõ để agent sau làm ngay.
- Lần kiểm cuối (lệnh + kết quả).

Không ghi lịch sử dài dòng; chỉ giữ thông tin cần để tiếp tục.

## 15. Cấm

- Sửa/xoá source ngoài repo này.
- Thêm backend, database, API thật, auth, RBAC.
- Publish npm hoặc biến repo thành package phát hành khi chưa được hỏi.
- Copy code/tài sản không có quyền.
- Thêm dependency mới mà chưa giải thích trong PR/mô tả.
- Xoá file không rõ nguồn gốc.
- Tuyên bố "đã kiểm" khi chưa chạy lệnh/không có bằng chứng.
