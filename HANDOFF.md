# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **6 xong — chờ người dùng commit/publish**

## 1. Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). HEAD `61f11d3` (Phase 1–5 đã commit).
- Toàn bộ thay đổi Phase 6 **chưa commit** (docs, AI context, skills, tooling, dependency cleanup, LICENSE placeholder).
- Chạy: `pnpm install --frozen-lockfile` → `pnpm dev` (http://localhost:5173).
- Showcase component: `/components` (nav "UI Kit").
- Không có backend/API/auth/RBAC. Demo dùng mock + local state.

## 2. Phase 6 đã xong

### GitHub template readiness

- `README.md` viết lại: tính năng, stack, inventory component/template, cài đặt, tạo page, theme, AI coding, tạo repo từ template, limitations, license.
- `LICENSE` MIT với `[COPYRIGHT HOLDER]` — **người dùng phải điền** trước publish.
- `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
- `.gitignore` thêm `.claude/settings.local.json`, `*.tsbuildinfo`; không còn secret/build/cache tracked.
- `package.json`: bỏ `next-themes` (không dùng), chuyển `shadcn` CLI sang devDependencies, thêm `license`/`engines`/`description`.
- Không còn tham chiếu đường dẫn máy cá nhân, dự án nguồn hay tài liệu không tồn tại.

### AI context

- `AGENTS.md`: hợp đồng đầy đủ (đọc trước, kiến trúc, component reuse, shadcn, page, mock/route, TS, responsive/a11y, quality gate, Git, phase, handoff).
- `CLAUDE.md`: entry point ngắn, thứ tự đọc + skill + Claude-specific.
- `PROJECT_BRIEF.md`: ổn định, bỏ log phase/local path; thêm design/AI strategy + giới hạn.
- `UI_GUIDELINES.md`: nguồn duy nhất; thêm buttons/forms/tables/dialogs/charts/states/dark mode; sửa tap target theo thực tế (24px AA, 44px cho form).
- `HANDOFF.md`: chuẩn hóa thành bàn giao ngắn (file này).

### Agent Skills

- `.agents/skills/admin-ui-development/SKILL.md`
- `.agents/skills/admin-ui-component/SKILL.md`
- `.agents/skills/admin-ui-review/SKILL.md`
- `.claude/skills/*` là symlink tới `.agents/skills/*` cho Claude Code.
- OpenCode đã discover cả 3; Codex đọc `.agents/skills`; Claude Code đọc `.claude/skills`. Chi tiết + giới hạn công cụ: `docs/tooling.md`.

### Tooling

- `docs/tooling.md`: workflow phối hợp ponytail, impeccable/frontend-design, Context7, Headroom; guardrail không đổi design system; không thêm dependency.

### Docs audit

- `docs/architecture.md`: cây thư mục thật, bỏ tài liệu không tồn tại, cập nhật roadmap Phase 1–6, thêm D21–D24.
- `docs/components.md`: thêm layout (`AdminShell/Header/Sidebar/PageHeader/ThemeToggle`), quy ước chung, sửa mô tả `caption`.
- `docs/page-templates.md`: thêm ghi chú `filters` đã được bọc `FilterBar`.
- `docs/validation.md`: biên bản validation dự án mới.
- Sửa comment stale trong `index.html` để trỏ đúng file theme hiện tại.

## 3. Validation

- Chạy trong worktree tách biệt `/tmp/adk-validation/repo`, overlay thay đổi Phase 6, `pnpm install --frozen-lockfile`.
- AI fresh context chỉ nhận yêu cầu nghiệp vụ "Suppliers Management", không được giải thích kiến trúc.
- Kết quả: chọn đúng `ListTemplate`, `FormTemplate` (create + edit), `DetailTemplate`, `DataTable`, `SearchInput`, `StatusBadge`; **0 component dùng chung mới**, 0 dependency mới; 4 route lazy + nav; typecheck/lint/build pass; responsive + light/dark + console 0 error (theo phạm vi đã kiểm).
- Chi tiết prompt, metric, vấn đề phát hiện: `docs/validation.md`.
- Module Suppliers **không** được đưa vào repo chính.

## 4. Component & template hiện có

| Tầng | Danh sách |
| --- | --- |
| Layout/nav | `AdminShell`, `AdminHeader`, `AdminSidebar`, `PageHeader`, `Breadcrumbs`, `useBreadcrumbs`, `ThemeToggle` |
| Data display | `StatCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`, `DescriptionList` |
| Data table | `DataTable`, `Pagination`, `SortableHeader` |
| Filters | `SearchInput`, `FilterBar`, `DateFilter` |
| Forms | `FormField`, `FormSection`, `FormActions` |
| Feedback/common | `ConfirmDialog`, `SectionCard` |
| Templates | `DashboardTemplate`, `ListTemplate`, `FormTemplate`, `DetailTemplate`, `SettingsTemplate` |

API: `docs/components.md`, `docs/page-templates.md`.

## 5. File quan trọng

| File | Vai trò |
| --- | --- |
| `AGENTS.md` | luật cho mọi AI agent |
| `CLAUDE.md` | entry point Claude Code |
| `PROJECT_BRIEF.md` | bản chất sản phẩm, phạm vi |
| `UI_GUIDELINES.md` | nguồn duy nhất về giao diện |
| `docs/architecture.md` | tầng, ranh giới, routing, quyết định |
| `docs/tooling.md` | skills + công cụ AI |
| `docs/validation.md` | biên bản kiểm chứng template |
| `src/app/routes.tsx`, `src/config/nav.ts` | routing + nav tập trung |
| `src/styles/globals.css` | token light/dark |

## 6. Quality gate lần cuối

| Lệnh | Kết quả |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass |
| `pnpm typecheck` | pass, không output |
| `pnpm lint` | pass, 0 error/warning |
| `pnpm build` | pass (~6s); chunk lớn nhất `charts` 381,93 kB (gzip 111,19) |
| Browser smoke (dev) | `/`, `/customers`, `/orders`, `/orders/DH-5028`, `/reports`, `/settings`, `/components`, 404: đúng trang, 0 console error, 0 request 4xx/5xx, không tràn ngang desktop |
| License audit (`pnpm licenses list --prod`) | 141 package: MIT/ISC/BSD/Apache-2.0/OFL/0BSD; không GPL/unknown |

Build warning từ `zod` (`@__PURE__` annotation) phát ra từ dependency, không phải code repo.

## 7. Known issues

1. Lazy route: điều hướng client-side giữ trang cũ tới khi chunk xong (không có Suspense boundary theo route).
2. Bảng nhiều cột ở mobile phải cuộn ngang trong card — đúng guideline; muốn gọn hơn phải ẩn cột/dựng card list.
3. Chart dark dùng thang xám trung tính, chưa có palette riêng cho dark.
4. Mutation demo là local/in-memory: reload hoặc rời trang sẽ reset; thay đổi ở list không lan sang detail (đúng chủ trương no-backend).
5. KPI doanh thu/AOV rút gọn (`82,8 Tr ₫`) ở card 4 cột; số chính xác ở tooltip/bảng/trang đơn.
6. `DateFilter` dùng `<input type="date">` native, format theo locale trình duyệt.
7. `LICENSE` chưa có tên chủ sở hữu.
8. Skill symlink cần Developer Mode trên Windows; nếu không, copy thủ công vào `.claude/skills/` (không commit bản copy).
9. Chưa có test framework; logic thuần hiện được kiểm qua UI/self-check. Chưa chạy axe/Lighthouse toàn site.

## 8. Việc kế tiếp

1. **Người dùng**: điền `[COPYRIGHT HOLDER]` trong `LICENSE`.
2. Review diff Phase 6; commit (gợi ý tách `docs/ai-context`, `chore/deps`, `docs/validation` nếu muốn lịch sử gọn).
3. Push lên GitHub; bật **Settings → General → Template repository**.
4. (Tùy chọn) tag `v0.1.0` sau khi commit.
5. (Tùy chọn) chạy axe/Lighthouse; thêm script kiểm 3 breakpoint nếu muốn tự động hóa.
6. (Tùy chọn) thêm `pnpm create:page` — chưa làm vì chưa có nhu cầu lặp lại đủ lớn.
