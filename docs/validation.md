# Validation — dự án mới từ template

Biên bản kiểm chứng Phase 6: một AI session **fresh context** nhận repo như template mới và tự xây một module nghiệp vụ.

- Ngày: 2026-11-01
- Cách chạy: Git worktree tại `61f11d3` trong `/tmp/adk-validation/repo`, overlay toàn bộ thay đổi Phase 6 (chưa commit), `pnpm install --frozen-lockfile`.
- Repo chính **không** chứa module Suppliers; đây là bài kiểm, không phải demo sản phẩm.

## 1. Prompt dùng nguyên văn

```text
You are a fresh AI coding session starting a NEW project from the
`admin-dashboard-kit` GitHub template. Work ONLY inside `/tmp/adk-validation/repo`.

Before coding, discover the project's own instructions and read them: README, AGENTS.md,
CLAUDE.md, PROJECT_BRIEF.md, HANDOFF.md, UI_GUIDELINES.md, everything in docs/, and
the Agent Skills. Follow the repository rules exactly; they are the source of truth.

Business request (the only requirements you get):
"Xây dựng module quản lý nhà cung cấp (Suppliers Management) gồm: danh sách nhà cung cấp;
tìm kiếm và lọc; thêm nhà cung cấp; chỉnh sửa; xem chi tiết; trạng thái hoạt động; mock data."

Implement it completely in this copy, including navigation and routes, using the kit's
existing templates/components. No backend, API, auth, RBAC or new dependencies.
Data is mock + local state. UI copy in Vietnamese.
```

Không kèm giải thích kiến trúc, không chỉ định template/component, không gợi ý file.

## 2. Tài liệu AI đã đọc

`README.md`, `AGENTS.md`, `CLAUDE.md`, `PROJECT_BRIEF.md`, `HANDOFF.md`, `UI_GUIDELINES.md`,
`CONTRIBUTING.md`, `docs/architecture.md`, `docs/components.md`, `docs/page-templates.md`,
`docs/tooling.md`, cả 3 skill trong `.agents/skills/`, cùng source thật (`routes`, `nav`,
`templates`, `DataTable`, `FilterBar`, `FormField`, mock mẫu, page Customers/Products/Orders).

## 3. Kết quả

### Chọn đúng tầng

| Yêu cầu | Cách làm |
| --- | --- |
| Danh sách + tìm kiếm/lọc | `ListTemplate` + `DataTable` (qua template) + `SearchInput` + `Select` |
| Thêm mới | `FormTemplate` (`mode="create"`) + `FormField` + `FormSection` |
| Chỉnh sửa | dùng lại `FormTemplate` (`mode="edit"`), một page qua `useParams` |
| Chi tiết | `DetailTemplate` + `SectionCard` + `DescriptionList` + `StatusBadge` |
| Trạng thái hoạt động | enum `active/paused/inactive`, map nhãn + tone ở page/mock; filter theo trạng thái |
| Mock data | `src/types/supplier.ts` + `src/mocks/suppliers.mock.ts` (12 bản ghi hư cấu) |
| Routing/nav | 4 route lazy `lazyPage()` + mục nav `Nhà cung cấp` (breadcrumb tự có) |

### Tái sử dụng

- Template: `ListTemplate`, `FormTemplate`, `DetailTemplate`.
- Component: `DataTable`, `SortableHeader`, `SearchInput`, `StatusBadge`, `EmptyState`,
  `FormField`, `FormSection`, `FormActions`, `SectionCard`, `DescriptionList`, `PageHeader`.
- shadcn/ui: `Button`, `Input`, `Textarea`, `Select`.
- **Component dùng chung mới: 0.** Không có wrapper/primitive mới.
- Dependency mới: 0. Token/design system: không đổi.

### File sinh ra

```text
src/types/supplier.ts
src/mocks/suppliers.mock.ts
src/pages/suppliers/SuppliersPage.tsx
src/pages/suppliers/SupplierFormPage.tsx
src/pages/suppliers/SupplierDetailPage.tsx
src/app/routes.tsx        (sửa)
src/config/nav.ts         (sửa)
```

Route: `/suppliers`, `/suppliers/new`, `/suppliers/:supplierId`, `/suppliers/:supplierId/edit`.

### Quality gate (chạy lại độc lập bởi session chính)

- `pnpm install --frozen-lockfile` → pass.
- `pnpm typecheck` → exit 0.
- `pnpm lint` → exit 0.
- `pnpm build` → exit 0, `✓ built in 5.97s`.
- Chunk mới: `SuppliersPage 3.93 kB`, `SupplierFormPage 4.85 kB`, `SupplierDetailPage 2.58 kB`, `suppliers.mock 4.93 kB`.

### Kiểm UI (session validation)

- 1280/768/375: không tràn ngang ở document/main; bảng cuộn trong card ở 768/375.
- Light + dark: đã xem list/detail/form; console 0 error.
- Flow: search "An Phát" → 1 dòng; lọc trạng thái "Tạm ngưng" → 3; lọc danh mục "Vận chuyển" → 2;
  reset → 8; empty state + reset hoạt động; tạo `NCC-1013`; sửa → detail đổi tên; danh sách thấy bản ghi mới.
- Bàn phím: Tab đầu = skip link; Enter trên dòng đang focus mở detail.
- Chưa làm: axe/Lighthouse, full tab order, mobile drawer, focus-return (module không có dialog).

## 4. Vấn đề phát hiện & đã xử lý

| Vấn đề | Xử lý |
| --- | --- |
| `README`/`architecture` nhắc `docs/validation.md` nhưng file chưa có | Tạo file này |
| `docs/components.md` nói `caption` "cho screen reader", thực tế `DataTable` render caption nhìn thấy | Sửa docs mô tả đúng |
| `ListTemplate.filters` đã bọc `FilterBar`; dễ truyền lồng `FilterBar` | Thêm ghi chú rõ trong `docs/page-templates.md` |
| Mutation "thêm/sửa" biến mất khi reload (mock + local state) | Giữ đúng chủ trương no-backend; validation dùng module store trong RAM, ghi `shortcut:`; đã có trong Limitations |
| Skill không tự hiện như slash command trong session validation | Session validation đọc trực tiếp `.agents/skills/`; OpenCode chính đã discover cả 3 skill. Claude Code/Codex discovery đã kiểm theo tài liệu chính thức (xem `docs/tooling.md`) |

## 5. Đánh giá

**Pass.** AI hiểu kiến trúc mà không cần giải thích lại, chọn đúng 3 template, không tạo component/dependency mới,
đặt mock/type/nav/route đúng chỗ và tự chạy quality gate.

Điểm cần cải thiện (không chặn phát hành):

- Quy ước mutation demo nên nói rõ hơn ở `PROJECT_BRIEF`/`HANDOFF`: state trong RAM hay page-local.
- Có thể thêm ví dụ "create/edit dùng chung page" vào `docs/page-templates.md` để giảm suy luận.
- Nên có script/checklist tự động cho 3 breakpoint + console nếu muốn review nhanh hơn; hiện kiểm tay/headless Chrome.
- Chưa có axe/Lighthouse trong quality gate; nên chạy định kỳ, không thêm dependency runtime.
