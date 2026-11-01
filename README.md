# admin-dashboard-kit

Admin Dashboard UI Kit tái sử dụng — React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui.

Design system, layout, admin components và page templates đóng gói sẵn để dự án mới chỉ cần mô tả nghiệp vụ, không phải thiết kế lại từ đầu.

> Trạng thái: **Phase 2 — Foundation xong**, chưa có component/template nghiệp vụ (Phase 3–4).

## Tài liệu

| File | Nội dung |
| --- | --- |
| `PROJECT_BRIEF.md` | Mục tiêu, phạm vi, stack, nguyên tắc |
| `docs/architecture.md` | Kiến trúc, ranh giới tầng, version strategy, roadmap |
| `UI_GUIDELINES.md` | Design tokens, layout, responsive, accessibility, anti-patterns |
| `AGENTS.md` | Luật làm việc cho AI coding agent |
| `CLAUDE.md` | Bổ sung cho Claude Code |
| `HANDOFF.md` | Trạng thái hiện tại & việc kế tiếp |

## Bắt đầu

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm typecheck  # tsc --noEmit
pnpm lint
pnpm build
```

## Cấu trúc

```
src/
  app/          router, providers
  components/   ui/ layout/ navigation/ data-display/ data-table/ forms/ feedback/ common/
  layouts/      AdminLayout
  templates/    dashboard/ list/ create/ edit/ detail/ settings/
  pages/        demo (mock data)
  hooks/ lib/ config/ types/ mocks/ styles/
```

Không có backend, database, API hay authentication — mọi dữ liệu demo là mock + local state.
