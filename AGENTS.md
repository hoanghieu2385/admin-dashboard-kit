# AGENTS.md

Hợp đồng làm việc cho mọi AI coding agent (Claude Code, OpenCode, Codex, Cursor, Windsurf…) trong repo này.
Đọc file này trước khi sửa code. Chi tiết kỹ thuật: `docs/architecture.md`. Chuẩn thị giác: `UI_GUIDELINES.md`. Trạng thái hiện tại: `HANDOFF.md`.

## 1. Project là gì

`admin-dashboard-kit` — Admin Dashboard UI Kit tái sử dụng: design system + admin components + page templates + demo, **không có backend**. Mọi dữ liệu trong demo là mock + local state.

Mục tiêu: dự án mới chỉ cần mô tả nghiệp vụ, tái sử dụng có sẵn, không thiết kế lại.

## 2. Stack đã chốt

React 19 · TypeScript 5.9 (strict) · Vite 7 · Tailwind CSS v4 · shadcn/ui (Radix) · React Router 7 · TanStack Table 8 · React Hook Form 7 + Zod 4 · Sonner · Recharts · date-fns · Lucide · pnpm.

Không đổi stack, không thêm dependency trùng chức năng, không thêm framework CSS khác.

## 3. Bản đồ thư mục

Xem `docs/architecture.md` §2. Tóm tắt:

- `src/components/ui/` — shadcn/ui primitives. Không fork, không sửa API.
- `src/components/{layout,navigation,data-display,data-table,forms,feedback,common}/` — admin components dùng chung.
- `src/templates/` — 6 page template, chỉ nhận props.
- `src/pages/examples/` — demo gắn mock data.
- `src/{app,lib,hooks,types,config,mocks,styles}/` — hạ tầng.

Luật phụ thuộc: `pages → templates → components → components/ui`. Không import ngược. `components/**` không biết `pages/**`, `mocks/**`, không gọi API.

## 4. Quy ước code

- TypeScript strict. Cấm `any` (dùng `unknown` + narrowing), cấm `@ts-ignore`/`@ts-expect-error`.
- Component function, không `class`. Props interface đặt trên component, đặt tên `<Name>Props`.
- Type dùng chung → `src/types/`; type chỉ dùng trong 1 file → khai báo tại file đó.
- Đặt tên: file component `PascalCase.tsx`, hook `use-kebab-case.ts`, util `kebab-case.ts`, type `PascalCase`.
- Import tuyệt đối qua alias `@/*`. Không `../../..`.
- Class Tailwind ghép bằng `cn()`; không tạo class CSS mới nếu Tailwind đủ.
- Comment chỉ để giải thích **vì sao**, một dòng. Không comment mô tả lại code.
- Không để `console.log` trong code giao nộp.

## 5. Luật tái sử dụng component

Thứ tự bắt buộc khi cần một UI:

1. Đã có trong `src/components/**`? → dùng.
2. shadcn/ui có? → `pnpm dlx shadcn@latest add <component>` (không tự viết).
3. Radix có primitive phù hợp? → bọc theo phong cách shadcn.
4. Ghép được từ 2–3 component sẵn có? → composition trong `components/common/`.
5. Chỉ khi (1)–(4) đều không → tự viết, đặt đúng thư mục theo bảng ở `docs/architecture.md` §3.

Component mới phải: không phụ thuộc dữ liệu cụ thể, dữ liệu qua props, hành vi qua callback, có `className` để override, responsive, dark mode, keyboard/`aria` cơ bản.

## 6. Luật design system

- Chỉ dùng token: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-destructive`… **Không** hardcode hex/`slate-*` trong component dùng chung (ngoại lệ: demo page muốn minh họa tone).
- Light + dark phải cùng đẹp. Kiểm tra trước khi xong việc.
- Chi tiết token, layout, responsive, anti-pattern: `UI_GUIDELINES.md`. Không tự sáng tạo giá trị mới (radius, spacing, font) nếu token đã có.

## 7. Workflow

1. **Đọc trước khi viết:** `HANDOFF.md` → file liên quan → tìm component tương tự đã có.
2. Xác định phạm vi: mọi nơi thay đổi phải chạm tới (caller, route, nav config, type, mock, docs).
3. Làm thay đổi **nhỏ nhất hoàn chỉnh**; không thêm option/abstraction "để sau".
4. Tự kiểm: `pnpm typecheck` → `pnpm lint` → `pnpm build` → mở app kiểm tra UI/responsive/console.
5. Cập nhật `HANDOFF.md` (mục Done / Doing / Next) sau mỗi milestone.
6. Quyết định kiến trúc → ghi vào `docs/architecture.md` §8.

Không chuyển phase khi chưa báo cáo kết quả phase trước.

## 8. Quality gate (không được bỏ qua)

- [ ] `pnpm typecheck` sạch
- [ ] `pnpm lint` sạch
- [ ] `pnpm build` thành công
- [ ] Không lỗi/warning trong console trình duyệt
- [ ] Responsive: 375 / 768 / 1280 px
- [ ] Light + dark
- [ ] Bàn phím: Tab tới được mọi control, focus thấy rõ, `Esc` đóng dialog
- [ ] Không hardcode màu ngoài token
- [ ] Component mới tái sử dụng được (không gắn nghiệp vụ)
- [ ] Docs/HANDOFF đã cập nhật

Nếu build/type lỗi → sửa, không đánh dấu hoàn thành.

## 9. Cấm

- Sửa/xoá source dự án tham chiếu `baolochp`.
- Thêm backend, database, API thật, auth, RBAC.
- Publish npm, đổi package name/scope khi chưa hỏi.
- Copy code/tài sản không có quyền.
- Commit secrets, `.env` thật, dump dữ liệu.
- `git push --force`, xoá file không rõ nguồn gốc.
- Thêm dependency mới mà chưa giải thích trong PR/mô tả.

## 10. Handoff

Trước khi kết thúc phiên làm việc, cập nhật `HANDOFF.md`:

- Đang ở phase nào, đã xong gì.
- File/component mới, cách dùng 1 dòng.
- Vấn đề chưa giải quyết + lý do.
- Việc kế tiếp cụ thể (đủ rõ để agent sau làm ngay).
