# HANDOFF

Cập nhật lần cuối: 2026-11-01 · Phase hiện tại: **7 xong phần repo — chờ thao tác GitHub của chủ repo**

## 1. Trạng thái

- Repo: `hoanghieu2385/admin-dashboard-kit` (private). HEAD là commit `docs: finalize GitHub template repository`; **6 commit chưa push** (đối chiếu `git log origin/main..HEAD`).
- Working tree: sạch.
- Chạy: `pnpm install --frozen-lockfile` → `pnpm dev` (http://localhost:5173).
- Showcase component: `/components` (nav "UI Kit").
- Không có backend/API/auth/RBAC. Demo dùng mock + local state.

## 2. Phase 6–7 đã xong

### Phase 7 — release readiness

- `LICENSE` MIT điền chủ sở hữu `Hieu Hoang`; README/CONTRIBUTING không còn nhắc placeholder.
- Review `cf6313b`: Issue Forms hợp lệ (YAML parse OK, label tồn tại), docs khớp source (23 admin component, `NavGroup[]`), không secret/file tạm/thay đổi ngoài phạm vi.
- Quality gate sau sửa: install/typecheck/lint/build pass, `git diff --check` sạch.
- Đã push 6 commit lên `origin/main` (fast-forward) và bật **Template repository** (`isTemplate: true`).
- Validation 7.5: tạo repo private từ template (`gh repo create --template`), AI fresh context chỉ nhận yêu cầu nghiệp vụ Warehouses → dùng đúng `ListTemplate`/`FormTemplate`/`DetailTemplate`, **0 component dùng chung mới, 0 dependency mới**; gate pass. Kiểm tự động 1280/768/375 × light/dark: `pageOverflow: false`, 0 console error.
- Sửa theo phát hiện của validation: bỏ `FilterBar` lồng trong ví dụ skill; đổi 3 mock cũ sang `*.mock.ts`; ghi rõ type của mock export tại file mock.
- Phát hành `v0.1.0`: tag + GitHub Release (`CHANGELOG.md`), repo chuyển public.
- Còn: xoá repo tạm `adk-template-check` (token `gh` thiếu scope `delete_repo`).

### Phase 6 — GitHub template readiness

- `README.md`: tính năng, stack, inventory, cài đặt, tạo page, theme, AI coding, tạo repo từ template, limitations, license.
- `LICENSE` MIT, chủ sở hữu `Hieu Hoang`.
- `CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`.
- `.github/ISSUE_TEMPLATE/`: `bug_report.yml`, `feature_request.yml` (GitHub Issue Forms).
- `package.json`: bỏ `next-themes`, `shadcn` CLI ở devDependencies, thêm `license`/`engines`/`description`.
- `.gitignore`: bỏ secret/build/cache; không còn đường dẫn máy cá nhân hay tên dự án nguồn trong repo.

### AI context

- `AGENTS.md` — hợp đồng chính; `CLAUDE.md` — entry point ngắn; `PROJECT_BRIEF.md` — phạm vi; `UI_GUIDELINES.md` — chuẩn thị giác; `HANDOFF.md` — file này.
- Không lặp bộ luật giữa các file; mỗi file một vai trò.

### Agent Skills

- `.agents/skills/`: `admin-ui-development`, `admin-ui-component`, `admin-ui-review`.
- `.claude/skills/*` là symlink tới `.agents/skills/*`.
- Frontmatter chỉ `name` + `description` (khớp Agent Skills standard); description 286–300 ký tự.
- Đã xác minh discovery: OpenCode (phiên này), Claude Code và Codex theo tài liệu chính thức. Chi tiết: `docs/tooling.md`.

### Tooling

- `docs/tooling.md`: ponytail, impeccable/frontend-design, Context7, Headroom — khi nào dùng, guardrail, không thêm dependency.

### Docs

- `docs/architecture.md` (cây thư mục, ranh giới, routing, D1–D24), `docs/components.md`, `docs/page-templates.md`, `docs/validation.md`, `docs/tooling.md`.
- Link markdown nội bộ: 0 broken; không còn tham chiếu file không tồn tại.

## 3. Validation

- Worktree tách biệt `/tmp/adk-validation/repo`, cây `src/` trùng commit `ed52fe0`, AI fresh context chỉ nhận yêu cầu nghiệp vụ Suppliers.
- Kết quả: dùng `ListTemplate`, `FormTemplate` (create + edit), `DetailTemplate`, `DataTable`, `SearchInput`, `StatusBadge`; **0 component dùng chung mới**, 0 dependency mới; 4 route lazy + nav.
- Kiểm lại 2026-11-01 bởi session chính: `pnpm install --frozen-lockfile`, `typecheck`, `lint`, `build` đều pass.
- Chi tiết prompt/metric/hạn chế: `docs/validation.md`. Module Suppliers **không** nằm trong repo chính.

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

Tổng: 23 admin component (+1 hook) và 23 shadcn/ui primitive. API: `docs/components.md`, `docs/page-templates.md`.

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

## 6. Quality gate lần cuối (2026-11-01)

| Lệnh | Kết quả |
| --- | --- |
| `pnpm install --frozen-lockfile` | pass (lockfile không đổi) |
| `pnpm typecheck` | pass, không output |
| `pnpm lint` | pass, 0 error/warning |
| `pnpm build` | pass (~5,5s); chunk lớn nhất `charts` 381,93 kB (gzip 111,19) |
| Phase 7 re-check (cùng ngày) | install/typecheck/lint/build pass; `git diff --check` sạch |
| Validation repo (cùng ngày) | install/typecheck/lint/build pass (~6,1s) |
| Browser smoke validation repo | `/suppliers`, `/suppliers/new`, `/suppliers/NCC-1001`: render đúng, 0 console error, không tràn ngang ở 1000px |

Build warning từ `zod` (`@__PURE__`) phát ra từ dependency, không phải code repo.

## 7. Known issues

1. Lazy route: điều hướng client-side giữ trang cũ tới khi chunk xong (không có Suspense boundary theo route).
2. Bảng nhiều cột ở mobile phải cuộn ngang trong card — đúng guideline; muốn gọn hơn phải ẩn cột/dựng card list.
3. Chart dark dùng thang xám trung tính, chưa có palette riêng cho dark.
4. Mutation demo là local/in-memory: reload hoặc rời trang sẽ reset; list và detail không chia sẻ state (đúng chủ trương no-backend).
5. `DateFilter` dùng `<input type="date">` native, format theo locale trình duyệt.
6. Symlink skill cần Developer Mode trên Windows; nếu không, copy thủ công vào `.claude/skills/` (không commit bản copy).
7. Chưa có test framework; chưa chạy axe/Lighthouse toàn site. UI validation là kiểm tay/headless Chrome, không phải CI tự động.
8. Chưa có GitHub Actions CI; quality gate hiện chạy tay.

## 8. Việc kế tiếp

**Người dùng:**

1. Xoá repo tạm `hoanghieu2385/adk-template-check`: `gh auth refresh -s delete_repo` rồi `gh repo delete adk-template-check --yes`, hoặc xoá trên GitHub UI.

**Tùy chọn:**

2. Thêm GitHub Actions chạy `typecheck/lint/build` nếu muốn chặn PR lỗi.
3. Chạy axe/Lighthouse định kỳ; thêm script kiểm 3 breakpoint nếu review tay quá chậm.
4. `pnpm create:page` — chưa làm vì chưa có nhu cầu lặp lại đủ lớn.
